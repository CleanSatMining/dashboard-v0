import {
  getPower,
  getNumberOfMachines,
  getEquipementPeriods,
  getEquipementCost,
  calculateDaysBetweenDates,
} from 'src/components/CSM/Utils/period';

import { Site } from 'src/types/mining/Site';
import { SITES, SiteID } from 'src/constants/csm';

describe('getPower', () => {
  test('calcul de la puissance avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2023-12-01');

    const result = getPower(site, randomDate);

    expect(result).toEqual(1162500);
  });

  test('calcul de la puissance apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2024-03-05');

    const result = getPower(site, randomDate);

    expect(result).toEqual(1796100);
  });
});

describe('getNumberOfMachines', () => {
  test('calcul du nombre de machines avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2023-12-01');

    const result = getNumberOfMachines(site, randomDate);

    expect(result).toEqual(375);
  });

  test('calcul de la puissance apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2024-03-05');

    const result = getNumberOfMachines(site, randomDate);

    expect(result).toEqual(567);
  });
});

describe('getEquipementPeriods', () => {
  test('calcul des periods avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2023-12-01').getTime();
    const end = new Date('2023-12-31').getTime();

    const result = getEquipementPeriods(site, start, end);

    expect(result.length).toEqual(1);
    expect(result[0].period).toEqual(31);
    expect(result[0].equipementCost).toEqual(1238414);
    expect(result[0].startDate).toEqual(start);
    expect(result[0].endDate).toEqual(end);
  });

  test('calcul des periods après 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2024-03-04').getTime();

    const end = new Date('2024-03-06').getTime();

    const result = getEquipementPeriods(site, start, end);

    expect(result.length).toEqual(1);
    expect(result[0].period).toEqual(3);
    expect(result[0].equipementCost).toEqual(1824494);
    expect(result[0].startDate).toEqual(start);
    expect(result[0].endDate).toEqual(end);
  });

  test('calcul des periods a cheval sur 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2024-03-01').getTime();
    const fundRaiseDate = new Date('2024-03-04').getTime();
    const end = new Date('2024-03-06').getTime();

    const result = getEquipementPeriods(site, start, end);

    expect(result.length).toEqual(2);
    expect(result[0].period).toEqual(3);
    expect(result[0].equipementCost).toEqual(1238414);
    expect(result[0].startDate).toEqual(start);
    expect(result[0].endDate).toEqual(1709510399999);
    expect(result[1].period).toEqual(3);
    expect(result[1].equipementCost).toEqual(1824494);
    expect(result[1].startDate).toEqual(fundRaiseDate);
    expect(result[1].endDate).toEqual(end);
  });
});

describe('getEquipementCost', () => {
  test('calcul de l equipement avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2023-12-01').getTime();
    const end = new Date('2023-12-31').getTime();

    const result = getEquipementCost(site, start, end);

    expect(result.toNumber()).toEqual(1238414);
  });

  test('calcul l equipement après 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2024-03-04').getTime();
    const end = new Date('2024-03-06').getTime();

    const result = getEquipementCost(site, start, end);

    expect(result.toNumber()).toEqual(1824494);
  });

  test('calcul l equipement a cheval sur 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const start = new Date('2024-03-01').getTime();
    const end = new Date('2024-03-06').getTime();

    const result = getEquipementCost(site, start, end);

    expect(result.toNumber()).toEqual(1531454);
  });
});

describe('calculateDaysBetweenDates', () => {
  test('calcul du nombre de jours entre deux dates', () => {
    const timestamp1 = new Date('2024-02-01').getTime();
    const timestamp2 = new Date('2024-02-15').getTime();

    const result = calculateDaysBetweenDates(timestamp1, timestamp2);

    expect(result).toEqual(15);
  });
});
