import {Duration} from './Mining'

export type Site = {
    name: string;
    image: string;
    token: Token;
    miningState: MiningState;
    api: Api;
    apy: number;
    fee: number;
  };

  export type Token = {
    address: string;
    price: number;
    supply: number;
    symbol: string;
    gnosisscanUrl : string;
  }

  export type Api = {
    username: string | undefined;
    url: string | undefined;
    filters: TimeFilter[];
  }


  export type TimeFilter = {
    label: string,
    duration: Duration,
  }




  export enum MiningState {
    active = 'active',
    inactive = 'inactive',
    stopped = 'stopped',
  }

  export type Income = {
    usd: number;
    btc: number;
  }