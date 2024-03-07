import { getUptimeBySite } from 'src/components/CSM/Utils/yield-test';
import { MiningHistory } from 'src/types/mining/Mining';

const history: MiningHistory = {
  byId: {
    '1': {
      id: '1',
      mining: {
        days: [
          {
            date: '2024-03-06 00:00:00',
            efficiency: 88.49854323237037,
            hashrate: parseFloat('53577018072877022.63'),
            revenue: 0.09038487,
            uptimePercentage: 88.49854323237037,
            uptimeTotalMinutes: 1274.3790225461335,
            uptimeTotalMachines: 501.78674012754,
          },
          {
            date: '2024-03-05 00:00:00',
            efficiency: 82.56732987238715,
            hashrate: parseFloat('49986261504743178.24'),
            revenue: 0.086064,
            uptimePercentage: 82.56732987238715,
            uptimeTotalMinutes: 1188.9695501623748,
            uptimeTotalMachines: 468.1567603764351,
          },
          {
            date: '2024-03-04 00:00:00',
            efficiency: 97.7978356112958,
            hashrate: parseFloat('36674188354235924.48'),
            revenue: 0.06337098,
            uptimePercentage: 97.7978356112958,
            uptimeTotalMinutes: 1408.2888328026595,
            uptimeTotalMachines: 366.74188354235923,
          },
          {
            date: '2024-03-03 00:00:00',
            efficiency: 76.98741323940787,
            hashrate: parseFloat('28870279964777949.87'),
            revenue: 0.04735447,
            uptimePercentage: 76.98741323940787,
            uptimeTotalMinutes: 1108.6187506474732,
            uptimeTotalMachines: 288.7027996477795,
          },
          {
            date: '2024-03-02 00:00:00',
            efficiency: 72.23615038252912,
            hashrate: parseFloat('27088556393448419.18'),
            revenue: 0.04469023,
            uptimePercentage: 72.23615038252912,
            uptimeTotalMinutes: 1040.2005655084192,
            uptimeTotalMachines: 270.8855639344842,
          },
          {
            date: '2024-03-01 00:00:00',
            efficiency: 78.25283004095681,
            hashrate: parseFloat('29344811265358804.01'),
            revenue: 0.04868222,
            uptimePercentage: 78.25283004095681,
            uptimeTotalMinutes: 1126.840752589778,
            uptimeTotalMachines: 293.44811265358805,
          },
          {
            date: '2024-02-29 00:00:00',
            efficiency: 81.72797526904701,
            hashrate: parseFloat('30647990725892626.96'),
            revenue: 0.05080399,
            uptimePercentage: 81.72797526904701,
            uptimeTotalMinutes: 1176.882843874277,
            uptimeTotalMachines: 306.4799072589263,
          },
        ],
      },
      token: {
        byUser: {
          '1': {
            token: {
              balance: 100,
            },
          },
        },
      },
    },
  },
};

describe('getUptimeBySite', () => {
  test('calcul de la puissance avant 2e levée', () => {
    const start = new Date('2024-02-29 00:00:00').getTime();
    const end = new Date('2024-03-07 00:00:00').getTime();

    const result = getUptimeBySite(history, '1', 7, start, end);

    expect(result).toEqual(1162500);
  });
});
