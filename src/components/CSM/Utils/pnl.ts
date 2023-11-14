import BigNumber from 'bignumber.js';

import {
  FEE_RATE_BBGS,
  FEE_RATE_CSM,
  PROVISION_RATE,
  SITES,
  SWISS_TAXE,
  SiteID,
} from 'src/constants';
import { MiningState } from 'src/types/mining/Mining';
import { Site, Fees } from 'src/types/mining/Site';

import { getRealPeriod, getMiningDays } from './period';

const YEAR_IN_DAYS = new BigNumber(365);

/**
 * calculateElececticityCostPerDay
 * @param site
 * @param totalMachines
 * @param uptimePercentage
 * @returns
 */
export function calculateElececticityCostPerDay(
  site: Site,
  totalMachines: number,
  uptimePercentage: number,
): BigNumber {
  const consumption_kwh_per_day_per_machine = new BigNumber(
    site.mining.asics.powerW,
  )
    .times(24)
    .dividedBy(1000);
  const electricityCostPerDay =
    site.mining.asics.units > 0
      ? new BigNumber(site.mining.electricity.usdPricePerKWH)
          .times(consumption_kwh_per_day_per_machine)
          .times(uptimePercentage)
          .times(totalMachines)
      : new BigNumber(0);
  return electricityCostPerDay;
}

/**
 * calculateElececticityCostPerPeriod
 *
 * @param miningState
 * @param siteId
 * @param period
 * @returns
 */
export function calculateElececticityCostPerPeriod(
  miningState: MiningState,
  siteId: string,
  period: number,
  startDate: number,
  endDate: number,
): BigNumber {
  const site: Site = SITES[siteId as SiteID];
  let electricityCost: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, siteId, period, startDate, endDate);
  for (const day of days) {
    const electricityCostPerDay = calculateElececticityCostPerDay(
      site,
      site.mining.asics.units,
      day.uptimePercentage / 100,
    );

    electricityCost = electricityCost.plus(electricityCostPerDay);
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
  //       const electricityCostPerDay = calculateElececticityCostPerDay(
  //         site,
  //         site.mining.asics.units,
  //         miningState.byId[siteId].mining.days[i].uptimePercentage / 100,
  //       );

  //       electricityCost = electricityCost.plus(electricityCostPerDay);
  //     }
  //   }
  // }

  return electricityCost;
}

/**
 * calculateYield
 *
 * @param siteId
 * @param btcIncome
 * @param btcPrice
 * @param miningState
 * @param period
 * @returns
 */
export function calculateYield_deprecated(
  siteId: string,
  btcIncome: BigNumber,
  btcPrice: number,
  electricityCostPerPeriod: BigNumber,
  period: number,
): {
  incomeUsd: BigNumber;
  incomeBtc: BigNumber;
  apr: BigNumber;
} {
  const site: Site = SITES[siteId as SiteID];
  const usdRevenue = btcIncome.times(btcPrice);

  const feeCSMUsd = usdRevenue
    .minus(electricityCostPerPeriod)
    .times(FEE_RATE_CSM);
  const feeBBGSUsd = usdRevenue
    .minus(electricityCostPerPeriod)
    .times(FEE_RATE_BBGS);
  const EBITDA = usdRevenue
    .minus(electricityCostPerPeriod)
    .minus(feeCSMUsd)
    .minus(feeBBGSUsd);
  const provision = EBITDA.times(PROVISION_RATE);
  const taxe = EBITDA.minus(provision).times(SWISS_TAXE);
  const netIncomeUsdPerPeriod = EBITDA.minus(provision).minus(taxe);
  const netIncomeBtcPerPeriod = netIncomeUsdPerPeriod.dividedBy(btcPrice);
  const apr =
    period > 0
      ? netIncomeUsdPerPeriod
          .times(new BigNumber(365).dividedBy(period))
          .dividedBy(site.token.supply)
          .times(site.token.price)
          .dividedBy(100)
      : new BigNumber(0);
  return {
    incomeUsd: netIncomeUsdPerPeriod,
    incomeBtc: netIncomeBtcPerPeriod,
    apr: apr,
  };
}

/**
 * calculateNetYield
 * @param siteId
 * @param btcIncome
 * @param btcPrice
 * @param electricityCost
 * @param period
 * @returns
 */
export function calculateNetYield(
  siteId: string,
  btcIncome: BigNumber,
  btcPrice: number,
  electricityCost: BigNumber,
  period: number,
): {
  netUsdIncome: BigNumber;
  netBtcIncome: BigNumber;
  netApr: BigNumber;
} {
  const site: Site = SITES[siteId as SiteID];
  const fees = site.fees;
  const usdIncome = btcIncome.times(btcPrice);
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const realPeriod = getRealPeriod(site, period);

  const { taxe, EBITDA, provision } = calculateCostsAndEBITDAByPeriod(
    usdIncome,
    electricityCost,
    fees,
    equipement,
    realPeriod,
  );

  const EBITDA_MINUS_PROVISION = EBITDA.minus(provision); //BigNumber.max(    EBITDA.minus(provision),    new BigNumber(0),  );
  //const taxe_i = EBITDA_MINUS_PROVISION.times(SWISS_TAXE);
  const netUsdIncome = EBITDA_MINUS_PROVISION.minus(taxe);
  const netBtcIncome = netUsdIncome.dividedBy(btcPrice);
  const netUsdIncomeAYear =
    realPeriod > 0
      ? netUsdIncome.times(YEAR_IN_DAYS.dividedBy(realPeriod))
      : new BigNumber(0);
  const totalShareValue = new BigNumber(site.token.supply).times(
    site.token.price,
  );
  const netApr = totalShareValue.gt(0)
    ? netUsdIncomeAYear.dividedBy(totalShareValue)
    : new BigNumber(0);

  return {
    netUsdIncome,
    netBtcIncome,
    netApr,
  };
}

export function calculateGrossYield(
  siteId: string,
  minedBtc: BigNumber,
  btcPrice: number,
  electricityCost: BigNumber,
  period: number,
): {
  usdIncome: BigNumber;
  btcIncome: BigNumber;
  apr: BigNumber;
} {
  const site: Site = SITES[siteId as SiteID];
  const fees = site.fees;
  const minedBtcValue = minedBtc.times(btcPrice);
  const realPeriod = getRealPeriod(site, period);
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);

  const { taxe, EBITDA } = calculateCostsAndEBITDAByPeriod(
    minedBtcValue,
    electricityCost,
    fees,
    equipement,
    realPeriod,
  );

  // const feeCsmUsd = minedBtcValue
  //   .minus(electricityCost)
  //   .times(fees.operational.csm);
  // const feeOperatorUsd = minedBtcValue
  //   .minus(electricityCost)
  //   .times(fees.operational.operator);
  // const EBITDA = minedBtcValue
  //   .minus(electricityCost)
  //   .minus(feeCsmUsd)
  //   .minus(feeOperatorUsd);

  // const taxe = EBITDA.times(SWISS_TAXE);
  const usdIncome = EBITDA.minus(taxe);
  const btcIncome = usdIncome.dividedBy(btcPrice);
  const netUsdIncomeAYear =
    realPeriod > 0
      ? usdIncome.times(YEAR_IN_DAYS.dividedBy(realPeriod))
      : new BigNumber(0);
  const totalShareValue = new BigNumber(site.token.supply).times(
    site.token.price,
  );
  const apr = totalShareValue.gt(0)
    ? netUsdIncomeAYear.dividedBy(totalShareValue)
    : new BigNumber(0);

  /* console.log('PNL', siteId, 'period', period, 'vs', realPeriod);
  console.log('PNL', siteId, 'btcPrice', formatBTC(btcPrice));
  console.log('PNL', siteId, 'usdIncome', formatUsd(usdIncome.toNumber()));
  console.log('PNL', siteId, 'btcIncome', formatBTC(btcIncome.toNumber()));
  console.log(
    'PNL',
    siteId,
    'electricityCost',
    formatUsd(electricityCost.toNumber())
  );
  console.log('PNL', siteId, 'feeCsmUsd', formatUsd(feeCsmUsd.toNumber()));
  console.log(
    'PNL',
    siteId,
    'feeOperatorUsd',
    formatUsd(feeOperatorUsd.toNumber())
  );
  console.log('PNL', siteId, 'EBITDA', formatUsd(EBITDA.toNumber()));
  console.log(
    'PNL',
    siteId,
    'EBITDA_CUT_LOST',
    formatUsd(EBITDA_CUT_LOST.toNumber())
  );
  console.log('PNL', siteId, 'provision', formatUsd(provision.toNumber()));
  console.log('PNL', siteId, 'taxe', formatUsd(taxe.toNumber()));
  console.log(
    'PNL',
    siteId,
    'netUsdIncome',
    formatUsd(netUsdIncome.toNumber())
  );
  console.log(
    'PNL',
    siteId,
    'netBtcIncome',
    formatBTC(netBtcIncome.toNumber())
  );
  console.log(
    'PNL',
    siteId,
    'netUsdIncomeAYear',
    formatUsd(netUsdIncomeAYear.toNumber())
  ); */

  return {
    usdIncome,
    btcIncome,
    apr,
  };
}

export function calculateCostsAndEBITDAByPeriod(
  usdIncome: BigNumber,
  electricityCost: BigNumber,
  feeParameters: Fees,
  equipementValue: BigNumber,
  realPeriod: number,
): {
  feeCsm: BigNumber;
  feeOperator: BigNumber;
  taxe: BigNumber;
  provision: BigNumber;
  EBITDA: BigNumber;
} {
  const feeCsmUsd = usdIncome
    .minus(electricityCost)
    .times(feeParameters.operational.csm);
  const feeOperatorUsd = usdIncome
    .minus(electricityCost)
    .times(feeParameters.operational.operator.rate);
  const EBITDA = usdIncome
    .minus(electricityCost)
    .minus(feeCsmUsd)
    .minus(feeOperatorUsd);
  const provision = equipementValue
    .times(feeParameters.operational.provision)
    .dividedBy(YEAR_IN_DAYS)
    .times(realPeriod);
  const EBITDA_MINUS_PROVISION = EBITDA.minus(provision);
  const taxe = BigNumber.max(
    EBITDA_MINUS_PROVISION.times(SWISS_TAXE),
    new BigNumber(0),
  );

  const provisionCut = EBITDA_MINUS_PROVISION.gt(0) ? provision : EBITDA;

  return {
    feeCsm: feeCsmUsd,
    feeOperator: feeOperatorUsd,
    taxe: taxe,
    provision: provisionCut,
    EBITDA: EBITDA,
  };
}
