
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

export type SiteMiningHistory = {
    id: string;
    mining: MiningSummary;
    token: TokenSummary;
}

export type MiningHistory = {
    byId: {
        [id: string] : SiteMiningHistory;
     };
}

export type UserState = {
    byAddress: {
        [address: string] : UserSummary;
     }
}


export type Expense = {
    dateTime: number;
    siteId: string;
    csm: number;
    operator: number;
    electricity: number;
}


export type MiningExpenses = {
    byId: {
        [id: string] : Expense[];
     };
}