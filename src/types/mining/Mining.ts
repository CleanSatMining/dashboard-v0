
export type MiningSummaryPerDay = {
    date: string;
    efficiency: number;
    hashrate: number;
    revenue: number;
    uptimePercentage: number;
    uptimeTotalMinutes:number;
    uptimeTotalMachines: number;
}

export type MiningSummary = {
    days:  MiningSummaryPerDay[];
}


interface Balance {
    token: {
        balance: number;
    };
}

export type UserSummary = {
    address: string;
    bySite: {
        [id: string] : Balance;
     }
}


export type TokenSummary = {
    byUser: {
        [address: string] : Balance;
     }
}

export type SiteMiningSummary = {
    id: string;
    mining: MiningSummary;
    token: TokenSummary;
}

export type MiningState = {
    byId: {
        [id: string] : SiteMiningSummary;
     };
}

export type UserState = {
    byAddress: {
        [address: string] : UserSummary;
     }
}