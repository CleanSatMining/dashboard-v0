import { MiningSummaryPerDay } from './Mining'

export type APIMiningHistoryQuery = {
    siteId: string;
    first: number;
}

export type APIMiningHistoryResponse = {
    days:MiningSummaryPerDay[]
}
