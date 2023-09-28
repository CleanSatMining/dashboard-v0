import BigNumber from 'bignumber.js';

import { MiningState, UserState } from 'src/types/mining/Mining';

import {
  ALLOWED_SITES,
  FEE_RATE_BBGS,
  FEE_RATE_CSM,
  PROVISION_RATE,
  SITES,
  SWISS_TAXE,
  SiteID,
} from '../../../constants/csm';
import {
  MiningSiteStates,
  MiningSitesStates,
  PeriodState,
} from '../../../types/mining/CSMState';
import { Site, TokenBalance, Yield } from '../../../types/mining/Site';
import {
  calculateElececticityCostPerPeriod,
  calculateNetYield,
  calculateYield,
  calculateCostsAndEBITDAByPeriod,
} from './pnl';

export const getUptimeBySite_deprecated = (
  siteState: MiningSiteStates,
  period: number,
): { machines: number; days: number } => {
  if (
    siteState !== undefined &&
    siteState.state.incomes.byPeriod[period] !== undefined
  ) {
    const income: PeriodState = siteState.state.incomes.byPeriod[period];
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

export const getYieldBySite_deprecated = (
  siteState: MiningSiteStates,
  period: number,
  btcPrice: number,
): Yield => {
  if (siteState !== undefined) {
    const site: Site = SITES[siteState.id as SiteID];
    const income: PeriodState = siteState.state.incomes.byPeriod[period];
    const usdRevenue = income.activeDays > 0 ? income.revenue * btcPrice : 0;

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

    /* console.log(
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
    ); */

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

export const getSiteYield_deprecated = (
  state: MiningSitesStates,
  siteId: string,
  period: number,
  btcPrice: number,
): Yield => {
  return getYieldBySite_deprecated(state[siteId], period, btcPrice);
};

export const getUserSiteYield_deprecated = (
  siteState: MiningSiteStates,
  period: number,
  btcPrice: number,
): Yield => {
  if (siteState !== undefined) {
    const site: Site = SITES[siteState.id as SiteID];
    const { usd, apr } = getYieldBySite_deprecated(siteState, period, btcPrice);

    // console.log('getUserSiteYield', siteState.id, usd, apr);

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

export const getUserSiteIds_deprecated = (
  state: MiningSitesStates,
): string[] => {
  return ALLOWED_SITES.filter(
    (siteId) =>
      state[siteId] !== undefined && state[siteId].state.user.token.balance > 0,
  );
};

export const getUserCSMBalance_deprecated = (
  state: MiningSitesStates,
  siteId: string,
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

export const getUserAssetValue_deprecated = (
  state: MiningSitesStates,
): { usd: number } => {
  const usd = getUserSiteIds_deprecated(state)
    .map((siteId) => {
      return getUserCSMBalance_deprecated(state, siteId).usd;
    })
    .reduce((acc, val) => acc + val, 0);

  return {
    usd,
  };
};

export const getUserYield_deprecated = (
  state: MiningSitesStates,
  period: number,
  btcPrice: number,
): Yield => {
  let userUsd = 0;
  let userBtc = 0;
  let userApr = 0;
  const userInvestment: number = getUserSiteIds_deprecated(state)
    .map((siteId) => {
      return (
        state[siteId].state.user.token.balance *
        SITES[siteId as SiteID].token.price
      );
    })
    .reduce((acc, val) => acc + val, 0);
  if (userInvestment > 0) {
    for (const siteId of getUserSiteIds_deprecated(state)) {
      const site: Site = SITES[siteId as SiteID];
      const { usd, apr } = getSiteYield_deprecated(
        state,
        siteId,
        period,
        btcPrice,
      );
      // console.log(
      //   'getUserSiteYield site',
      //   siteId,
      //   'data =>',
      //   usd,
      //   apr,
      //   userInvestment
      // );
      const tokenBalance: TokenBalance = getUserCSMBalance_deprecated(
        state,
        siteId,
      );
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
      /*  console.log(
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
      ); */
    }
  }

  // console.log(
  //   'YIELD user !!',
  //   JSON.stringify(
  //     {
  //       apr: userApr,
  //       btc: userBtc,
  //       usd: userUsd,
  //     },
  //     null,
  //     4
  //   )
  // );

  return {
    apr: userApr,
    btc: userBtc,
    usd: userUsd,
  };
};

//------------------------------------------------------------------------------------------------------------
// WITH REDUX
// -----------------------------------------------------------------------------------------------------

/**
 * getYieldBtcBySite
 * @param miningState
 * @param siteId
 * @param period
 * @returns
 */
export function getMinedBtcBySite(
  miningState: MiningState,
  siteId: string,
  period: number,
  btcPrice: number,
): { quantity: BigNumber; value: BigNumber } {
  let sumMinedBtc: BigNumber = new BigNumber(0);

  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    for (let i = 0; i < period; i++) {
      if (
        miningState.byId[siteId].mining.days.length > i &&
        miningState.byId[siteId].mining.days[i].revenue
      ) {
        sumMinedBtc = sumMinedBtc.plus(
          miningState.byId[siteId].mining.days[i].revenue,
        );
      }
    }
  }

  return { quantity: sumMinedBtc, value: sumMinedBtc.times(btcPrice) };
}

/**
 * getMachineUptimeBySite
 * @param miningState
 * @param siteId
 * @param period
 * @returns
 */
export function getUptimeTotalMachinesBySite(
  miningState: MiningState,
  siteId: string,
  period: number,
): BigNumber {
  let sumMachines: BigNumber = new BigNumber(0);

  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    for (let i = 0; i < period; i++) {
      if (
        miningState.byId[siteId].mining.days.length > i &&
        miningState.byId[siteId].mining.days[i].revenue
      ) {
        sumMachines = sumMachines.plus(
          miningState.byId[siteId].mining.days[i].uptimeTotalMachines,
        );
      }
    }
  }

  return sumMachines.dividedBy(period);
}

/**
 * getMachineUptimeBySite
 * @param miningState
 * @param siteId
 * @param period
 * @returns
 */
export function getUptimePercentageBySite(
  miningState: MiningState,
  siteId: string,
  period: number,
): BigNumber {
  let uptimePercentage: BigNumber = new BigNumber(0);

  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    for (let i = 0; i < period; i++) {
      if (
        miningState.byId[siteId].mining.days.length > i &&
        miningState.byId[siteId].mining.days[i].revenue
      ) {
        uptimePercentage = uptimePercentage.plus(
          miningState.byId[siteId].mining.days[i].uptimePercentage,
        );
      }
    }
  }

  return uptimePercentage.dividedBy(period);
}

/**
 * getYieldBySite
 *
 * @param miningState
 * @param siteId
 * @param period
 * @param btcPrice
 * @returns
 */
export const getYieldBySite = (
  miningState: MiningState,
  siteId: string,
  period: number,
  btcPrice: number,
): { net: Yield; brut: Yield } => {
  const netYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  const brutYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    const { quantity: siteBtcIncome } = getMinedBtcBySite(
      miningState,
      siteId,
      period,
      btcPrice,
    );

    const electricityCost = calculateElececticityCostPerPeriod(
      miningState,
      siteId,
      period,
    );
    const { netUsdIncome, netBtcIncome, netApr } = calculateNetYield(
      siteId,
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
    );

    netYield.usd = netUsdIncome.toNumber();
    netYield.btc = netBtcIncome.toNumber();
    netYield.apr = netApr.toNumber();

    const { apr, btcIncome, usdIncome } = calculateYield(
      siteId,
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
    );

    brutYield.usd = usdIncome.toNumber();
    brutYield.btc = btcIncome.toNumber();
    brutYield.apr = apr.toNumber();
  }

  return { net: netYield, brut: brutYield };
};

/**
 * getUserYieldBySite
 *
 * @param miningState
 * @param userState
 * @param siteId
 * @param userAddress
 * @param period
 * @param btcPrice
 * @returns
 */
export const getUserYieldBySite = (
  miningState: MiningState,
  userState: UserState,
  siteId: string,
  userAddress: string,
  period: number,
  btcPrice: number,
): { net: Yield; brut: Yield } => {
  const netYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  const brutYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days &&
    userState &&
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[siteId] &&
    userState.byAddress[userAddress].bySite[siteId].token
  ) {
    const tokenSupply: BigNumber = new BigNumber(
      SITES[siteId as SiteID].token.supply,
    );
    const tokenBalance: BigNumber = new BigNumber(
      userState.byAddress[userAddress].bySite[siteId].token.balance,
    );
    const siteYield = getYieldBySite(miningState, siteId, period, btcPrice);
    const userShare: BigNumber = tokenBalance.dividedBy(tokenSupply);
    netYield.btc = userShare.times(siteYield.net.btc).toNumber();
    netYield.usd = userShare.times(siteYield.net.usd).toNumber();
    netYield.apr = siteYield.net.apr;
    brutYield.btc = userShare.times(siteYield.brut.btc).toNumber();
    brutYield.usd = userShare.times(siteYield.brut.usd).toNumber();
    brutYield.apr = siteYield.brut.apr;
  }

  return { net: netYield, brut: brutYield };
};

/**
 * getUserSiteIds
 *
 * @param userState
 * @param userAddress
 * @returns
 */
export const getUserSiteIds = (
  userState: UserState,
  userAddress: string,
): string[] => {
  return ALLOWED_SITES.filter(
    (siteId) =>
      userState.byAddress[userAddress] &&
      userState.byAddress[userAddress].bySite[siteId] &&
      userState.byAddress[userAddress].bySite[siteId].token.balance > 0,
  );
};

/**
 * getUserInvestmentBySite
 *
 * @param userState
 * @param userAddress
 * @param siteId
 * @returns
 */

export const getUserTokenBalance = (
  userState: UserState,
  userAddress: string,
  siteId: string,
): TokenBalance => {
  const site = SITES[siteId as SiteID];
  if (
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[siteId] &&
    userState.byAddress[userAddress].bySite[siteId].token.balance > 0
  ) {
    const tokenPrice: BigNumber = new BigNumber(site.token.price);
    const tokenBalance: number =
      userState.byAddress[userAddress].bySite[siteId].token.balance;
    return {
      address: site.token.address,
      symbol: site.token.symbol,
      balance: tokenBalance,
      usd: tokenPrice.times(tokenBalance).toNumber(),
    };
  }

  return {
    address: site.token.address,
    symbol: site.token.symbol,
    balance: 0,
    usd: 0,
  };
};

/**
 * getUserInvestment
 *
 * @param userState
 * @param userAddress
 * @returns
 */
export const getUserInvestment = (
  userState: UserState,
  userAddress: string,
): BigNumber => {
  if (userState.byAddress[userAddress]) {
    const userInvestment: BigNumber = getUserSiteIds(userState, userAddress)
      .map((siteId) => {
        return getUserTokenBalance(userState, userAddress, siteId).usd;
      })
      .reduce((acc, val) => acc.plus(val), new BigNumber(0));
    return userInvestment;
  }

  return new BigNumber(0);
};

/**
 * getUserYield
 *
 * @param miningState
 * @param userState
 * @param userAddress
 * @param period
 * @param btcPrice
 * @returns
 */
export const getUserYield = (
  miningState: MiningState,
  userState: UserState,
  userAddress: string,
  period: number,
  btcPrice: number,
): { net: Yield; brut: Yield } => {
  const netYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  const brutYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  if (miningState && userState && userState.byAddress[userAddress]) {
    let netBtc: BigNumber = new BigNumber(0);
    let netUsd: BigNumber = new BigNumber(0);
    let netApr: BigNumber = new BigNumber(0);
    let brutBtc: BigNumber = new BigNumber(0);
    let brutUsd: BigNumber = new BigNumber(0);
    let brutApr: BigNumber = new BigNumber(0);

    const totalInvested: BigNumber = getUserInvestment(userState, userAddress);
    for (const siteId of getUserSiteIds(userState, userAddress)) {
      const siteYield = getUserYieldBySite(
        miningState,
        userState,
        siteId,
        userAddress,
        period,
        btcPrice,
      );
      const siteInvestementShare: BigNumber = new BigNumber(
        getUserTokenBalance(userState, userAddress, siteId).usd,
      ).dividedBy(totalInvested);

      netBtc = netBtc.plus(siteYield.net.btc);
      netUsd = netUsd.plus(siteYield.net.usd);
      netApr = netApr.plus(siteInvestementShare.times(siteYield.net.apr));
      brutBtc = brutBtc.plus(siteYield.brut.btc);
      brutUsd = brutUsd.plus(siteYield.brut.usd);
      brutApr = brutApr.plus(siteInvestementShare.times(siteYield.brut.apr));
    }

    netYield.btc = netBtc.toNumber();
    netYield.usd = netUsd.toNumber();
    netYield.apr = netApr.toNumber();
    brutYield.btc = brutBtc.toNumber();
    brutYield.usd = brutUsd.toNumber();
    brutYield.apr = brutApr.toNumber();
  }

  return { net: netYield, brut: brutYield };
};

/**
 * getUserSiteShare
 *
 * @param miningState
 * @param userState
 * @param siteId
 * @param userAddress
 * @returns
 */
export const getUserSiteShare = (
  miningState: MiningState,
  userState: UserState,
  siteId: string,
  userAddress: string,
): BigNumber => {
  if (miningState && userState && userState.byAddress[userAddress]) {
    const tokenSupply = SITES[siteId as SiteID].token.supply;
    return new BigNumber(
      getUserTokenBalance(userState, userAddress, siteId).balance,
    ).dividedBy(tokenSupply);
  }

  return new BigNumber(0);
};

/**
 * getUptimeBySite
 *
 * @param miningState
 * @param siteId
 * @param period
 * @returns
 */
export const getUptimeBySite = (
  miningState: MiningState,
  siteId: string,
  period: number,
): { machines: number; days: number; percent: number } => {
  if (
    miningState &&
    miningState.byId &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getRealPeriod(site, period);
    const days = miningState.byId[siteId].mining.days;
    let uptimePercentage: BigNumber = new BigNumber(0);
    let uptimeTotalMachines: BigNumber = new BigNumber(0);
    const activeDays = Math.min(realPeriod, days.length);
    for (let i = 0; i < activeDays; i++) {
      const day = days[i];
      uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
      uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);
    }

    return {
      days: activeDays,
      machines: uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
      percent: uptimePercentage.dividedBy(realPeriod).toNumber(),
    };
  }
  return {
    days: 0,
    machines: 0,
    percent: 0,
  };
};

/**
 *
 * @returns
 */
export function getCSMTokenAddresses() {
  const tokenAddress: string[] = [];
  for (const siteId of ALLOWED_SITES) {
    tokenAddress.push(SITES[siteId as SiteID].token.address);
  }
  return { tokenAddress };
}

/**
 *
 * @param siteId
 * @returns
 */
export function getCSMTokenAddress(siteId: string): string {
  return SITES[siteId as SiteID].token.address;
}
/**
 * getRealPeriod
 *
 * @param site
 * @param period
 * @returns
 */

export function getRealPeriod(site: Site, period: number) {
  const daysSinceStart = getNumberOfDaysSinceStart(site);
  const realPeriod = Math.min(period, daysSinceStart);
  return realPeriod;
}
/**
 * getNumberOfDaysSinceStart
 * @param site
 * @returns
 */

export function getNumberOfDaysSinceStart(site: Site) {
  if (
    site.mining.startingDate !== undefined &&
    site.mining.startingDate !== '-'
  ) {
    const today = new Date();
    const startDate = new Date(site.mining.startingDate);
    const diffTime = new BigNumber(today.getTime() - startDate.getTime());
    const daysSinceStart = Math.ceil(
      diffTime.dividedBy(1000 * 3600 * 24).toNumber(),
    );
    return daysSinceStart ?? 0;
  }
  return 0;
}

export function getSiteCostsByPeriod(
  miningState: MiningState,
  siteId: string,
  btcPrice: number,
  period: number,
): {
  total: number;
  electricity: number;
  feeCSM: number;
  feeOperator: number;
  taxe: number;
  provision: number;
} {
  const site: Site = SITES[siteId as SiteID];
  const feeParameters = site.fees;
  const { value: usdIncome } = getMinedBtcBySite(
    miningState,
    siteId,
    period,
    btcPrice,
  );
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const realPeriod = getRealPeriod(site, period);

  const electricityCost = calculateElececticityCostPerPeriod(
    miningState,
    siteId,
    period,
  );

  const { feeCsm, feeOperator, taxe, provision } =
    calculateCostsAndEBITDAByPeriod(
      usdIncome,
      electricityCost,
      feeParameters,
      equipement,
      realPeriod,
    );

  return {
    total: electricityCost
      .plus(feeCsm)
      .plus(feeOperator)
      .plus(taxe)
      .plus(provision)
      .toNumber(),
    electricity: electricityCost.toNumber(),
    feeCSM: feeCsm.toNumber(),
    feeOperator: feeOperator.toNumber(),
    taxe: taxe.toNumber(),
    provision: provision.toNumber(),
  };
}
