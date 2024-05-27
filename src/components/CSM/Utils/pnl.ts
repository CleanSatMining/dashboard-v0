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
import { MiningHistory, MiningSummaryPerDay } from 'src/types/mining/Mining';
import { Site, Fees } from 'src/types/mining/Site';

import {
  getPeriodFromStart,
  getMiningDays,
  getEquipementDepreciation,
  getPower,
  getNumberOfMachines,
} from './period';
import { calculateExpenses } from './expenses';
import { getMidnight } from 'src/utils/date';

const YEAR_IN_DAYS = new BigNumber(365);

/**
 * calculateElececticityCost
 * @param site
 * @param date
 * @param uptimePercentage
 * @param usdPricePerKWH_in
 * @returns
 */
export function calculateElectricityCost(
  site: Site,
  date: Date,
  uptimePercentage: number,
  usdPricePerKWH_in?: number,
  subaccountId?: number,
): BigNumber {
  const usdPricePerKWH_config =
    site.mining.electricity.subaccount?.find(
      (subaccount) => subaccount.subaccountId === subaccountId,
    )?.usdPricePerKWH ?? site.mining.electricity.usdPricePerKWH;

  const usdPricePerKWH =
    usdPricePerKWH_in !== undefined ? usdPricePerKWH_in : usdPricePerKWH_config;

  const consumption_kwh = new BigNumber(getPower(site, date, subaccountId))
    .times(24)
    .dividedBy(1000);

  const totalMachines = getNumberOfMachines(site, date, subaccountId);
  const electricityCost =
    totalMachines > 0
      ? new BigNumber(usdPricePerKWH)
          .times(consumption_kwh)
          .times(uptimePercentage)
      : new BigNumber(0);
  return electricityCost;
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
  basePricePerKWH?: number,
  subaccountId?: number,
): BigNumber {
  const site: Site = SITES[siteId as SiteID];
  let electricityCost: BigNumber = new BigNumber(0);

  const days = getMiningDays(
    miningState,
    siteId,
    period,
    startDate,
    endDate,
  ).filter(
    (day) => day.subaccountId === subaccountId || subaccountId === undefined,
  );
  const { electricity, billingStartDateTime, billingEndDateTime } =
    calculateExpenses(
      expenses,
      miningState.byId[siteId].mining.days,
      startDate,
      endDate,
      subaccountId,
    );

  const billingElectricity = electricity.times(btcPrice);

  for (const day of days) {
    const dateTime = new Date(day.date).getTime();
    if (dateTime < billingStartDateTime || dateTime > billingEndDateTime) {
      const electricityCostPerDay = calculateElectricityCost(
        site,
        getMidnight(day.date),
        day.uptimePercentage / 100,
        basePricePerKWH,
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
  miningHistory: MiningSummaryPerDay[],
): {
  netUsdIncome: BigNumber;
  netBtcIncome: BigNumber;
  netApr: BigNumber;
} {
  if (btcIncome.gt(0)) {
    const site: Site = SITES[siteId as SiteID];
    const fees = site.fees;
    const usdIncome = btcIncome.times(btcPrice);
    const equipementDepreciation = getEquipementDepreciation(
      site,
      startDate,
      endDate,
    );

    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );

    const { taxe, EBITDA, provision } = calculateCostsAndEBITDAByPeriod(
      usdIncome,
      electricityCost,
      equipementDepreciation,
      fees,
      realPeriod,
      realStartTimestamp,
      endDate,
      expenses,
      miningHistory,
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
  } else {
    return {
      netUsdIncome: new BigNumber(0),
      netBtcIncome: new BigNumber(0),
      netApr: new BigNumber(0),
    };
  }
}

/**
 * calculateGrossYield
 * @param siteId
 * @param minedBtc
 * @param btcPrice
 * @param electricityCost
 * @param period
 * @param startDate
 * @param endDate
 * @param expenses
 * @returns
 */
export function calculateGrossYield(
  siteId: string,
  minedBtc: BigNumber,
  btcPrice: number,
  electricityCost: BigNumber,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
  miningHistory: MiningSummaryPerDay[],
): {
  usdIncome: BigNumber;
  btcIncome: BigNumber;
  apr: BigNumber;
} {
  if (minedBtc.gt(0)) {
    const site: Site = SITES[siteId as SiteID];
    const fees = site.fees;
    const minedBtcValue = minedBtc.times(btcPrice);
    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );
    const equipementDepreciation = getEquipementDepreciation(
      site,
      startDate,
      endDate,
    );

    const { taxe, EBITDA } = calculateCostsAndEBITDAByPeriod(
      minedBtcValue,
      electricityCost,
      equipementDepreciation,
      fees,
      realPeriod,
      realStartTimestamp,
      endDate,
      expenses,
      miningHistory,
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
  } else {
    return {
      usdIncome: new BigNumber(0),
      btcIncome: new BigNumber(0),
      apr: new BigNumber(0),
    };
  }
}

export function calculateGrossYieldTaxeFree(
  siteId: string,
  minedBtc: BigNumber,
  btcPrice: number,
  electricityCost: BigNumber,
  period: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
  miningHistory: MiningSummaryPerDay[],
): {
  usdIncome: BigNumber;
  btcIncome: BigNumber;
  apr: BigNumber;
} {
  if (minedBtc.gt(0)) {
    const site: Site = SITES[siteId as SiteID];
    const fees = site.fees;
    const minedBtcValue = minedBtc.times(btcPrice);
    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );
    const equipementDepreciation = getEquipementDepreciation(
      site,
      startDate,
      endDate,
    );

    const { EBITDA } = calculateCostsAndEBITDAByPeriod(
      minedBtcValue,
      electricityCost,
      equipementDepreciation,
      fees,
      realPeriod,
      realStartTimestamp,
      endDate,
      expenses,
      miningHistory,
      btcPrice,
    );

    // const taxe = EBITDA.times(SWISS_TAXE);
    const usdIncome = EBITDA; // EBITDA.minus(taxe)
    const btcIncome = usdIncome.dividedBy(btcPrice);
    const usdIncomeAYear =
      realPeriod > 0
        ? usdIncome.times(YEAR_IN_DAYS.dividedBy(realPeriod))
        : new BigNumber(0);
    const totalShareValue = new BigNumber(site.token.supply).times(
      site.token.price,
    );
    const apr = totalShareValue.gt(0)
      ? usdIncomeAYear.dividedBy(totalShareValue)
      : new BigNumber(0);

    return {
      usdIncome,
      btcIncome,
      apr,
    };
  } else {
    return {
      usdIncome: new BigNumber(0),
      btcIncome: new BigNumber(0),
      apr: new BigNumber(0),
    };
  }
}

export function calculateCostsAndEBITDAByPeriod(
  usdIncome: BigNumber,
  electricityCost: BigNumber,
  equipementDepreciation: BigNumber,
  feeParameters: Fees,
  //equipementValue: BigNumber,
  realPeriod: number,
  startDate: number,
  endDate: number,
  expenses: Expense[],
  miningHistory: MiningSummaryPerDay[],
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
  } = calculateExpenses(expenses, miningHistory, startDate, endDate);
  const unBilledDays = realPeriod - billingPeriod;
  const unbilledRate = unBilledDays / realPeriod;
  const csmBillingExpenseUsd = csmBillingExpense.times(btcPrice);
  const operatorBillingExpenseUsd = operatorBillingExpense.times(btcPrice);

  const estimatedFeeCsmUsd = BigNumber.maximum(
    usdIncome
      .minus(electricityCost)
      .times(feeParameters.operational.csm)
      .times(unbilledRate),
    0,
  );
  const estimatedFeeOperatorUsd = BigNumber.maximum(
    usdIncome
      .minus(electricityCost)
      .times(feeParameters.operational.operator.rate)
      .times(unbilledRate),
    0,
  );
  const EBITDA = usdIncome
    .minus(electricityCost)
    .minus(estimatedFeeCsmUsd)
    .minus(estimatedFeeOperatorUsd)
    .minus(csmBillingExpenseUsd)
    .minus(operatorBillingExpenseUsd);
  /* const provision = equipementValue
    .times(feeParameters.operational.provision)
    .dividedBy(YEAR_IN_DAYS)
    .times(realPeriod); */
  const provision = equipementDepreciation;
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
