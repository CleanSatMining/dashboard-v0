import { useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';

import { calculateElececticityCostPerDay } from '../components/CSM/Utils/yield';
import { SITES, SiteID } from '../constants/csm';
import {
  APIMiningHistoryQuery,
  APIMiningHistoryResponse,
} from '../types/Mining';
import { Site } from '../types/Site';

export interface SiteMiningState {
  days: number;
  uptimePercentage: number;
  revenue: number;
  activeDays: number;
  uptimeTotalDays: number;
  uptimeTotalMachines: number;
  electricityCost: number;
}

interface UseSiteMiningState {
  state: SiteMiningState | undefined;
}

export const useSiteMiningState = (
  username: string,
  siteId: string,
  days: number
): UseSiteMiningState => {
  const [miningState, setMiningState] = useState<SiteMiningState | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const getMiningState = async (): Promise<SiteMiningState> => {
        return new Promise<SiteMiningState>(async (resolve, reject) => {
          console.log('https://api.beta.luxor.tech/graphql', username);
          {
            try {
              const body: APIMiningHistoryQuery = {
                username: username,
                first: days,
              };

              const result = await fetch('/api/mining/history', {
                method: 'POST',
                body: JSON.stringify(body),
              });

              if (result.ok) {
                const miningHistory: APIMiningHistoryResponse =
                  await result.json();
                console.log(JSON.stringify(miningHistory, null, 4));
                const {
                  revenue,
                  activeDays,
                  uptimePercentage,
                  uptimeTotalDays,
                  uptimeTotalMachines,
                  electricityCost,
                } = calculateRevenue(miningHistory, siteId);
                const miningState: SiteMiningState = {
                  days,
                  revenue,
                  uptimePercentage,
                  activeDays,
                  uptimeTotalDays,
                  uptimeTotalMachines,
                  electricityCost,
                };

                resolve(miningState);
              } else {
                reject('Failed to fetch mining summary from luxor');
              }
            } catch (err) {
              console.log('Failed to fetch mining summary from luxor: ', err);
              reject(err);
            }
          }
        });
      };
      const data = await getMiningState();
      setMiningState(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [username, days, siteId]);

  return {
    state: miningState,
  };
};

interface UseSiteMiningStates {
  states: SiteMiningState[] | undefined;
}

export const useSiteMiningStates = (
  username: string,
  siteId: string,
  periods: number[]
): UseSiteMiningStates => {
  const [siteMiningStates, setSiteMiningStates] = useState<
    SiteMiningState[] | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const getSiteMiningStates = async (): Promise<SiteMiningState[]> => {
        return new Promise<SiteMiningState[]>(async (resolve, reject) => {
          console.log('https://api.beta.luxor.tech/graphql', username);
          const miningStates: SiteMiningState[] = [];
          if (username !== '') {
            for (const days of periods) {
              try {
                const body: APIMiningHistoryQuery = {
                  username: username,
                  first: days,
                };

                const result = await fetch('/api/mining/history', {
                  method: 'POST',
                  body: JSON.stringify(body),
                });

                if (result.ok) {
                  const miningHistory: APIMiningHistoryResponse =
                    await result.json();
                  console.log(JSON.stringify(miningHistory, null, 4));
                  const {
                    revenue,
                    activeDays,
                    uptimePercentage,
                    uptimeTotalDays,
                    uptimeTotalMachines,
                    electricityCost,
                  } = calculateRevenue(miningHistory, siteId);
                  const miningSate: SiteMiningState = {
                    days,
                    revenue,
                    uptimePercentage,
                    activeDays,
                    uptimeTotalDays,
                    uptimeTotalMachines,
                    electricityCost,
                  };
                  miningStates.push(miningSate);
                } else {
                  reject('Failed to fetch mining state from luxor');
                }
              } catch (err) {
                console.log('Failed to fetch mining state from luxor: ', err);
                reject(err);
              }
            }
          }

          resolve(miningStates);
        });
      };
      const data = await getSiteMiningStates();
      setSiteMiningStates(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [username, periods, siteId]);

  return {
    states: siteMiningStates,
  };
};

export type SiteUser = {
  siteId: string;
  username: string;
};

type MiningStates = {
  siteId: string;
  states: { [byPeriod: number]: SiteMiningState };
};

interface UseMiningStates {
  states: { [siteId: string]: MiningStates };
}

export const useMiningStates = (
  users: SiteUser[],
  periods: number[]
): UseMiningStates => {
  const [miningStates, setMiningStates] = useState<{
    [siteId: string]: MiningStates;
  }>({});

  useEffect(() => {
    (async () => {
      const getMiningStates = async (): Promise<{
        [siteId: string]: MiningStates;
      }> => {
        return new Promise<{ [siteId: string]: MiningStates }>(
          async (resolve, reject) => {
            console.log(
              'https://api.beta.luxor.tech/graphql',
              JSON.stringify(users, null, 4)
            );

            const miningStates: { [siteId: string]: MiningStates } = {};

            for (const user of users) {
              const username = user.username;
              const siteMiningStates: { [byPeriod: number]: SiteMiningState } =
                {};
              if (username !== '') {
                for (const days of periods) {
                  try {
                    const body: APIMiningHistoryQuery = {
                      username: username,
                      first: days,
                    };

                    const result = await fetch('/api/mining/history', {
                      method: 'POST',
                      body: JSON.stringify(body),
                    });

                    if (result.ok) {
                      const miningHistory: APIMiningHistoryResponse =
                        await result.json();
                      console.log(
                        'miningHistory',
                        JSON.stringify(miningHistory, null, 4)
                      );
                      const {
                        revenue,
                        activeDays,
                        uptimePercentage,
                        uptimeTotalDays,
                        uptimeTotalMachines,
                        electricityCost,
                      } = calculateRevenue(miningHistory, user.siteId);
                      siteMiningStates[days] = {
                        days,
                        revenue,
                        uptimePercentage,
                        activeDays,
                        uptimeTotalDays,
                        uptimeTotalMachines,
                        electricityCost,
                      };
                    } else {
                      reject('Failed to fetch mining state from luxor');
                    }
                  } catch (err) {
                    console.log(
                      'Failed to fetch mining state from luxor: ',
                      err
                    );
                    reject(err);
                  }
                }
              }
              miningStates[user.siteId] = {
                siteId: user.siteId,
                states: siteMiningStates,
              };
            }

            resolve(miningStates);
          }
        );
      };
      const data = await getMiningStates();
      setMiningStates(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return {
    states: miningStates,
  };
};

function calculateRevenue(
  miningHistory: APIMiningHistoryResponse,
  siteId: string
) {
  const site: Site = SITES[siteId as SiteID];
  let revenue = new BigNumber(0);
  let activeDays = 0;
  let uptimePercentage = new BigNumber(0);
  let uptimeTotalMachines = new BigNumber(0);
  let electricityCost = new BigNumber(0);
  const uptimeTotalDays = miningHistory.days
    .map((day) => {
      return new BigNumber(day.uptimeTotalMinutes / 60 / 24);
    })
    .reduce((acc, val) => acc.plus(val), new BigNumber(0));

  for (const day of miningHistory.days) {
    revenue = revenue.plus(new BigNumber(day.revenue));
    activeDays++;
    uptimePercentage = uptimePercentage.plus(
      new BigNumber(day.uptimePercentage)
    );
    uptimeTotalMachines = uptimeTotalMachines.plus(
      new BigNumber(day.uptimeTotalMinutes / 60 / 24)
        .dividedBy(uptimeTotalDays)
        .times(new BigNumber(day.uptimeTotalMachines))
    );
    const cost: number = calculateElececticityCostPerDay(
      site,
      day.uptimeTotalMachines,
      day.uptimePercentage / 100
    );
    electricityCost = electricityCost.plus(new BigNumber(cost));
  }
  return {
    revenue: revenue.toNumber(),
    activeDays: activeDays,
    electricityCost: electricityCost.toNumber(),
    uptimePercentage: uptimePercentage.toNumber() / activeDays,
    uptimeTotalDays: uptimeTotalDays.toNumber(),
    uptimeTotalMachines: uptimeTotalMachines.toNumber(),
  };
}