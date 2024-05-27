import { Expense, MiningSummaryPerDay } from 'src/types/mining/Mining';
import BigNumber from 'bignumber.js';
import { getTimestampUTC } from 'src/utils/date';

export function calculateExpenses(
  expenses: Expense[],
  miningHistory: MiningSummaryPerDay[],
  startDateTime: number,
  endDateTime: number,
  subaccountId?: number,
): {
  total: BigNumber;
  csm: BigNumber;
  operator: BigNumber;
  electricity: BigNumber;
  billingStartDateTime: number;
  billingEndDateTime: number;
  period: number;
} {
  // Filtrer les dépenses qui sont dans la plage de dates spécifiée
  const filteredExpenses = expenses
    .filter(
      (e) =>
        subaccountId === undefined || // Si subaccountId est undefined, on ne filtre pas par subaccountId
        e.subaccountId === subaccountId || // Si subaccountId est défini, on filtre par subaccountId
        (e.subaccountId === undefined && subaccountId === 0), // Si subaccountId est 0, on filtre les dépenses sans subaccountId
    )
    .filter((expense) => {
      const expenseDateTime = expense.dateTime;
      const firstDayOfBilling = getFirstDayOfMonth(
        new Date(expenseDateTime),
      ).getTime();
      const lastDayOfBilling = getLastDayOfMonth(
        new Date(expenseDateTime),
      ).getTime();
      return (
        lastDayOfBilling >= startDateTime && firstDayOfBilling <= endDateTime
      );
    });

  const totalExpenses = calculateExpensesInRange(
    filteredExpenses,
    miningHistory.filter(
      (d) =>
        subaccountId === undefined || // Si subaccountId est undefined, on ne filtre pas par subaccountId
        d.subaccountId === subaccountId || // Si subaccountId est défini, on filtre par subaccountId
        (d.subaccountId === undefined && subaccountId === 0), // Si subaccountId est 0, on filtre les dépenses sans subaccountId
    ),
    startDateTime,
    endDateTime,
  );

  return totalExpenses;
}

function calculateExpensesInRange(
  expenses: Expense[],
  miningHistory: MiningSummaryPerDay[],
  startDateTime: number,
  endDateTime: number,
): {
  total: BigNumber;
  csm: BigNumber;
  operator: BigNumber;
  electricity: BigNumber;
  billingStartDateTime: number;
  billingEndDateTime: number;
  period: number;
} {
  let totalExpenses = new BigNumber(0);
  let csmExpenses = new BigNumber(0);
  let operatorExpenses = new BigNumber(0);
  let electricityExpenses = new BigNumber(0);

  //console.log('calculateExpensesInRange expenses', expenses);

  expenses.forEach((expense) => {
    const expenseDateTime = expense.dateTime;
    const firstDayOfBilling = getFirstDayOfMonth(
      new Date(expenseDateTime),
    ).getTime();
    const lastDayOfBilling = getLastDayOfMonth(
      new Date(expenseDateTime),
    ).getTime();

    // Vérifier si la dépense est comprise dans la plage de dates
    if (lastDayOfBilling >= startDateTime && firstDayOfBilling <= endDateTime) {
      let proratedAmount = new BigNumber(expense.csm)
        .plus(expense.operator)
        .plus(expense.electricity);
      let proratedCsmAmount = new BigNumber(expense.csm);
      let proratedOperatorAmount = new BigNumber(expense.operator);
      let proratedElectricityAmount = new BigNumber(expense.electricity);

      const daysInMonth = new Date(lastDayOfBilling).getUTCDate();
      let daysRemaining = daysInMonth;

      // Calculer le prorata pour la date de début
      if (firstDayOfBilling < startDateTime) {
        //calculer le nombre de jours restants dans le mois (debut période -> fin du mois)
        daysRemaining =
          daysRemaining - new Date(startDateTime).getUTCDate() + 1;
      }

      // Calculer le prorata pour la date de fin
      if (lastDayOfBilling > endDateTime) {
        //calculer le nombre de jours restants dans le mois (début du mois -> fin période)
        daysRemaining =
          daysRemaining - (daysInMonth - new Date(endDateTime).getUTCDate());
      }

      if (daysRemaining < daysInMonth) {
        //calculer le prorata des jours restants dans le cas où la période est inférieure à un mois

        const monthlyHashrate: BigNumber = miningHistory
          .filter(
            (d) =>
              new Date(d.date).getUTCMonth() ===
                new Date(expense.dateTime).getUTCMonth() &&
              new Date(d.date).getUTCFullYear() ===
                new Date(expense.dateTime).getUTCFullYear(),
          )
          .reduce(
            (sum, current) => sum.plus(current.hashrate),
            new BigNumber(0),
          );

        let monthRatio = new BigNumber(1);

        if (monthlyHashrate.isZero()) {
          monthRatio = new BigNumber(daysRemaining).dividedBy(daysInMonth);
        } else {
          let periodHashrate: BigNumber = new BigNumber(0);
          for (let i = 0; i < daysRemaining; i++) {
            const date = new Date(startDateTime + i * 24 * 60 * 60 * 1000);
            const dayHashrate =
              miningHistory.find((d) => {
                return (
                  new Date(d.date).getUTCDate() === date.getUTCDate() &&
                  new Date(d.date).getUTCMonth() === date.getUTCMonth() &&
                  new Date(d.date).getUTCFullYear() === date.getUTCFullYear()
                );
              })?.hashrate || 0;

            periodHashrate = periodHashrate.plus(dayHashrate);
          }
          // Calculer le ratio de hashrate

          monthRatio = periodHashrate.dividedBy(monthlyHashrate);
        }

        proratedAmount = proratedAmount.times(monthRatio);
        proratedCsmAmount = proratedCsmAmount.times(monthRatio);
        proratedOperatorAmount = proratedOperatorAmount.times(monthRatio);
        proratedElectricityAmount = proratedElectricityAmount.times(monthRatio);
      }

      totalExpenses = totalExpenses.plus(proratedAmount);
      csmExpenses = csmExpenses.plus(proratedCsmAmount);
      operatorExpenses = operatorExpenses.plus(proratedOperatorAmount);
      electricityExpenses = electricityExpenses.plus(proratedElectricityAmount);
    }
  });

  const start = getFirstDayOfBilling(expenses)
    ? Math.max(getFirstDayOfBilling(expenses)?.getTime() || 0, startDateTime)
    : 0;
  const end = Math.min(
    getLastDayOfBilling(expenses)?.getTime() || 0,
    endDateTime,
  );

  return {
    total: totalExpenses,
    csm: csmExpenses,
    operator: operatorExpenses,
    electricity: electricityExpenses,
    billingEndDateTime: end,
    billingStartDateTime: start,
    period: calculateDaysBetweenDates(start, end),
  };
}

export function getLastDayOfBilling(expenses: Expense[]): Date | null {
  if (expenses.length === 0) {
    return null; // Retourne null si la liste des dépenses est vide
  }

  let mostRecentDate = new Date(expenses[0].dateTime);

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.dateTime);

    if (expenseDate > mostRecentDate) {
      mostRecentDate = expenseDate;
    }
  });

  return getLastDayOfMonth(mostRecentDate);
}

export function getFirstDayOfBilling(expenses: Expense[]): Date | null {
  if (expenses.length === 0) {
    return null; // Retourne null si la liste des dépenses est vide
  }

  let oldestDate = new Date(expenses[0].dateTime);

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.dateTime);

    if (expenseDate < oldestDate) {
      oldestDate = expenseDate;
    }
  });

  return getFirstDayOfMonth(oldestDate);
}

export function getFirstDayWithoutExpense(expenses: Expense[]): Date | null {
  if (expenses.length === 0) {
    return null; // Retourne null si la liste des dépenses est vide
  }

  let mostRecentDate = new Date(expenses[0].dateTime);

  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.dateTime);

    if (expenseDate > mostRecentDate) {
      mostRecentDate = expenseDate;
    }
  });

  return getFirstDayOfNextMonth(mostRecentDate);
}

function getFirstDayOfNextMonth(date: Date): Date {
  const nextMonth = new Date(date);
  nextMonth.setMonth(date.getMonth() + 1);
  nextMonth.setDate(1);
  return nextMonth;
}

export function calculateDaysBetweenDates(
  timestamp1: number,
  timestamp2: number,
): number {
  if (timestamp1 === 0 || timestamp2 === 0) return 0;

  // Calcul du nombre de millisecondes dans une journée
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  // Calcul du nombre de jours entre les deux dates
  const daysDifference = Math.abs(
    (timestamp2 - timestamp1) / millisecondsPerDay,
  );

  return Math.floor(daysDifference) + 1;
}

function getFirstDayOfMonth(date: Date): Date {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return new Date(getTimestampUTC(firstDay));
}

export function getLastDayOfMonth(date: Date): Date {
  const year = date.getFullYear();
  const month = date.getMonth(); // Les mois sont indexés à partir de zéro

  // Utilisation du dernier jour du mois pour obtenir le timestamp à 23h59
  const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999); // Le jour 0 du mois suivant donne le dernier jour du mois actuel
  //const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return new Date(getTimestampUTC(lastDayOfMonth));
}
