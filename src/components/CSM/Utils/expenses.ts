import { Expense } from 'src/types/mining/Mining';
import BigNumber from 'bignumber.js';
import { calculateDaysBetweenDates } from './period';

export function calculateExpenses(
  expenses: Expense[],
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
  // Filtrer les dépenses qui sont dans la plage de dates spécifiée
  const filteredExpenses = expenses.filter((expense) => {
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
    startDateTime,
    endDateTime,
  );

  return totalExpenses;
}

function calculateExpensesInRange(
  expenses: Expense[],
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

      const daysInMonth = new Date(lastDayOfBilling).getDate();
      let daysRemaining = daysInMonth;

      // Calculer le prorata pour la date de début
      if (firstDayOfBilling < startDateTime) {
        daysRemaining = daysRemaining - new Date(startDateTime).getDate() + 1;
      }

      // Calculer le prorata pour la date de fin
      if (lastDayOfBilling > endDateTime) {
        daysRemaining =
          daysRemaining - (daysInMonth - new Date(endDateTime).getDate());
      }

      if (daysRemaining < daysInMonth) {
        //compute prorated amount
        proratedAmount = proratedAmount
          .times(daysRemaining)
          .dividedBy(daysInMonth);
        proratedCsmAmount = proratedCsmAmount
          .times(daysRemaining)
          .dividedBy(daysInMonth);
        proratedOperatorAmount = proratedOperatorAmount
          .times(daysRemaining)
          .dividedBy(daysInMonth);
        proratedElectricityAmount = proratedElectricityAmount
          .times(daysRemaining)
          .dividedBy(daysInMonth);
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

export function getFirstDayOfNextMonth(date: Date): Date {
  const nextMonth = new Date(date);
  nextMonth.setUTCMonth(date.getUTCMonth() + 1);
  nextMonth.setUTCDate(1);
  return nextMonth;
}

export function getFirstDayOfMonth(date: Date): Date {
  const firstDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1),
  );
  return firstDay;
}

export function getLastDayOfMonth(date: Date): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // Les mois sont indexés à partir de zéro

  // Utilisation du dernier jour du mois pour obtenir le timestamp à 23h59
  const lastDayOfMonth = new Date(
    Date.UTC(year, month + 1, 0, 23, 59, 59, 999),
  ); // Le jour 0 du mois suivant donne le dernier jour du mois actuel
  return lastDayOfMonth;
}
