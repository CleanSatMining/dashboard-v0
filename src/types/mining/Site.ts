export type CleanSatMiningSite = {
  id: string;
  name:string;
  shortName:string;
  operator:Operator | undefined;
  data: Site;
}

export type Operator = {
  name: string;
  logo: string;
  website: string;
}

export type Site = {
  id: SiteID;
    name: string;
    location: {
      countryCode: string;
      name: string;
    };
    image: string;
    token: Token;
    status: MiningStatus;
    api: Api[];
    mining: Mining;
    fees: Fees;
    vault: {
      btcAddress: string;
      xpub: string;
    },
    
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
    enable: boolean;
    username: string | undefined;
    url: string | undefined;
    contractor: Contractor | undefined;
    subaccount?: {
      name: string;
      id: number;
      asics: SubacountAsics[];
      profitShare: number;
    };
    endOfContractAt?: number;
  }

  export type SubacountAsics = {
    asicsId: number;  // index of the asics
    machines: number; // number of machines
  };


  export enum MiningStatus {
    active = 'active',
    inactive = 'inactive',
    stopped = 'stopped',
    transit = 'transit',
  }

  export enum Contractor {
    LUXOR = 'LUXOR',
    ANTPOOL = 'ANTPOOL',
    FOUNDRY = 'FOUNDRY',
  }

  export type Income = {
    usd: number;
    btc: number;
  }

  export type Mining = {
    startingDate: string;
    electricity:{
      usdPricePerKWH: number;
      subaccount?: subaccuntElectricity[];
    }
    asics:Asics[],
  }

  export type subaccuntElectricity = {
    subaccountId: number;
    usdPricePerKWH: number;
  }

  export type Asics = {
    id: number;
    model: string;
    powerW: number;
    units: number;
    hashrateHs: number;
    date: string;
    intallationCosts:{
      equipement: number;
      total: number;
    }
  };

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
      operator: {
        includeWithElectricity : boolean;
        rate : number; //BBGS, OP
        beneficeRateAPI?: number[]; //BBGS, OP
      }
      csm:number;
      pool:number;
      taxe: number;
      provision:number;
    }
  }

  export enum FilterStatus {
    active = 'active',
    inactive = 'inactive',
    all = 'all-status',
  }

  export enum FilterSite {
    my = 'my-site',
    all = 'all-status',
  }
export type SiteCost = {
  total: number;
  totalTaxeFree: number;
  electricity: number;
  feeCSM: number;
  feeOperator: number;
  taxe: number;
  provision: number;
};

export enum SiteID {
  alpha = '1',
  beta = '2',
  omega = '3',
  gamma = '4',
  delta = '5'
}

