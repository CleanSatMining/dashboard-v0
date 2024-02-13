import BigNumber from 'bignumber.js';
import { Expense } from 'src/types/mining/Mining';
import {
  FEE_RATE_BBGS,
  FEE_RATE_CSM,
  PROVISION_RATE,
  SITES,
  SWISS_TAXE,
  SiteID,
} from 'src/constants';
import { MiningHistory } from 'src/types/mining/Mining';
import { Site, Fees } from 'src/types/mining/Site';

import { getPeriodFromStart, getMiningDays } from './period';
import { calculateExpenses } from './expenses';

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
export function calculateElectricityCostPerPeriod(
  miningState: MiningHistory,
  siteId: string,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
  btcPrice: number,
): BigNumber {
  const site: Site = SITES[siteId as SiteID];
  let electricityCost: BigNumber = new BigNumber(0);

  const days = getMiningDays(miningState, siteId, period, startDate, endDate);
  console.log(JSON.stringify(days));
  const { electricity, billingStartDateTime, billingEndDateTime } =
    calculateExpenses(expenses, startDate, endDate);

  const billingElectricity = electricity.times(btcPrice);

  for (const day of days) {
    const dateTime = new Date(day.date).getTime();
    if (dateTime < billingStartDateTime || dateTime > billingEndDateTime) {
      const electricityCostPerDay = calculateElececticityCostPerDay(
        site,
        site.mining.asics.units,
        day.uptimePercentage / 100,
      );

      electricityCost = electricityCost.plus(electricityCostPerDay);
    }
  }

  return electricityCost.plus(billingElectricity);
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
  startDate: number,
  endDate: number,
  expenses: Expense[],
): {
  netUsdIncome: BigNumber;
  netBtcIncome: BigNumber;
  netApr: BigNumber;
} {
  const site: Site = SITES[siteId as SiteID];
  const fees = site.fees;
  const usdIncome = btcIncome.times(btcPrice);
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const realPeriod = getPeriodFromStart(site, period);

  const { taxe, EBITDA, provision } = calculateCostsAndEBITDAByPeriod(
    usdIncome,
    electricityCost,
    fees,
    equipement,
    realPeriod,
    startDate,
    endDate,
    expenses,
    btcPrice,
  );

  const EBITDA_MINUS_PROVISION = EBITDA.minus(provision); //BigNumber.max(    EBITDA.minus(provision),    new BigNumber(0),  );

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
  startDate: number,
  endDate: number,
  expenses: Expense[],
): {
  usdIncome: BigNumber;
  btcIncome: BigNumber;
  apr: BigNumber;
} {
  const site: Site = SITES[siteId as SiteID];
  const fees = site.fees;
  const minedBtcValue = minedBtc.times(btcPrice);
  const realPeriod = getPeriodFromStart(site, period);
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);

  const { taxe, EBITDA } = calculateCostsAndEBITDAByPeriod(
    minedBtcValue,
    electricityCost,
    fees,
    equipement,
    realPeriod,
    startDate,
    endDate,
    expenses,
    btcPrice,
  );

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
  startDate: number,
  endDate: number,
  expenses: Expense[],
  btcPrice: number,
): {
  feeCsm: BigNumber;
  feeOperator: BigNumber;
  taxe: BigNumber;
  provision: BigNumber;
  EBITDA: BigNumber;
} {
  const {
    period: billingPeriod,
    csm: csmBillingExpense,
    operator: operatorBillingExpense,
  } = calculateExpenses(expenses, startDate, endDate);
  const unBilledDays = realPeriod - billingPeriod;
  const unbilledRate = unBilledDays / realPeriod;
  const csmBillingExpenseUsd = csmBillingExpense.times(btcPrice);
  const operatorBillingExpenseUsd = operatorBillingExpense.times(btcPrice);

  const estimatedFeeCsmUsd = usdIncome
    .minus(electricityCost)
    .times(feeParameters.operational.csm)
    .times(unbilledRate);
  const estimatedFeeOperatorUsd = usdIncome
    .minus(electricityCost)
    .times(feeParameters.operational.operator.rate)
    .times(unbilledRate);
  const EBITDA = usdIncome
    .minus(electricityCost)
    .minus(estimatedFeeCsmUsd)
    .minus(estimatedFeeOperatorUsd)
    .minus(csmBillingExpenseUsd)
    .minus(operatorBillingExpenseUsd);
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
    feeCsm: estimatedFeeCsmUsd.plus(csmBillingExpenseUsd),
    feeOperator: estimatedFeeOperatorUsd.plus(operatorBillingExpenseUsd),
    taxe: taxe,
    provision: provisionCut,
    EBITDA: EBITDA,
  };
}
