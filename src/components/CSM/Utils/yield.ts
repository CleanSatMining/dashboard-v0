import BigNumber from 'bignumber.js';
import { getMiningDays } from './period';
import {
  MiningHistory,
  UserState,
  MiningExpenses,
} from 'src/types/mining/Mining';
import { Expense, MiningSummaryPerDay } from 'src/types/mining/Mining';
import { ALLOWED_SITES, SITES, SiteID } from '../../../constants/csm';
import { PropertiesERC20 } from 'src/types/PropertiesToken';
import { Site, TokenBalance, Yield } from '../../../types/mining/Site';
import {
  calculateElectricityCostPerPeriod,
  calculateNetYield,
  calculateGrossYield,
  calculateGrossYieldTaxeFree,
  calculateCostsAndEBITDAByPeriod,
} from './pnl';
import { getPeriodFromStart, getEquipementDepreciation } from './period';
import { SiteCost } from 'src/types/mining/Site';

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
export function getMinedBtc(
  miningState: MiningHistory,
  siteId: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
): { quantity: BigNumber; value: BigNumber } {
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    const hasSubaccount = SITES[siteId as SiteID].api.every(
      (api) => api.subaccount !== undefined,
    );

    let siteBtcMined = new BigNumber(0);

    if (hasSubaccount) {
      let subaccountsBtcMined = new BigNumber(0);
      for (const subaccountApi of SITES[siteId as SiteID].api) {
        if (subaccountApi.subaccount) {
          const { quantity: subaccountBtcMined } = getMinedBtc_(
            miningState,
            siteId,
            period,
            btcPrice,
            startDate,
            endDate,
            subaccountApi.subaccount.id,
          );

          const subaccountElectricityCost = calculateElectricityCostPerPeriod(
            miningState,
            siteId,
            period,
            startDate,
            endDate,
            expenses,
            btcPrice,
            undefined,
            subaccountApi.subaccount.id,
          );
          const subaccountElectricityCost_btc =
            subaccountElectricityCost.dividedBy(btcPrice);
          const btcIncomeShare = subaccountBtcMined
            .minus(subaccountElectricityCost_btc)
            .multipliedBy(subaccountApi.subaccount.profitShare);
          const subaccountBtcIncome =
            subaccountElectricityCost_btc.plus(btcIncomeShare);
          subaccountsBtcMined = subaccountsBtcMined.plus(subaccountBtcIncome);
        } else {
          console.error(
            'No subaccount ' + siteId + ' ' + JSON.stringify(subaccountApi),
          );
        }
      }
      siteBtcMined = subaccountsBtcMined;
    } else {
      const { quantity: siteBtc } = getMinedBtc_(
        miningState,
        siteId,
        period,
        btcPrice,
        startDate,
        endDate,
      );
      siteBtcMined = siteBtc;
    }

    return { quantity: siteBtcMined, value: siteBtcMined.times(btcPrice) };
  }

  return { quantity: new BigNumber(0), value: new BigNumber(0) };
}

function getMinedBtc_(
  miningState: MiningHistory,
  siteId: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  subaccountId?: number,
): { quantity: BigNumber; value: BigNumber } {
  let sumMinedBtc: BigNumber = new BigNumber(0);

  const days = getMiningDays(
    miningState,
    siteId,
    period,
    startDate,
    endDate,
  ).filter(
    (d) => d.subaccountId === subaccountId || subaccountId === undefined,
  );

  for (const day of days) {
    sumMinedBtc = sumMinedBtc.plus(day.revenue);
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
  miningState: MiningHistory,
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
  miningState: MiningHistory,
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
  miningState: MiningHistory,
  siteId: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
): { net: Yield; gross: Yield; grossTaxeFree: Yield } => {
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
  const grossYieldTaxeFree: { usd: number; btc: number; apr: number } = {
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
    const { quantity: siteBtcMined } = getMinedBtc(
      miningState,
      siteId,
      period,
      btcPrice,
      startDate,
      endDate,
      expenses,
    );

    const electricityCost = calculateElectricityCostPerPeriod(
      miningState,
      siteId,
      period,
      startDate,
      endDate,
      expenses,
      btcPrice,
    );
    const { netUsdIncome, netBtcIncome, netApr } = calculateNetYield(
      siteId,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[siteId].mining.days,
    );

    netYield.usd = netUsdIncome.toNumber();
    netYield.btc = netBtcIncome.toNumber();
    netYield.apr = netApr.toNumber();

    const { apr, btcIncome, usdIncome } = calculateGrossYield(
      siteId,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[siteId].mining.days,
    );

    grossYield.usd = usdIncome.toNumber();
    grossYield.btc = btcIncome.toNumber();
    grossYield.apr = apr.toNumber();

    const {
      apr: aprTaxeFree,
      btcIncome: btcIncomeWithoutTaxe,
      usdIncome: usdIncomeWithoutIncome,
    } = calculateGrossYieldTaxeFree(
      siteId,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[siteId].mining.days,
    );

    grossYieldTaxeFree.usd = usdIncomeWithoutIncome.toNumber();
    grossYieldTaxeFree.btc = btcIncomeWithoutTaxe.toNumber();
    grossYieldTaxeFree.apr = aprTaxeFree.toNumber();
  }

  return {
    net: netYield,
    gross: grossYield,
    grossTaxeFree: grossYieldTaxeFree,
  };
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
  miningState: MiningHistory,
  userState: UserState,
  siteId: string,
  userAddress: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
): { net: Yield; gross: Yield; grossTaxeFree: Yield } => {
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
  const brutYieldTaxeFree: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days &&
    //miningState.byId[siteId].mining.days.length > 0 &&
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
      expenses,
    );
    const userShare: BigNumber = tokenBalance.dividedBy(tokenSupply);
    netYield.btc = userShare.times(siteYield.net.btc).toNumber();
    netYield.usd = userShare.times(siteYield.net.usd).toNumber();
    netYield.apr = siteYield.net.apr;
    brutYield.btc = userShare.times(siteYield.gross.btc).toNumber();
    brutYield.usd = userShare.times(siteYield.gross.usd).toNumber();
    brutYield.apr = siteYield.gross.apr;
    brutYieldTaxeFree.btc = userShare
      .times(siteYield.grossTaxeFree.btc)
      .toNumber();
    brutYieldTaxeFree.usd = userShare
      .times(siteYield.grossTaxeFree.usd)
      .toNumber();
    brutYieldTaxeFree.apr = siteYield.grossTaxeFree.apr;
  }

  return {
    net: netYield,
    gross: brutYield,
    grossTaxeFree: brutYieldTaxeFree,
  };
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
      (userState.byAddress[userAddress].bySite[siteId].token.balance > 0 ||
        (userState.byAddress[userAddress].bySite[siteId].token.toCome?.amount ??
          0) > 0),
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
  toCome?: boolean,
): TokenBalance => {
  const site = SITES[siteId as SiteID];

  if (
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[siteId] &&
    (userState.byAddress[userAddress].bySite[siteId].token.balance > 0 ||
      toCome)
  ) {
    const tokenPrice: BigNumber = new BigNumber(site.token.price);
    const tokenBalance: number =
      userState.byAddress[userAddress].bySite[siteId].token.balance;
    const tokenToCome: number =
      userState.byAddress[userAddress].bySite[siteId].token.toCome?.amount ?? 0;
    const tokenToComeUsd: number =
      userState.byAddress[userAddress].bySite[siteId].token.toCome?.usd ?? 0;

    return {
      address: site.token.address,
      symbol: site.token.symbol,
      balance: tokenBalance + (toCome ? tokenToCome : 0),
      usd:
        tokenPrice.times(tokenBalance).toNumber() +
        (toCome ? tokenToComeUsd : 0),
    };
  }

  return {
    address: site.token.address,
    symbol: site.token.symbol,
    balance: 0,
    usd: 0,
  };
};

export const getUserTokenBalanceToCome = (
  userState: UserState,
  userAddress: string,
  siteId: string,
): TokenBalance => {
  const site = SITES[siteId as SiteID];

  if (
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[siteId]
  ) {
    const tokenToCome: number =
      userState.byAddress[userAddress].bySite[siteId].token.toCome?.amount ?? 0;
    const tokenToComeUsd: number =
      userState.byAddress[userAddress].bySite[siteId].token.toCome?.usd ?? 0;

    return {
      address: site.token.address,
      symbol: site.token.symbol,
      balance: tokenToCome,
      usd: tokenToComeUsd,
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
  toCome?: boolean,
): BigNumber => {
  if (userState.byAddress[userAddress]) {
    const userInvestment: BigNumber = getUserSiteIds(userState, userAddress)
      .map((siteId) => {
        return getUserTokenBalance(userState, userAddress, siteId, toCome).usd;
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
  miningState: MiningHistory,
  userState: UserState,
  userAddress: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: MiningExpenses,
): { net: Yield; gross: Yield; grossTaxeFree: Yield } => {
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

  const grossYieldTaxeFree: { usd: number; btc: number; apr: number } = {
    usd: 0,
    btc: 0,
    apr: 0,
  };

  if (miningState && userState && userState.byAddress[userAddress]) {
    let netBtc: BigNumber = new BigNumber(0);
    let netUsd: BigNumber = new BigNumber(0);
    let netApr: BigNumber = new BigNumber(0);
    let grossBtc: BigNumber = new BigNumber(0);
    let grossUsd: BigNumber = new BigNumber(0);
    let grossApr: BigNumber = new BigNumber(0);
    let grossBtcTaxeFree: BigNumber = new BigNumber(0);
    let grossUsdTaxeFree: BigNumber = new BigNumber(0);
    let grossAprTaxeFree: BigNumber = new BigNumber(0);

    const totalInvested: BigNumber = getUserInvestment(userState, userAddress);
    for (const siteId of getUserSiteIds(userState, userAddress)) {
      const { realPeriod, realStartTimestamp } = getPeriodFromStart(
        SITES[siteId as SiteID],
        startDate,
        endDate,
      );
      const siteYield = getUserYieldBySite(
        miningState,
        userState,
        siteId,
        userAddress,
        realPeriod,
        btcPrice,
        realStartTimestamp,
        endDate,
        expenses.byId[siteId] ?? [],
      );
      const siteInvestementShare: BigNumber = new BigNumber(
        getUserTokenBalance(userState, userAddress, siteId).usd,
      ).dividedBy(totalInvested);

      netBtc = netBtc.plus(siteYield.net.btc);
      netUsd = netUsd.plus(siteYield.net.usd);
      netApr = netApr.plus(siteInvestementShare.times(siteYield.net.apr));
      grossBtc = grossBtc.plus(siteYield.gross.btc);
      grossUsd = grossUsd.plus(siteYield.gross.usd);
      grossApr = grossApr.plus(siteInvestementShare.times(siteYield.gross.apr));
      grossBtcTaxeFree = grossBtcTaxeFree.plus(siteYield.grossTaxeFree.btc);
      grossUsdTaxeFree = grossUsdTaxeFree.plus(siteYield.grossTaxeFree.usd);
      grossAprTaxeFree = grossAprTaxeFree.plus(
        siteInvestementShare.times(siteYield.grossTaxeFree.apr),
      );
    }

    netYield.btc = netBtc.toNumber();
    netYield.usd = netUsd.toNumber();
    netYield.apr = netApr.toNumber();
    grossYield.btc = grossBtc.toNumber();
    grossYield.usd = grossUsd.toNumber();
    grossYield.apr = grossApr.toNumber();
    grossYieldTaxeFree.btc = grossBtcTaxeFree.toNumber();
    grossYieldTaxeFree.usd = grossUsdTaxeFree.toNumber();
    grossYieldTaxeFree.apr = grossAprTaxeFree.toNumber();
  }

  return {
    net: netYield,
    gross: grossYield,
    grossTaxeFree: grossYieldTaxeFree,
  };
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
  miningState: MiningHistory,
  userState: UserState,
  siteId: string,
  userAddress: string,
  tokenProperties: PropertiesERC20 | undefined,
): BigNumber => {
  if (miningState && userState && userState.byAddress[userAddress]) {
    const tokenSupply = tokenProperties
      ? tokenProperties.supply
      : SITES[siteId as SiteID].token.supply;
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
  miningState: MiningHistory,
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
    const site: Site = SITES[siteId as SiteID];
    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );
    const days = getMiningDays(
      miningState,
      siteId,
      period,
      realStartTimestamp,
      endDate,
    );
    let uptimeHashrate: BigNumber = new BigNumber(0);
    let uptimePercentage: BigNumber = new BigNumber(0);
    let uptimeTotalMachines: BigNumber = new BigNumber(0);

    for (const day of days) {
      uptimeHashrate = uptimeHashrate.plus(day.hashrate);
      uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
      uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);
    }

    return {
      days: countUniqueDates(days),
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

function countUniqueDates(days: MiningSummaryPerDay[]): number {
  const uniqueDates = new Set<string>();

  for (const day of days) {
    uniqueDates.add(day.date);
  }
  return uniqueDates.size;
}

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

export function getSiteExpensesByPeriod(
  miningState: MiningHistory,
  siteId: string,
  btcPrice: number,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
): SiteCost {
  const site: Site = SITES[siteId as SiteID];
  const { realPeriod, realStartTimestamp } = getPeriodFromStart(
    site,
    startDate,
    endDate,
  );
  const feeParameters = site.fees;
  const { value: usdIncome } = getMinedBtc(
    miningState,
    siteId,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expenses,
  );
  const equipementDepreciation = getEquipementDepreciation(
    site,
    startDate,
    endDate,
  );

  const estimatedElectricityCost = calculateElectricityCostPerPeriod(
    miningState,
    siteId,
    realPeriod,
    realStartTimestamp,
    endDate,
    expenses,
    btcPrice,
  );

  if (miningState.byId[siteId].mining === undefined) {
    return {
      total: 0,
      totalTaxeFree: 0,
      electricity: 0,
      feeCSM: 0,
      feeOperator: 0,
      taxe: 0,
      provision: 0,
    };
  }

  const { feeCsm, feeOperator, taxe, provision } =
    calculateCostsAndEBITDAByPeriod(
      usdIncome,
      estimatedElectricityCost,
      equipementDepreciation,
      feeParameters,
      realPeriod,
      realStartTimestamp,
      endDate,
      expenses,
      miningState.byId[siteId].mining.days,
      btcPrice,
    );

  return {
    total: estimatedElectricityCost
      .plus(feeCsm)
      .plus(feeOperator)
      .plus(taxe)
      .plus(provision)
      .toNumber(),
    totalTaxeFree: estimatedElectricityCost
      .plus(feeCsm)
      .plus(feeOperator)
      .toNumber(),
    electricity: estimatedElectricityCost.toNumber(),
    feeCSM: feeCsm.toNumber(),
    feeOperator: feeOperator.toNumber(),
    taxe: taxe.toNumber(),
    provision: provision.toNumber(),
  };
}
