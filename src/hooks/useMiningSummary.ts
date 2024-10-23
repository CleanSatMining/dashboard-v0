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

  /* eslint-enable */
  return {
    states: miningStates,
    daysUp: daysUp,
    isLoaded: isLoaded,
  };
};
