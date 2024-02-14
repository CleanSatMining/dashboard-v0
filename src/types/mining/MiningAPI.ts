import { MiningSummaryPerDay } from './Mining'

export type APIMiningHistoryQuery = {
    siteId: string;
    first: number;
}

export type APIMiningHistoryResponse = {
    days:MiningSummaryPerDay[];
    error?: any;
}


export type APIEbitdaQuery = {
    siteId: string;
    startTimestamp: number;
    endTimestamp: number;
    btcPrice: number;
    basePricePerKWH?: number;
}