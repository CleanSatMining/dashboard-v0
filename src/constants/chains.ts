import { FC } from 'react';

import {
  EthereumLogo,
  GnosisLogo,
  Chain as RealtChains,
} from '@realtoken/realt-commons';

import { realTokenYamUpgradeableABI } from 'src/abis';

import { Contracts, ContractsID } from './contracts';
import { Currency, DAI, ETH } from './currencies';

export enum ChainsID {
  Gnosis = 0x64,
}

export type Chain = Omit<RealtChains, 'blockExplorerUrl'> & {
  chainId: ChainsID;
  chainName: string;
  logo: FC;
  nativeCurrency: Currency;
  rpcUrl: string;
  blockExplorerUrl: string;
  contracts: Contracts;
};

export const CHAINS: Record<ChainsID, Chain> = {
  [ChainsID.Gnosis]: {
    chainId: ChainsID.Gnosis,
    chainName: 'Gnosis Chain',
    logo: GnosisLogo,
    nativeCurrency: DAI,
    rpcUrl: 'https://rpc.ankr.com/gnosis',
    blockExplorerUrl: 'https://gnosisscan.io/',
    isTestnet: false,
    contracts: {
      [ContractsID.realTokenYamUpgradeable]: {
        abi: realTokenYamUpgradeableABI,
        address: '0xc759aa7f9dd9720a1502c104dae4f9852bb17c14',
        metadata: { fromBlock: 25530390 },
      },
    },
  },
};

export const URLS = Object.keys(CHAINS).reduce<Record<number, string>>(
  (accumulator, chainId) => {
    accumulator[Number(chainId)] = CHAINS[Number(chainId) as ChainsID].rpcUrl;
    return accumulator;
  },
  {}
);

export const ALLOWED_CHAINS = Object.keys(URLS).map((chainId) =>
  Number(chainId)
);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
