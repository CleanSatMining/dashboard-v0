export type Site = {
    name: string;
    location: string;
    image: string;
    token: Token;
    status: MiningStatus;
    api: Api;
    mining: Mining;
    fees: Fees;
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
    contractor: Contractor | undefined;
  }


  export enum MiningStatus {
    active = 'active',
    inactive = 'inactive',
    stopped = 'stopped',
  }

  export enum Contractor {
    LUXOR = 'LUXOR',
    ANTPOOL = 'ANTPOOL',
  }

  export type Income = {
    usd: number;
    btc: number;
  }

  export type Mining = {
    startingDate: string;
    electricity:{
      usdPricePerKWH: number;
    }
    asics:{
      powerW: number;
      units: number;
      hashrateHs: number;
    },
    intallationCosts:{
      equipement: number;
    },
  }

  export type Yield ={
    usd: number;
    btc: number;
    apr: number;
  }

  export type Fees = {
    crowdfunding:{
      csm: number;
    }
    operational:{
      operator: number; //BBGS, OP
      csm:number;
      pool:number;
      taxe: number;
      provision:number;
    }
  }