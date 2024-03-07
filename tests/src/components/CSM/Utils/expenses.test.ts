import {
  calculateExpenses,
  getLastDayOfMonth,
  calculateDaysBetweenDates,
} from 'src/components/CSM/Utils/expenses';
import BigNumber from 'bignumber.js';

describe('calculateExpenses', () => {
  test('calcul des dépenses sur 1 mois', () => {
    const expenses = [
      {
        dateTime: new Date('2023-12-31').getTime(),
        csm: 0.04055,
        operator: 0.042,
        electricity: 1.049,
        siteId: '3',
      },
      {
        dateTime: new Date('2023-11-30').getTime(),
        csm: 0.0360415,
        operator: 0.0360415,
        electricity: 0.7299749,
        siteId: '3',
      },
    ];

    const startDateTime = new Date('2023-12-01').getTime();
    const endDateTime = new Date('2023-12-31').getTime();

    const result = calculateExpenses(expenses, startDateTime, endDateTime);

    expect(result.total.toNumber()).toEqual(
      Number(
        new BigNumber(
          expenses[0].csm + expenses[0].operator + expenses[0].electricity,
        )
          .toNumber()
          .toFixed(5),
      ),
    );
    expect(result.csm.toNumber()).toEqual(
      new BigNumber(expenses[0].csm).toNumber(),
    );
    expect(result.operator.toNumber()).toEqual(
      new BigNumber(expenses[0].operator).toNumber(),
    );
    expect(result.electricity.toNumber()).toEqual(
      new BigNumber(expenses[0].electricity).toNumber(),
    );
  });

  test('calcul des dépenses sur un sous ensemble d un mois', () => {
    const expenses = [
      {
        dateTime: new Date('2023-12-31').getTime(),
        csm: 0.04055,
        operator: 0.042,
        electricity: 1.049,
        siteId: '3',
      },
      {
        dateTime: new Date('2023-11-30').getTime(),
        csm: 0.0360415,
        operator: 0.0360415,
        electricity: 0.7299749,
        siteId: '3',
      },
    ];

    const startDateTime = new Date('2023-11-11').getTime();
    const endDateTime = new Date('2023-11-13').getTime();

    const result = calculateExpenses(expenses, startDateTime, endDateTime);

    expect(result.total.toNumber()).toEqual(
      new BigNumber(
        expenses[1].csm + expenses[1].operator + expenses[1].electricity,
      )
        .dividedBy(10)
        .toNumber(),
    );
    expect(result.csm.toNumber()).toEqual(
      new BigNumber(expenses[1].csm).dividedBy(10).toNumber(),
    );
    expect(result.operator.toNumber()).toEqual(
      new BigNumber(expenses[1].operator).dividedBy(10).toNumber(),
    );
    expect(result.electricity.toNumber()).toEqual(
      new BigNumber(expenses[1].electricity).dividedBy(10).toNumber(),
    );
  });

  test('calcul des dépenses sur un sous ensemble sur 2 mois', () => {
    const expenses = [
      {
        dateTime: new Date('2023-12-31').getTime(),
        csm: 0.04055,
        operator: 0.042,
        electricity: 1.049,
        siteId: '3',
      },
      {
        dateTime: new Date('2023-11-30').getTime(),
        csm: 0.0360415,
        operator: 0.0360415,
        electricity: 0.7299749,
        siteId: '3',
      },
    ];

    const startDateTime = new Date('2023-11-28').getTime();
    const endDateTime = new Date('2023-12-3').getTime();

    const result = calculateExpenses(expenses, startDateTime, endDateTime);

    const totalNovember = new BigNumber(
      expenses[1].csm + expenses[1].operator + expenses[1].electricity,
    ).dividedBy(10);

    const totalDecember = new BigNumber(
      expenses[0].csm + expenses[0].operator + expenses[0].electricity,
    )
      .times(3)
      .dividedBy(31);

    expect(Number(result.total.toNumber().toFixed(15))).toEqual(
      Number(totalNovember.plus(totalDecember).toNumber().toFixed(15)),
    );
    expect(result.csm.toNumber()).toEqual(
      new BigNumber(expenses[1].csm)
        .dividedBy(10)
        .plus(new BigNumber(expenses[0].csm).times(3 / 31))
        .toNumber(),
    );
    expect(result.operator.toNumber()).toEqual(
      new BigNumber(expenses[1].operator)
        .dividedBy(10)
        .plus(new BigNumber(expenses[0].operator).times(3 / 31))
        .toNumber(),
    );
    expect(result.electricity.toNumber()).toEqual(
      new BigNumber(expenses[1].electricity)
        .dividedBy(10)
        .plus(new BigNumber(expenses[0].electricity).times(3 / 31))
        .toNumber(),
    );
  });

  test('calcul des dépenses sur plus de 2 mois dont 2 mois de facturation', () => {
    const expenses = [
      {
        dateTime: new Date('2023-12-31').getTime(),
        csm: 0.04055,
        operator: 0.042,
        electricity: 1.049,
        siteId: '3',
      },
      {
        dateTime: new Date('2023-11-30').getTime(),
        csm: 0.0360415,
        operator: 0.0360415,
        electricity: 0.7299749,
        siteId: '3',
      },
    ];

    const startDateTime = new Date('2023-10-01').getTime();
    const endDateTime = new Date('2024-01-31').getTime();

    const result = calculateExpenses(expenses, startDateTime, endDateTime);

    const totalNovember = new BigNumber(
      expenses[1].csm + expenses[1].operator + expenses[1].electricity,
    );

    const totalDecember = new BigNumber(
      expenses[0].csm + expenses[0].operator + expenses[0].electricity,
    );

    expect(Number(result.total.toNumber().toFixed(15))).toEqual(
      Number(totalNovember.plus(totalDecember).toNumber().toFixed(15)),
    );
    expect(result.csm.toNumber()).toEqual(
      new BigNumber(expenses[1].csm)
        .plus(new BigNumber(expenses[0].csm))
        .toNumber(),
    );
    expect(result.operator.toNumber()).toEqual(
      new BigNumber(expenses[1].operator)
        .plus(new BigNumber(expenses[0].operator))
        .toNumber(),
    );
    expect(result.electricity.toNumber()).toEqual(
      new BigNumber(expenses[1].electricity)
        .plus(new BigNumber(expenses[0].electricity))
        .toNumber(),
    );
  });
});

describe('getLastDayOfMonth', () => {
  test('récupération du dernier jour du mois', () => {
    const date = new Date('2024-02-15');
    const lastDay = getLastDayOfMonth(date);

    expect(lastDay.getDate()).toEqual(29); // Février 2024 a 29 jours
  });
});

describe('calculateDaysBetweenDates', () => {
  test('calcul du nombre de jours entre deux dates', () => {
    const timestamp1 = new Date('2024-02-01').getTime();
    const timestamp2 = new Date('2024-02-15').getTime();

    const result = calculateDaysBetweenDates(timestamp1, timestamp2);

    expect(result).toEqual(14);
  });
});
