export type APIMiningHistoryQuery = {
    siteId: string;
    first: number;
}

export type APIMiningHistoryResponse = {
    days:[
        {
            date: string;
            efficiency: number;
            hashrate: number;
            revenue: number;
            uptimePercentage: number;
            uptimeTotalMinutes:number;
            uptimeTotalMachines: number;
        }
    ]
}
