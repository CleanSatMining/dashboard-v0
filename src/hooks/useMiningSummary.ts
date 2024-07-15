import { useEffect, useState } from 'react';

import { useAppDispatch } from 'src/hooks/react-hooks';
import { siteAddedDispatchType } from 'src/store/features/miningData/miningDataSlice';

import { API_MINING_HISTORY } from '../constants/apis';
import { SITES } from '../constants/csm';
import { SiteID } from 'src/types/mining/Site';
import {
  MiningSummaryPerDay,
  SiteMiningHistory,
  filterOldDates,
  mapHistoryMiningToSiteHistoryMining,
} from '../types/mining/Mining';
import {
  APIMiningHistoryQuery,
  APIMiningHistoryResponse,
} from '../types/mining/MiningAPI';
import { MiningStatus } from '../types/mining/Site';

//----------------------------------------------------------------------

export type MiningSiteSummary = {
  siteId: string;
  days: MiningSummaryPerDay[];
};

interface UseMiningSitesSummary {
  states: { [siteId: string]: MiningSiteSummary };
  daysUp: number;
  isLoaded: boolean;
}

type UseMiningSitesSummaryProps = (
  siteIds: string[],
  days: number,
  lastMonth?: boolean,
) => UseMiningSitesSummary;

export const useMiningSitesSummary: UseMiningSitesSummaryProps = (
  siteIds,
  days,
  lastMonth = false,
) => {
  const dispatch = useAppDispatch();
  const [miningStates, setMiningStates] = useState<{
    [siteId: string]: MiningSiteSummary;
  }>({});
  const [daysUp, setDaysUp] = useState<number>(days);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const getSiteMiningStates = async (): Promise<{
        [siteId: string]: MiningSiteSummary;
      }> => {
        setIsLoaded(false);

        return new Promise<{ [siteId: string]: MiningSiteSummary }>(
          async (resolve, reject) => {
            const miningDaysHistory: {
              [siteId: string]: MiningSummaryPerDay[];
            } = {};

            const apiCalls: Promise<void>[] = [];

            try {
              for (const siteId of siteIds) {
                const site = SITES[siteId as SiteID];

                if (site.status !== MiningStatus.inactive) {
                  const apiCall = async () => {
                    const parameter = lastMonth ? Math.max(60, days) : days;
                    const body: APIMiningHistoryQuery = {
                      siteId: siteId,
                      first: parameter,
                    };
                    try {
                      const result = await fetch(
                        API_MINING_HISTORY.url(siteId),
                        {
                          method: API_MINING_HISTORY.method,
                          body: JSON.stringify(body),
                        },
                      );
                      if (result.ok) {
                        await dispatchResult(result, siteId);
                      } else {
                        reject('Failed to fetch mining history from API');
                      }
                    } catch (erreur) {
                      console.error(
                        "Erreur lors de l'appel de l'API 2",
                        erreur,
                      );
                    }
                  };

                  apiCalls.push(apiCall());

                  miningStates[siteId] = {
                    siteId: siteId,
                    days: miningDaysHistory[siteId],
                  };
                }
              } // for sites ids
            } catch (e) {
              console.warn(
                'Error while fetching mining summary: ' + JSON.stringify(e),
              );
            }

            await Promise.all(apiCalls)
              .then(() => {
                console.log('Appels API mining history terminés avec succès');
              })
              .catch((erreur) => {
                console.error(
                  'Erreur lors des appels API mining history en parallèle',
                  erreur,
                );
              });

            setIsLoaded(true);
            resolve(miningStates);

            async function dispatchResult(result: Response, siteId: string) {
              const miningHistory: APIMiningHistoryResponse =
                await result.json();

              // if (siteId === '2' || siteId === '4')
              //   console.log(
              //     'RESULT API',
              //     siteId,
              //     JSON.stringify(miningHistory, null, 4),
              //   );
              const history = miningHistory.days.filter(filterOldDates(days));

              const data: SiteMiningHistory =
                mapHistoryMiningToSiteHistoryMining(siteId, history);

              miningDaysHistory[siteId] = history;
              setDaysUp(history.length);
              dispatch({ type: siteAddedDispatchType, payload: data });
            }
          },
        );
      };

      try {
        const data = await getSiteMiningStates();
        setMiningStates(data);
      } catch (e) {
        console.warn('Error getSiteMiningStates' + JSON.stringify(e));
      }
    })();

    return () => {
      // this now gets called when the component unmounts
    };
    /* eslint-disable */
  }, [days]);
  /* eslint-enable */
  return {
    states: miningStates,
    daysUp: daysUp,
    isLoaded: isLoaded,
  };
};
