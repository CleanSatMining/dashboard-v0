export type MiningSitesStates = {
   [id: string]:MiningSiteStates;
}

export type MiningSiteStates = {
   id: string;
   state:UserState & SiteState;
}

export type UserState = {
   user: {
      token: {
         balance : number;
      };
   }
}

export type SiteState = {
   incomes :{
      byPeriod: {
         [days: number] : PeriodState;
      }
   }
}

export type PeriodState = {
   days: number;
   revenue:number;
   uptimePercentage:number;
   activeDays: number;
   electricityCost: number;
   uptimeTotalDays:number;
   uptimeTotalMachines:number;
}

