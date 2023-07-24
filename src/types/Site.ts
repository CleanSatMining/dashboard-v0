export type Site = {
    name: string;
    image: string;
    token: Token;
    miningState: MiningState;
    api: Api;
    apy: number;
    fee: number;
    mining: Mining;
  };

  export type Token = {
    address: string;
    price: number;
    supply: number;
    symbol: string;
    gnosisscanUrl : string;
  }

  export type TokenBalance = {
    address: string;
    balance: number;
    symbol: string;
    usd : number;
  }

  export type Api = {
    username: string | undefined;
    url: string | undefined;
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

  export type Mining = {
    electricity:{
      usdPricePerKWH: number;
    }
    asics:{
      powerW: number;
      units: number;
    }

  }

  export type Yield ={
    usd: number;
    btc: number;
    apr: number;
  }