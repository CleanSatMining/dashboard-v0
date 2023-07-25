import {
  ALLOWED_SITES,
  FEE_RATE_BBGS,
  FEE_RATE_CSM,
  PROVISION_RATE,
  SITES,
  SWISS_TAXE,
  SiteID,
} from '../../../constants/csm';
import { CSMPeriodState, CSMSsite, CSMStates } from '../../../types/CSMState';
import { Site, TokenBalance, Yield } from '../../../types/Site';

export const getUptimeBySite = (
  siteState: CSMSsite,
  period: number
): { machines: number; days: number } => {
  if (
    siteState !== undefined &&
    siteState.state.incomes.byPeriod[period] !== undefined
  ) {
    const income: CSMPeriodState = siteState.state.incomes.byPeriod[period];
    return {
      days: income.activeDays,
      machines: income.uptimeTotalMachines,
    };
  }
  return {
    days: 0,
    machines: 0,
  };
};

export const getYieldBySite = (
  siteState: CSMSsite,
  period: number,
  btcPrice: number
): Yield => {
  if (siteState !== undefined) {
    const site: Site = SITES[siteState.id as SiteID];
    const income: CSMPeriodState = siteState.state.incomes.byPeriod[period];
    const usdRevenue = income.activeDays > 0 ? income.revenue * btcPrice : 0;

    const electricityCostPerDay = calculateElececticityCostPerDay(
      site,
      income.uptimeTotalMachines,
      income.uptimePercentage / 100
    );
    const electricityCostPerPeriod1 = electricityCostPerDay * income.activeDays;
    const electricityCostPerPeriod = income.electricityCost;
    const feeCSMUsd = (usdRevenue - electricityCostPerPeriod) * FEE_RATE_CSM;
    const feeBBGSUsd = (usdRevenue - electricityCostPerPeriod) * FEE_RATE_BBGS;
    const EBITDA =
      usdRevenue - electricityCostPerPeriod - feeCSMUsd - feeBBGSUsd;
    const provision = EBITDA * PROVISION_RATE;
    const taxe = (EBITDA - provision) * SWISS_TAXE;
    const netIncomePerPeriod = EBITDA - provision - taxe;
    const netIncomBtcPerPeriod = netIncomePerPeriod / btcPrice;
    const apr =
      period > 0
        ? (netIncomePerPeriod * (365 / period)) /
          (site.token.supply * site.token.price)
        : 0;

    console.log(
      'YIELD getSiteYield',
      siteState.id,
      ' siteYield => ',
      JSON.stringify(
        {
          income: income,
          revenue: usdRevenue,
          electricityCostPerPeriod1: electricityCostPerPeriod1,
          electricityCostPerPeriod: electricityCostPerPeriod,
          EBITDA: EBITDA,
          usd: netIncomePerPeriod,
          btc: netIncomBtcPerPeriod,
          apr: apr,
        },
        null,
        4
      )
    );

    return {
      usd: netIncomePerPeriod,
      btc: netIncomBtcPerPeriod,
      apr: apr,
    };
  } else {
    return {
      usd: 0,
      btc: 0,
      apr: 0,
    };
  }
};

export const getSiteYield = (
  state: CSMStates,
  siteId: string,
  period: number,
  btcPrice: number
): Yield => {
  return getYieldBySite(state[siteId], period, btcPrice);
};

export const getUserSiteYield = (
  siteState: CSMSsite,
  period: number,
  btcPrice: number
): Yield => {
  if (siteState !== undefined) {
    const site: Site = SITES[siteState.id as SiteID];
    const { usd, apr } = getYieldBySite(siteState, period, btcPrice);

    console.log('getUserSiteYield', siteState.id, usd, apr);

    const userIncome: number =
      (siteState.state.user.token.balance / site.token.supply) * usd;

    return {
      usd: userIncome,
      btc: userIncome / btcPrice,
      apr: apr,
    };
  } else {
    return {
      usd: 0,
      btc: 0,
      apr: 0,
    };
  }
};

export const getUserSiteIds = (state: CSMStates): string[] => {
  return ALLOWED_SITES.filter(
    (siteId) =>
      state[siteId] !== undefined && state[siteId].state.user.token.balance > 0
  );
};

export const getUserCSMBalance = (
  state: CSMStates,
  siteId: string
): TokenBalance => {
  const site: Site = SITES[siteId as SiteID];
  state[siteId].state.user.token.balance * site.token.price;
  return {
    address: site.token.address,
    symbol: site.token.symbol,
    balance: state[siteId].state.user.token.balance,
    usd: state[siteId].state.user.token.balance * site.token.price,
  };
};

export const getUserAssetValue = (state: CSMStates): { usd: number } => {
  const usd = getUserSiteIds(state)
    .map((siteId) => {
      return getUserCSMBalance(state, siteId).usd;
    })
    .reduce((acc, val) => acc + val, 0);

  return {
    usd,
  };
};

export const getUserYield = (
  state: CSMStates,
  period: number,
  btcPrice: number
): Yield => {
  let userUsd = 0;
  let userBtc = 0;
  let userApr = 0;
  const userInvestment: number = getUserSiteIds(state)
    .map((siteId) => {
      return (
        state[siteId].state.user.token.balance *
        SITES[siteId as SiteID].token.price
      );
    })
    .reduce((acc, val) => acc + val, 0);
  if (userInvestment > 0) {
    for (const siteId of getUserSiteIds(state)) {
      const site: Site = SITES[siteId as SiteID];
      const { usd, apr } = getSiteYield(state, siteId, period, btcPrice);
      console.log(
        'getUserSiteYield site',
        siteId,
        'data =>',
        usd,
        apr,
        userInvestment
      );
      const tokenBalance: TokenBalance = getUserCSMBalance(state, siteId);
      const tokenPercent: number = tokenBalance.balance / site.token.supply;
      const investmentPercent: number = tokenBalance.usd / userInvestment;
      const userIncome: number = tokenPercent * usd;

      // console.log(
      //   'YIELD site',
      //   siteId,
      //   'data =>',
      //   userIncome,
      //   investmentPercent,
      //   tokenPercent,
      //   tokenBalance,
      //   usd,
      //   apr,
      //   userInvestment
      // );
      userBtc = userBtc + userIncome / btcPrice;
      userUsd = userUsd + userIncome;
      userApr = userApr + apr * investmentPercent;
      console.log(
        'YIELD getUserSiteYield',
        JSON.stringify(
          {
            userBtc,
            userUsd,
            userApr,
            siteId,
            usd,
            tokenPercent,
            userIncome,
            btcPrice,
            investmentPercent,
          },
          null,
          4
        )
      );
    }
  }

  console.log(
    'YIELD user !!',
    JSON.stringify(
      {
        apr: userApr,
        btc: userBtc,
        usd: userUsd,
      },
      null,
      4
    )
  );

  return {
    apr: userApr,
    btc: userBtc,
    usd: userUsd,
  };
};

export function calculateElececticityCostPerDay(
  site: Site,
  totalMachines: number,
  uptimePercentage: number
) {
  const consumption_kwh_per_day_per_machine =
    (site.mining.asics.powerW * 24) / 1000;
  const electricityCostPerDay =
    site.mining.asics.units > 0
      ? site.mining.electricity.usdPricePerKWH *
        consumption_kwh_per_day_per_machine *
        uptimePercentage *
        totalMachines
      : 0;
  return electricityCostPerDay;
}
