import {
  getPower,
  getNumberOfMachines,
  getAverageHashrate,
  getAverageMachines,
  getEquipementDepreciation,
  getProgressSteps,
} from 'src/components/CSM/Utils/period';

import { Site } from 'src/types/mining/Site';
import { SITES } from 'src/constants/csm';
import { SiteID } from 'src/types/mining/Site';

describe('getPower', () => {
  test('calcul de la puissance avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2023-12-01');

    const result = getPower(site, randomDate);

    expect(result.toNumber()).toEqual(1162500);
  });

  test('calcul de la puissance apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const randomDate = new Date('2024-03-05');

    const result = getPower(site, randomDate);

    expect(result.toNumber()).toEqual(1796100);
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

describe('getAverageHashrate', () => {
  test('calcul du hashrate moyen avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2023-12-01T00:00:00.000+00:00').getTime();
    const endDate = new Date('2023-12-02T00:00:00.000+00:00').getTime();

    const result = getAverageHashrate(site, startDate, endDate);

    expect(result.toFixed(0)).toEqual('37500000000000000');
  });

  test('calcul du hashrate moyen apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-09T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-10T00:00:00.000+00:00').getTime();

    const result = getAverageHashrate(site, startDate, endDate);

    expect(result.toFixed(0)).toEqual('60540000000000000');
  });

  test('calcul du hashrate moyen entre 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-03T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-04T23:59:59.999+00:00').getTime();

    const result = getAverageHashrate(site, startDate, endDate);

    expect(result.toFixed(0)).toEqual('49020000000000000');
  });
});

describe('getAverageMachines', () => {
  test('calcul du nombre de machines moyen avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2023-12-01T00:00:00.000+00:00').getTime();
    const endDate = new Date('2023-12-02T00:00:00.000+00:00').getTime();

    const result = getAverageMachines(site, startDate, endDate);

    expect(result).toEqual(375);
  });

  test('calcul du nombre de machines moyen apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-09T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-10T00:00:00.000+00:00').getTime();

    const result = getAverageMachines(site, startDate, endDate);

    expect(result).toEqual(375 + 192);
  });

  test('calcul du nombre de machines moyen entre 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-03T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-04T23:59:59.999+00:00').getTime();

    const result = getAverageMachines(site, startDate, endDate);

    const expectResult = (375 + (375 + 192)) / 2;

    expect(result).toEqual(expectResult);
  });
});

describe('getEquipementDepreciation', () => {
  test('calcul de l ammortissement des machines avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2023-12-01T00:00:00.000+00:00').getTime();
    const endDate = new Date('2023-12-02T00:00:00.000+00:00').getTime();

    const result = getEquipementDepreciation(site, startDate, endDate);

    expect(result.toFixed(2)).toEqual('678.58');
  });

  test('calcul de l ammortissement des machines apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-09T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-10T00:00:00.000+00:00').getTime();

    const result = getEquipementDepreciation(site, startDate, endDate);

    expect(result.toFixed(2)).toEqual('999.72');
  });

  test('calcul de l ammortissement des machines entre 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-03T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-04T23:59:59.999+00:00').getTime();

    const result = getEquipementDepreciation(site, startDate, endDate);

    expect(result.toFixed(2)).toEqual('1678.31');
  });
});

describe('getProgressSteps', () => {
  test('calcul des étapes d installation avant 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2023-12-01T00:00:00.000+00:00').getTime();
    const endDate = new Date('2023-12-02T00:00:00.000+00:00').getTime();

    const result = getProgressSteps(site, startDate, endDate);

    expect(result.length).toEqual(1);
  });

  test('calcul des étapes d installation apres 2e levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-09T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-10T00:00:00.000+00:00').getTime();

    const result = getProgressSteps(site, startDate, endDate);

    expect(result.length).toEqual(1);
  });

  test('calcul des étapes d installation entre 2 levée', () => {
    const site: Site = SITES[SiteID.alpha];

    const startDate = new Date('2024-03-03T00:00:00.000+00:00').getTime();
    const endDate = new Date('2024-03-04T23:59:59.999+00:00').getTime();

    const result = getProgressSteps(site, startDate, endDate);

    expect(result.length).toEqual(2);
  });
});
