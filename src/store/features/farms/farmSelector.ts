import { RootState } from 'src/store/store';

import { Farm } from 'src/types/api/farm';

export const selectFarmsIsLoading = (state: RootState) => state.farms.isLoading;
export const selectFarms = (state: RootState) => state.farms.farms;

export const selectFarm = (state: RootState, slug: string) => {
  const farms: Farm[] = selectFarms(state);
  return farms.findLast((farm: Farm) => farm.slug == slug);
};

export const selectFarmMiningIsLoading = (state: RootState, slug: string) => {
  const farmData = state.farms.miningData[slug];

  if (!farmData) {
    console.log('no data for', slug);
    return false;
  }

  return farmData.isLoading;
};

export const selectFarmMiningData = (
  state: RootState,
  slug: string,
  start: Date,
  end: Date,
) => {
  const endIso = new Date(end).toISOString().split('T')[0];
  const startIso = new Date(start).toISOString().split('T')[0];

  const farmData = state.farms.miningData[slug];

  if (!farmData) {
    console.log('no data for', slug);
    return undefined;
  }
  if (!farmData.data[startIso + ' - ' + endIso]) {
    console.log('No data for', slug, startIso + ' - ' + endIso);
  }

  return farmData.data[startIso + ' - ' + endIso];
};
