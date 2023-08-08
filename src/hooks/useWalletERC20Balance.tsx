import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

import BigNumber from 'bignumber.js';

import { Erc20, Erc20ABI } from 'src/abis';
import { WalletERC20Balance } from 'src/components/WalletBalance/WalletERC20Balance';
import { getContract } from 'src/utils';

interface TokenInfos {
  balance: BigNumber;
  symbol: string;
  decimals: string;
  address?: string;
}

interface UseWalletERC20Balance {
  bigNumberbalance: BigNumber | undefined;
  balance: string | undefined;
  WalletERC20Balance: any;
}

export const useWalletERC20Balance = (
  tokenAddress: string | undefined,
  accountAddress: string | undefined = undefined
): UseWalletERC20Balance => {
  const [bigNumberbalance, setBigNumberbalance] = useState<
    BigNumber | undefined
  >(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
  const { account, provider } = useWeb3React();

  if (accountAddress == undefined) {
    accountAddress = account;
  }

  const contract = getContract<Erc20>(
    tokenAddress ?? '',
    Erc20ABI,
    provider as Web3Provider,
    accountAddress
  );

  const getTokenInfos = async (): Promise<TokenInfos> => {
    return new Promise<TokenInfos>(async (resolove, reject) => {
      try {
        if (!contract || !accountAddress) return;

        const balance = new BigNumber(
          (await contract.balanceOf(accountAddress)).toString()
        );
        const decimals = new BigNumber((await contract.decimals()).toString());
        const tokenSymbol = await contract?.symbol();

        resolove({
          balance: balance,
          symbol: tokenSymbol ?? '',
          decimals: decimals.toString() ?? '',
        });
      } catch (err) {
        console.log('Failed to get wallet balance: ', err);
        reject(err);
      }
    });
  };

  const { data, refetch } = useQuery([tokenAddress], getTokenInfos, {
    enabled: !!provider && !!tokenAddress && !!account,
  });

  useEffect(() => {
    if (tokenAddress) {
      setBigNumberbalance(undefined);
      setTokenSymbol(undefined);
      setBalance(undefined);
      refetch();
    }
  }, [tokenAddress, accountAddress, refetch]);

  useEffect(() => {
    if (data) {
      setBigNumberbalance(data.balance);
      setTokenSymbol(data.symbol);
      setBalance(data.balance.shiftedBy(-data.decimals).toFixed(10).toString());
    }
  }, [data]);

  const Component: FC = (): React.ReactElement => (
    <WalletERC20Balance balance={balance} symbol={tokenSymbol} />
  );

  return {
    WalletERC20Balance: Component,
    bigNumberbalance: bigNumberbalance,
    balance: balance,
  };
};

export interface Balance {
  bigBalance: BigNumber;
  balance: number;
  symbol: string;
}

interface UseWalletERC20Balances {
  balances: { [tokenAddress: string]: Balance };
  account: string;
}

export const useWalletERC20Balances = (
  tokenAddresses: string[],
  accountAddress: string | undefined = undefined,
  loadingCompleteCallback?: any
): UseWalletERC20Balances => {
  const [balances, setBalances] = useState<{ [tokenAddress: string]: Balance }>(
    {}
  );
  const { account, provider } = useWeb3React();

  if (accountAddress == undefined) {
    accountAddress = account;
  }

  useEffect(() => {
    if (loadingCompleteCallback) {
      loadingCompleteCallback(false);
    }
    const contracts: Erc20[] = [];
    console.log('WARNING account changed : RELOAD for', account);

    for (const token of tokenAddresses) {
      const abi = getContract<Erc20>(
        token,
        Erc20ABI,
        provider as Web3Provider,
        accountAddress
      );
      if (abi !== undefined) {
        contracts.push(abi);
      }
    }
    const getTokensInfos = async (): Promise<TokenInfos[]> => {
      return new Promise<TokenInfos[]>(async (resolve, reject) => {
        const tokenInfos: TokenInfos[] = [];
        for (const contract of contracts) {
          try {
            if (!contract || !accountAddress) return;

            const balance = new BigNumber(
              (await contract.balanceOf(accountAddress)).toString()
            );
            const decimals = new BigNumber(
              (await contract.decimals()).toString()
            );
            const tokenSymbol = await contract?.symbol();
            const address = contract.address;
            tokenInfos.push({
              balance: balance,
              symbol: tokenSymbol ?? '',
              decimals: decimals.toString() ?? '',
              address: address,
            });
          } catch (err) {
            console.log('Failed to get wallet balance: ', err);
            reject(err);
          }
        }
        console.log(
          'useEffect BALANCE',
          accountAddress,
          JSON.stringify(tokenInfos, null, 4)
        );
        setBalances(extractBalances(tokenInfos));
        if (loadingCompleteCallback) {
          loadingCompleteCallback(true);
        }

        resolve(tokenInfos);
      });
    };
    getTokensInfos();
  }, [accountAddress, provider]);

  return {
    balances: balances,
    account: accountAddress ?? '',
  };
};
function extractBalances(data: TokenInfos[]) {
  const tempBalances: { [tokenAddress: string]: Balance } = {};
  for (const tokenInfo of data) {
    tempBalances[tokenInfo.address ?? ''] = {
      balance: Number(
        tokenInfo.balance.shiftedBy(-tokenInfo.decimals).toFixed(10)
      ),
      bigBalance: tokenInfo.balance,
      symbol: tokenInfo.symbol,
    };
  }
  return tempBalances;
}
