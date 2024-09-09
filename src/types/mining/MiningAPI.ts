import { MiningSummaryPerDay } from './Mining'

export type APIMiningHistoryQuery = {
    siteId: string;
    first: number;
}
export type APIMiningDataQuery = {
    siteId: string;
    first: number;
    username: string;
}

export type APIMiningHistoryResponse = {
    updated: number;
    siteId: string;
    days:MiningSummaryPerDay[];
    error?: any;
}

export type APIMiningDataResponse = {
    updated: number;
    days:any[];
    error?: any;
}


export type APIEbitdaQuery = {
    siteId: string;
    startTimestamp: number;
    endTimestamp: number;
    btcPrice: number;
    basePricePerKWH?: number;
    subaccount?: number;
}

export interface DayDataAntpool {
    timestamp: string;
    hashrate: string;
    hashrate_unit: number;
    ppsAmount: number;
    pplnsAmount: number;
    soloAmount: number;
    ppappsAmount: number;
    ppapplnsAmount: number;
    fppsBlockAmount: number;
    fppsFeeAmount: number;
  }

export interface DayDataLuxor {
    date: string;
    efficiency: number;
    hashrate: number;
    revenue: number;
    uptimePercentage: number;
    uptimeTotalMinutes: number;
    uptimeTotalMachines: number;
  }

  export interface DayDataFoundry {
    startTime: string;
    endTime: string;
    totalAmount: number;
    hashrate: number;
    ppsBaseAmount: number;
    txFeeRewardAmount: number;
    fppsRatePercent: number;
    ppapplnsAmount: number;
    feeAmount: number;
    feeRatePercent: number;
  }