import { FC } from 'react';
import { GnosisLogo, Chain as RealtChains } from '@realtoken/realt-commons';

import { realTokenYamUpgradeableABI } from 'src/abis';

import { Contracts, ContractsID } from './contracts';
import { Currency, DAI } from './currencies';

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
        address: '0x7ac028f8fe6e7705292dc13e46a609dd95fc84ba',
        metadata: { fromBlock: 27516835 },
      },
    },
  },
};

export const URLS = Object.keys(CHAINS).reduce<Record<number, string>>(
  (accumulator, chainId) => {
    accumulator[Number(chainId)] = CHAINS[Number(chainId) as ChainsID].rpcUrl;
    return accumulator;
  },
  {},
);

export const ALLOWED_CHAINS = Object.keys(URLS).map((chainId) =>
  Number(chainId),
);

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
