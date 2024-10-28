import { RootState } from 'src/store/store';

import { Farm } from 'src/types/api/farm';

export const selectFarmsIsLoading = (state: RootState) => state.farms.isLoading;
export const selectFarms = (state: RootState) => state.farms.farms;

export const selectFarm = (state: RootState, slug: string) => {
  const farms: Farm[] = selectFarms(state);
  return farms.findLast((farm: Farm) => farm.slug == slug);
};
