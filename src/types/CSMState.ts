export type CSMStates = {
   [id: string]:CSMSsite;
}

export type CSMSsite = {
   id: string;
   state:CSMUserState & CSMSiteState;
}

export type CSMUserState = {
   user: {
      token: {
         balance : number;
      };
   }
}

export type CSMSiteState = {
   incomes :{
      byPeriod: {
         [days: number] : CSMPeriodState;
      }
   }
}

export type CSMPeriodState = {
   days: number;
   revenue:number;
   uptimePercentage:number;
   activeDays: number;
   electricityCost: number;
   uptimeTotalDays:number;
   uptimeTotalMachines:number;
}

