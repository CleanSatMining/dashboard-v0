import { AllowedToken } from 'src/types/allowedTokens';
import { UsdcSvg } from '../assets/currency/Usdc';
import { EthSvg } from '../assets/currency/Eth';
import { DaiSvg } from '../assets/currency/Dai';
import { UsdtSvg } from '../assets/currency/usdt';

export const goerliAllowedTokens: AllowedToken[] = [
  {
    name: 'USDCRealT',
    symbol: 'USDCRealT',
    contractAddress: '0x3e7493506Bc350Ed7f5344196B1842185753bde1',
    logo: UsdcSvg
  },
  {
    name: 'WETHRealT',
    symbol: 'WETHRealT',
    contractAddress: '0x292C5840EfE7C3282Ad2EB88a53cDBF2841F0917',
    logo: EthSvg
  },
  {
    name: 'WXDAIRealT',
    symbol: 'WXDAIRealT',
    contractAddress: '0x803029DB36f37D130d8A005A62c55D17383f6f15',
    logo: DaiSvg
  },
];
export const ethereumAllowedTokens: AllowedToken[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    logo: UsdcSvg
  },
  {
    name: 'Dai',
    symbol: 'DAI',
    contractAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
    logo: DaiSvg
  },
  {
    name: 'Tether USDT',
    symbol: 'USDT',
    contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    logo: UsdtSvg
  },
  {
    name: 'Liquity USD',
    symbol: 'LUSD',
    contractAddress: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
  },
];
export const gnosisAllowedTokens: AllowedToken[] = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    contractAddress: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
    logo: UsdcSvg
  },
  {
    name: 'Wrapped XDAI',
    symbol: 'WXDAI',
    contractAddress: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    logo: DaiSvg
  },
  {
    name: 'RMM Xdai',
    symbol: 'armmWXDAI',
    contractAddress: '0x7349C9eaA538e118725a6130e0f8341509b9f8A0',
    logo: DaiSvg
  },
  {
    name: 'Mai stablecoin',
    symbol: 'MAI',
    contractAddress: '0x3f56e0c36d275367b8c502090edf38289b3dea0d',
  },
];