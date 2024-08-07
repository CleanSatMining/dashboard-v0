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
}