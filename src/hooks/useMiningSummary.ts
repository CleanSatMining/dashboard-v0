import { useEffect, useState } from 'react';

import { useAppDispatch } from 'src/hooks/react-hooks';
import { siteAddedDispatchType } from 'src/store/features/miningData/miningDataSlice';

import { API_MINING_STATE } from '../constants/apis';
import { SITES, SiteID } from '../constants/csm';
import { MiningSummaryPerDay, SiteMiningSummary } from '../types/mining/Mining';
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

            try {
              for (const siteId of siteIds) {
                const site = SITES[siteId as SiteID];

                if (site.status !== MiningStatus.inactive) {
                  try {
                    const parameter = lastMonth ? Math.max(60, days) : days;
                    const body: APIMiningHistoryQuery = {
                      siteId: siteId,
                      first: parameter,
                    };

                    const result = await fetch(API_MINING_STATE.url, {
                      method: API_MINING_STATE.method,
                      body: JSON.stringify(body),
                    });

                    if (result.ok) {
                      const miningHistory: APIMiningHistoryResponse =
                        await result.json();

                      // if (siteId === '2' || siteId === '4')
                      //   console.log(
                      //     'RESULT API',
                      //     siteId,
                      //     JSON.stringify(miningHistory, null, 4),
                      //   );

                      const history = miningHistory.days.filter((d) => {
                        //filter old date
                        const historyDay = new Date(d.date).getTime();
                        const nowDay = new Date().getTime();
                        const diffDays = nowDay - historyDay;
                        return (
                          diffDays >= days ||
                          (lastMonth && diffDays >= Math.max(60, days))
                        );
                      });
                      setDaysUp(history.length);

                      miningDaysHistory[siteId] = history;
                      const data: SiteMiningSummary = {
                        id: siteId,
                        mining: { days: history },
                        token: { byUser: {} },
                      };
                      dispatch({ type: siteAddedDispatchType, payload: data });
                      // console.log(
                      //   'FETCH HISTORY',
                      //   siteId,
                      //   JSON.stringify(miningHistory.days, null, 4)
                      // );
                    } else {
                      reject('Failed to fetch mining state from API');
                    }
                  } catch (err) {
                    console.log('Failed to fetch mining state from API: ', err);
                    reject(err);
                  }
                  //}

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

            setIsLoaded(true);
            resolve(miningStates);
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
  }, [miningStates, days, siteIds]);
  /* eslint-enable */
  return {
    states: miningStates,
    daysUp: daysUp,
    isLoaded: isLoaded,
  };
};
