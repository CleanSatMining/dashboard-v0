import { getTimestampAtMidnightUTC } from "src/components/Display/components/Utils";
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
        toCome?: {
            amount: number;
            usd: number;
        }
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

export function filterOldDates(days: number): (value: MiningSummaryPerDay, index: number, array: MiningSummaryPerDay[]) => unknown {
    return (d) => {
      //filter old date
      return filterDates(d, days);
    };
  }

function filterDates(d: MiningSummaryPerDay, days: number) {
    const historyDay = getTimestampAtMidnightUTC(new Date(d.date).getTime());
    const nowDay = new Date().getTime();
    const diffDays = nowDay - historyDay;
    return diffDays >= days;
  }

export function mapHistoryMiningToSiteHistoryMining(siteId: string, history: MiningSummaryPerDay[]): SiteMiningHistory {
    return {
      id: siteId,
      mining: { days: history },
      token: { byUser: {} },
    };
  }