export type APIMiningSummary = {
    username: string
    validShares: string
    invalidShares: string
    staleShares: string
    lowDiffShares: string
    badShares: string,
    duplicateShares: string
    revenue: number
    hashrate: number
}

export type APIMiningSummaryQuery = {
    username: string
    duration: Duration
}

export type Duration = {
    years? : number
    days?: number
    hours?: number
}