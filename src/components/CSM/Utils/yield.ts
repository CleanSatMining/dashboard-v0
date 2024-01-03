import BigNumber from 'bignumber.js';
import { getMiningDays } from './period';
import { MiningState, UserState } from 'src/types/mining/Mining';

import { ALLOWED_SITES, SITES, SiteID } from '../../../constants/csm';
import { PropertiesERC20 } from 'src/types/PropertiesToken';
import { Site, TokenBalance, Yield } from '../../../types/mining/Site';
import {
  calculateElececticityCostPerPeriod,
  calculateNetYield,
  calculateGrossYield as calculateGrossYield,
  calculateCostsAndEBITDAByPeriod,
} from './pnl';
import { getPeriodFromStart } from './period';

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
  startDate: number,
  endDate: number,
): { quantity: BigNumber; value: BigNumber } {
  let sumMinedBtc: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, siteId, period, startDate, endDate);

  for (const day of days) {
    sumMinedBtc = sumMinedBtc.plus(day.revenue);
  }

  // if (
  //   miningState &&
  //   miningState.byId[siteId] &&
  //   miningState.byId[siteId].mining &&
  //   miningState.byId[siteId].mining.days
  // ) {

  //   for (let i = 0; i < period; i++) {
  //     if (
  //       miningState.byId[siteId].mining.days.length > i &&
  //       miningState.byId[siteId].mining.days[i].revenue
  //     ) {

  //       sumMinedBtc = sumMinedBtc.plus(
  //         miningState.byId[siteId].mining.days[i].revenue,
  //       );
  //     }
  //   }
  //}

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
  startDate: number,
  endDate: number,
): BigNumber {
  let sumMachines: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, siteId, period, startDate, endDate);
  for (const day of days) {
    sumMachines = sumMachines.plus(day.uptimeTotalMachines);
  }

  // if (
  //   miningState &&
  //   miningState.byId[siteId] &&
  //   miningState.byId[siteId].mining &&
  //   miningState.byId[siteId].mining.days
  // ) {
  //   for (let i = 0; i < period; i++) {
  //     if (
  //       miningState.byId[siteId].mining.days.length > i &&
  //       miningState.byId[siteId].mining.days[i].revenue
  //     ) {
  //       sumMachines = sumMachines.plus(
  //         miningState.byId[siteId].mining.days[i].uptimeTotalMachines,
  //       );
  //     }
  //   }
  // }

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
  startDate: number,
  endDate: number,
): BigNumber {
  let uptimePercentage: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, siteId, period, startDate, endDate);
  for (const day of days) {
    uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
  }

  // if (
  //   miningState &&
  //   miningState.byId[siteId] &&
  //   miningState.byId[siteId].mining &&
  //   miningState.byId[siteId].mining.days
  // ) {
  //   for (let i = 0; i < period; i++) {
  //     if (
  //       miningState.byId[siteId].mining.days.length > i &&
  //       miningState.byId[siteId].mining.days[i].revenue
  //     ) {
  //       uptimePercentage = uptimePercentage.plus(
  //         miningState.byId[siteId].mining.days[i].uptimePercentage,
  //       );
  //     }
  //   }
  // }

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
  startDate: number,
  endDate: number,
): { net: Yield; gross: Yield } => {
  const netYield: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  const grossYield: { usd: number; btc: number; apr: number } = {
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
      startDate,
      endDate,
    );

    const electricityCost = calculateElececticityCostPerPeriod(
      miningState,
      siteId,
      period,
      startDate,
      endDate,
    );
    const { netUsdIncome, netBtcIncome, netApr } = calculateNetYield(
      siteId,
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
    );

    // console.log('calculateNetYield', siteId, 'period', period);
    // console.log(
    //   'calculateNetYield',
    //   siteId,
    //   'netUsdIncome',
    //   netUsdIncome.toNumber(),
    // );
    // console.log(
    //   'calculateNetYield',
    //   siteId,
    //   'netBtcIncome',
    //   netBtcIncome.toNumber(),
    // );
    // console.log('calculateNetYield', siteId, 'netApr', netApr.toNumber());

    netYield.usd = netUsdIncome.toNumber();
    netYield.btc = netBtcIncome.toNumber();
    netYield.apr = netApr.toNumber();

    const { apr, btcIncome, usdIncome } = calculateGrossYield(
      siteId,
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
    );

    grossYield.usd = usdIncome.toNumber();
    grossYield.btc = btcIncome.toNumber();
    grossYield.apr = apr.toNumber();
  }

  return { net: netYield, gross: grossYield };
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
  startDate: number,
  endDate: number,
): { net: Yield; gross: Yield } => {
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
    const siteYield = getYieldBySite(
      miningState,
      siteId,
      period,
      btcPrice,
      startDate,
      endDate,
    );
    const userShare: BigNumber = tokenBalance.dividedBy(tokenSupply);
    netYield.btc = userShare.times(siteYield.net.btc).toNumber();
    netYield.usd = userShare.times(siteYield.net.usd).toNumber();
    netYield.apr = siteYield.net.apr;
    brutYield.btc = userShare.times(siteYield.gross.btc).toNumber();
    brutYield.usd = userShare.times(siteYield.gross.usd).toNumber();
    brutYield.apr = siteYield.gross.apr;
  }

  return { net: netYield, gross: brutYield };
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
 * getUserTokenBalance
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
  startDate: number,
  endDate: number,
): { net: Yield; gross: Yield } => {
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
        startDate,
        endDate,
      );
      const siteInvestementShare: BigNumber = new BigNumber(
        getUserTokenBalance(userState, userAddress, siteId).usd,
      ).dividedBy(totalInvested);

      netBtc = netBtc.plus(siteYield.net.btc);
      netUsd = netUsd.plus(siteYield.net.usd);
      netApr = netApr.plus(siteInvestementShare.times(siteYield.net.apr));
      brutBtc = brutBtc.plus(siteYield.gross.btc);
      brutUsd = brutUsd.plus(siteYield.gross.usd);
      brutApr = brutApr.plus(siteInvestementShare.times(siteYield.gross.apr));
    }

    netYield.btc = netBtc.toNumber();
    netYield.usd = netUsd.toNumber();
    netYield.apr = netApr.toNumber();
    brutYield.btc = brutBtc.toNumber();
    brutYield.usd = brutUsd.toNumber();
    brutYield.apr = brutApr.toNumber();
  }

  return { net: netYield, gross: brutYield };
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
  tokenProperties: PropertiesERC20 | undefined,
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
  startDate: number,
  endDate: number,
): { machines: number; days: number; percent: number; hashrate: number } => {
  if (
    miningState &&
    miningState.byId &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining.days
  ) {
    // for (const day of days) {
    //   uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
    // }
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getPeriodFromStart(site, period);
    //const days = miningState.byId[siteId].mining.days;
    const days = getMiningDays(miningState, siteId, period, startDate, endDate);
    let uptimeHashrate: BigNumber = new BigNumber(0);
    let uptimePercentage: BigNumber = new BigNumber(0);
    let uptimeTotalMachines: BigNumber = new BigNumber(0);
    // const activeDays = Math.min(realPeriod, days.length);
    // for (let i = 0; i < activeDays; i++) {
    //   const day = days[i];
    //   uptimeHashrate = uptimeHashrate.plus(day.hashrate);
    //   uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
    //   uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);
    // }

    for (const day of days) {
      uptimeHashrate = uptimeHashrate.plus(day.hashrate);
      uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
      uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);
    }

    return {
      days: days.length,
      hashrate: uptimeHashrate.dividedBy(realPeriod).toNumber(),
      machines: uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
      percent: uptimePercentage.dividedBy(realPeriod).toNumber(),
    };
  }
  return {
    days: 0,
    hashrate: 0,
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
  startDate: number,
  endDate: number,
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
    startDate,
    endDate,
  );
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const realPeriod = getPeriodFromStart(site, period);

  const electricityCost = calculateElececticityCostPerPeriod(
    miningState,
    siteId,
    period,
    startDate,
    endDate,
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
