import BigNumber from 'bignumber.js';
import { getMiningDays } from './period';
import {
  MiningHistory,
  UserState,
  MiningExpenses,
} from 'src/types/mining/Mining';
import { Expense } from 'src/types/mining/Mining';
import { ALLOWED_SITES, SITES, SiteID } from '../../../constants/csm';
import { PropertiesERC20 } from 'src/types/PropertiesToken';
import { Site, TokenBalance, Yield } from '../../../types/mining/Site';
import {
  calculateElectricityCostPerPeriod,
  calculateNetYield,
  calculateGrossYield,
  calculateCostsAndEBITDAByPeriod,
} from './pnl';
import { getPeriodFromStart, getHashrate, getEquipementCost } from './period';
import { getTimestampAtMidnightUTC } from 'src/components/Display/components/Utils';

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
  miningState: MiningHistory,
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
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
    );

    netYield.usd = netUsdIncome.toNumber();
    netYield.btc = netBtcIncome.toNumber();
    netYield.apr = netApr.toNumber();

    const { apr, btcIncome, usdIncome } = calculateGrossYield(
      siteId,
      siteBtcIncome,
      btcPrice,
      electricityCost,
      period,
      startDate,
      endDate,
      expenses,
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
  miningState: MiningHistory,
  userState: UserState,
  siteId: string,
  userAddress: string,
  period: number,
  btcPrice: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
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
      expenses,
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
        expenses.byId[siteId] ?? [],
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
): {
  machines: number;
  days: number;
  percent: number;
  hashrate: number;
  hashratePercent: number;
  hashrates: number[];
  hashratePercents: number[];
} => {
  if (
    miningState &&
    miningState.byId &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getPeriodFromStart(site, period);
    const startTimestampUTC = getTimestampAtMidnightUTC(startDate);
    const endTimestampUTC = getTimestampAtMidnightUTC(endDate);
    const days = getMiningDays(
      miningState,
      siteId,
      period,
      startTimestampUTC,
      endTimestampUTC,
    );
    const hashrates: BigNumber[] = site.mining.asics.map(
      () => new BigNumber(0),
    );
    const hashratePercents: BigNumber[] = site.mining.asics.map(
      () => new BigNumber(0),
    );
    const periods: number[] = site.mining.asics.map(() => 0);

    let uptimeHashrate: BigNumber = new BigNumber(0);
    let uptimeHashratePercent: BigNumber = new BigNumber(0);
    let uptimePercentage: BigNumber = new BigNumber(0);
    let uptimeTotalMachines: BigNumber = new BigNumber(0);

    for (const day of days) {
      uptimeHashrate = uptimeHashrate.plus(day.hashrate);
      uptimeHashratePercent = uptimeHashratePercent.plus(
        new BigNumber(day.hashrate)
          .dividedBy(getHashrate(site, new Date(day.date)))
          .times(100),
      );
      uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
      uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);

      const dayTimestamp = getTimestampAtMidnightUTC(
        new Date(day.date).getTime(),
      );
      for (let i = 0; i < site.mining.asics.length; i++) {
        const asicTimestamp = new Date(site.mining.asics[i].date).getTime();
        const nextAsicTimestamp =
          i + 1 < site.mining.asics.length
            ? getTimestampAtMidnightUTC(
                new Date(site.mining.asics[i + 1].date).getTime(),
              )
            : 4102444800000;
        if (dayTimestamp >= asicTimestamp && dayTimestamp < nextAsicTimestamp) {
          periods[i]++;
          hashrates[i] = hashrates[i].plus(day.hashrate);
          hashratePercents[i] = hashratePercents[i].plus(
            new BigNumber(day.hashrate)
              .dividedBy(getHashrate(site, new Date(day.date)))
              .times(100),
          );
        }
      }
    }

    // if (siteId === '1') {
    //   console.log(
    //     'hashrates days',
    //     realPeriod,
    //     period,
    //     days.length,
    //     JSON.stringify(days, null, 4),
    //     'hashrate ' + uptimeHashrate.dividedBy(realPeriod).toNumber(),
    //     'hashratePercent ' +
    //       uptimeHashratePercent.dividedBy(realPeriod).toNumber(),
    //     'machines ' + uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
    //     'percent ' + uptimePercentage.dividedBy(realPeriod).toNumber(),
    //     JSON.stringify(hashrates, null, 4),
    //     JSON.stringify(hashratePercents, null, 4),
    //   );
    // }

    return {
      days: days.length,
      hashrate: uptimeHashrate.dividedBy(realPeriod).toNumber(),
      hashratePercent: uptimeHashratePercent.dividedBy(realPeriod).toNumber(),
      machines: uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
      percent: uptimePercentage.dividedBy(realPeriod).toNumber(),
      hashrates: hashrates.map((hashrate, i) =>
        hashrate.dividedBy(periods[i]).toNumber(),
      ),
      hashratePercents: hashratePercents.map((hashrate, i) =>
        hashrate.dividedBy(periods[i]).toNumber(),
      ),
    };
  }
  return {
    days: 0,
    hashrate: 0,
    hashratePercent: 0,
    machines: 0,
    percent: 0,
    hashrates: [],
    hashratePercents: [],
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

export function getSiteExpensesByPeriod(
  miningState: MiningHistory,
  siteId: string,
  btcPrice: number,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
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

  //const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const equipement = getEquipementCost(site, startDate, endDate);
  const realPeriod = getPeriodFromStart(site, period);
  const { value: usdIncome } = getMinedBtcBySite(
    miningState,
    siteId,
    realPeriod,
    btcPrice,
    startDate,
    endDate,
  );

  const estimatedElectricityCost = calculateElectricityCostPerPeriod(
    miningState,
    siteId,
    realPeriod,
    startDate,
    endDate,
    expenses,
    btcPrice,
  );

  const { feeCsm, feeOperator, taxe, provision } =
    calculateCostsAndEBITDAByPeriod(
      usdIncome,
      estimatedElectricityCost,
      feeParameters,
      equipement,
      realPeriod,
      startDate,
      endDate,
      expenses,
      btcPrice,
    );

  /* const equipementPeriods = getEquipementPeriods(site, startDate, endDate);

  let estimatedElectricityCost = new BigNumber(0);
  let feeCsm = new BigNumber(0);
  let feeOperator = new BigNumber(0);
  let taxe = new BigNumber(0);
  let provision = new BigNumber(0);

  for (const equipementPeriod of equipementPeriods) {
    const { value: usdIncome } = getMinedBtcBySite(
      miningState,
      siteId,
      equipementPeriod.period,
      btcPrice,
      equipementPeriod.startDate,
      equipementPeriod.endDate,
    );

    const estimatedElectricityCostPeriod = calculateElectricityCostPerPeriod(
      miningState,
      siteId,
      equipementPeriod.period,
      equipementPeriod.startDate,
      equipementPeriod.endDate,
      expenses,
      btcPrice,
    );

    const {
      feeCsm: feeCsmPeriod,
      feeOperator: feeOperatorPeriod,
      taxe: taxePeriod,
      provision: provisionPeriod,
    } = calculateCostsAndEBITDAByPeriod(
      usdIncome,
      estimatedElectricityCostPeriod,
      feeParameters,
      new BigNumber(equipementPeriod.equipementCost),
      equipementPeriod.period,
      equipementPeriod.startDate,
      equipementPeriod.endDate,
      expenses,
      btcPrice,
    );

    estimatedElectricityCost = estimatedElectricityCost.plus(
      estimatedElectricityCostPeriod,
    );
    feeCsm = feeCsm.plus(feeCsmPeriod);
    feeOperator = feeOperator.plus(feeOperatorPeriod);
    taxe = taxe.plus(taxePeriod);
    provision = provision.plus(provisionPeriod);
  } */

  return {
    total: estimatedElectricityCost
      .plus(feeCsm)
      .plus(feeOperator)
      .plus(taxe)
      .plus(provision)
      .toNumber(),
    electricity: estimatedElectricityCost.toNumber(),
    feeCSM: feeCsm.toNumber(),
    feeOperator: feeOperator.toNumber(),
    taxe: taxe.toNumber(),
    provision: provision.toNumber(),
  };
}
