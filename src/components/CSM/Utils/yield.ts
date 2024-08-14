import BigNumber from 'bignumber.js';
import { getMiningDays } from './period';
import {
  MiningHistory,
  UserState,
  MiningExpenses,
} from 'src/types/mining/Mining';
import { Expense, MiningSummaryPerDay } from 'src/types/mining/Mining';
import { ALLOWED_SITES, SITES } from '../../../constants/csm';
import { SiteID } from 'src/types/mining/Site';
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
  site: Site,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
  ignoreSubaccountsRules?: boolean,
): { quantity: BigNumber; value: BigNumber } {
  if (
    miningState &&
    miningState.byId[site.id] &&
    miningState.byId[site.id].mining &&
    miningState.byId[site.id].mining.days
  ) {
    const hasSubaccount = site.api.every((api) => api.subaccount !== undefined);

    let siteBtcMined = new BigNumber(0);

    if (hasSubaccount) {
      let subaccountsBtcMined = new BigNumber(0);
      for (const subaccountApi of site.api) {
        if (subaccountApi.subaccount) {
          const { quantity: subaccountBtcMined } = getMinedBtc_(
            miningState,
            site,
            period,
            btcPrice,
            startDate,
            endDate,
            subaccountApi.subaccount.id,
          );

          if (ignoreSubaccountsRules === true) {
            console.log(
              'ignoreSubaccountsRules',
              site.id,
              ignoreSubaccountsRules,
            );
            subaccountsBtcMined = subaccountsBtcMined.plus(subaccountBtcMined);
          } else {
            const subaccountElectricityCost = calculateElectricityCostPerPeriod(
              miningState,
              site,
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
          }
        } else {
          console.error(
            'No subaccount ' + site.id + ' ' + JSON.stringify(subaccountApi),
          );
        }
      }
      siteBtcMined = subaccountsBtcMined;
    } else {
      const { quantity: siteBtc } = getMinedBtc_(
        miningState,
        site,
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

export function getMinedBtc_(
  miningState: MiningHistory,
  site: Site,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  subaccountId?: number,
): { quantity: BigNumber; value: BigNumber } {
  let sumMinedBtc: BigNumber = new BigNumber(0);

  console.log('getMinedBtc_', site.id);
  const days = getMiningDays(
    miningState,
    site,
    period,
    startDate,
    endDate,
    subaccountId,
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
  site: Site,
  period: number,
  startDate: number,
  endDate: number,
): BigNumber {
  let sumMachines: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, site, period, startDate, endDate);
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
  site: Site,
  period: number,
  startDate: number,
  endDate: number,
): BigNumber {
  let uptimePercentage: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, site, period, startDate, endDate);
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
  site: Site,
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
    miningState.byId[site.id] &&
    miningState.byId[site.id].mining &&
    miningState.byId[site.id].mining.days
  ) {
    const { quantity: siteBtcMined } = getMinedBtc(
      miningState,
      site,
      period,
      btcPrice,
      startDate,
      endDate,
      expenses,
    );

    const electricityCost = calculateElectricityCostPerPeriod(
      miningState,
      site,
      period,
      startDate,
      endDate,
      expenses,
      btcPrice,
    );
    const { netUsdIncome, netBtcIncome, netApr } = calculateNetYield(
      site,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[site.id]?.mining.days ?? [],
    );

    netYield.usd = netUsdIncome.toNumber();
    netYield.btc = netBtcIncome.toNumber();
    netYield.apr = netApr.toNumber();

    const { apr, btcIncome, usdIncome } = calculateGrossYield(
      site,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[site.id]?.mining.days ?? [],
    );

    grossYield.usd = usdIncome.toNumber();
    grossYield.btc = btcIncome.toNumber();
    grossYield.apr = apr.toNumber();

    const {
      apr: aprTaxeFree,
      btcIncome: btcIncomeWithoutTaxe,
      usdIncome: usdIncomeWithoutIncome,
    } = calculateGrossYieldTaxeFree(
      site,
      siteBtcMined,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
      miningState.byId[site.id]?.mining.days ?? [],
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
  site: Site,
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
    miningState.byId[site.id] &&
    miningState.byId[site.id].mining &&
    miningState.byId[site.id].mining.days &&
    //miningState.byId[siteId].mining.days.length > 0 &&
    userState &&
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[site.id] &&
    userState.byAddress[userAddress].bySite[site.id].token
  ) {
    const tokenSupply: BigNumber = new BigNumber(site.token.supply);
    const tokenBalance: BigNumber = new BigNumber(
      userState.byAddress[userAddress].bySite[site.id].token.balance,
    );
    const siteYield = getYieldBySite(
      miningState,
      site,
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
  site: Site,
  toCome?: boolean,
): TokenBalance => {
  if (
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[site.id] &&
    (userState.byAddress[userAddress].bySite[site.id].token.balance > 0 ||
      toCome)
  ) {
    const tokenPrice: BigNumber = new BigNumber(site.token.price);
    const tokenBalance: number =
      userState.byAddress[userAddress].bySite[site.id].token.balance;
    const tokenToCome: number =
      userState.byAddress[userAddress].bySite[site.id].token.toCome?.amount ??
      0;
    const tokenToComeUsd: number =
      userState.byAddress[userAddress].bySite[site.id].token.toCome?.usd ?? 0;

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
  site: Site,
): TokenBalance => {
  if (
    userState.byAddress[userAddress] &&
    userState.byAddress[userAddress].bySite[site.id]
  ) {
    const tokenToCome: number =
      userState.byAddress[userAddress].bySite[site.id].token.toCome?.amount ??
      0;
    const tokenToComeUsd: number =
      userState.byAddress[userAddress].bySite[site.id].token.toCome?.usd ?? 0;

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
        return getUserTokenBalance(
          userState,
          userAddress,
          SITES[siteId as SiteID],
          toCome,
        ).usd;
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
      const site = SITES[siteId as SiteID];
      const { realPeriod, realStartTimestamp } = getPeriodFromStart(
        SITES[siteId as SiteID],
        startDate,
        endDate,
      );
      const siteYield = getUserYieldBySite(
        miningState,
        userState,
        site,
        userAddress,
        realPeriod,
        btcPrice,
        realStartTimestamp,
        endDate,
        expenses.byId[siteId] ?? [],
      );
      const siteInvestementShare: BigNumber = new BigNumber(
        getUserTokenBalance(userState, userAddress, site).usd,
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
  site: Site,
  userAddress: string,
  tokenProperties: PropertiesERC20 | undefined,
): BigNumber => {
  if (miningState && userState && userState.byAddress[userAddress]) {
    const tokenSupply = tokenProperties
      ? tokenProperties.supply
      : site.token.supply;
    return new BigNumber(
      getUserTokenBalance(userState, userAddress, site).balance,
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
  site: Site,
  period: number,
  startDate: number,
  endDate: number,
  subaccountId?: number,
): { machines: number; days: number; percent: number; hashrate: number } => {
  if (period === 0 || startDate > endDate)
    return { machines: 0, days: 0, percent: 0, hashrate: 0 };

  if (
    (miningState &&
      miningState.byId &&
      miningState.byId[site.id] &&
      miningState.byId[site.id]?.mining.days) ??
    []
  ) {
    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );
    console.log('getUptimeBySite', site.id, subaccountId);
    const days = getMiningDays(
      miningState,
      site,
      period,
      realStartTimestamp,
      endDate,
      subaccountId,
    );

    if (realPeriod === 0 || days.length === 0)
      return { machines: 0, days: 0, percent: 0, hashrate: 0 };

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
    site !== undefined &&
    site.mining !== undefined &&
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
  site: Site,
  btcPrice: number,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
): SiteCost {
  const { realPeriod, realStartTimestamp } = getPeriodFromStart(
    site,
    startDate,
    endDate,
  );
  const feeParameters = site.fees;
  const { value: usdIncome } = getMinedBtc(
    miningState,
    site,
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
    site,
    realPeriod,
    realStartTimestamp,
    endDate,
    expenses,
    btcPrice,
  );

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
      miningState.byId[site.id]?.mining.days ?? [],
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
