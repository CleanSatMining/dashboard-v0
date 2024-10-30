import { createAction, createReducer } from '@reduxjs/toolkit';
import { API_FARM, API_FARMS } from 'src/constants/apis';

import { AppDispatch, RootState } from 'src/store/store';

import { Farm, FarmSummary } from 'src/types/api/farm';

interface FarmsInitialStateType {
  isLoading: boolean;
  farms: Farm[];
}

const FarmsInitialState: FarmsInitialStateType = {
  isLoading: true,
  farms: [],
};

//DISPATCH TYPE
export const farmAddDispatchType = 'farms/farmAdd';
export const farmIsLoadingDispatchType = 'farms/farmIsLoading';
export const farmsResetDispatchType = 'farms/farmsReset';
export const farmsLoadAllDispatchType = 'farms/farmsLoadAll';

//ACTIONS
export const farmsLoadAll = createAction<Farm[]>(farmsLoadAllDispatchType);
export const farmAdded = createAction<Farm>(farmAddDispatchType);
export const farmIsloading = createAction<boolean>(farmIsLoadingDispatchType);
export const farmsReset = createAction<undefined>(farmsResetDispatchType);

// THUNKS
export function fetchFarm(slug: string) {
  // TODO: look for type
  return async function fetchFarmThunk(
    dispatch: AppDispatch,
    getState: () => RootState,
  ) {
    dispatch({ type: farmsResetDispatchType });
    dispatch({ type: farmIsLoadingDispatchType, payload: true });

    const url = API_FARM.url(slug);
    const response = await fetch(url); // Remplacez par votre URL d'API
    const farmData: Farm = await response.json();

    dispatch({ type: farmAddDispatchType, payload: farmData });
    dispatch({ type: farmIsLoadingDispatchType, payload: false });

    return farmData;
  };
}

export function fetchFarms() {
  // TODO: look for type
  return async function fetchFarmThunk(
    dispatch: AppDispatch,
    getState: () => RootState,
  ) {
    dispatch({ type: farmsResetDispatchType });
    dispatch({ type: farmIsLoadingDispatchType, payload: true });

    const urlFarms = API_FARMS.url();
    const responseFarms = await fetch(urlFarms);
    const farmsData: FarmSummary[] = await responseFarms.json();
    const farms: Farm[] = [];

    for (const farm of farmsData) {
      const slug = farm.slug;
      const url = API_FARM.url(slug);
      const response = await fetch(url);
      const farmData: Farm = await response.json();
      farms.push(farmData);
      //dispatch({ type: farmAddDispatchType, payload: farmData });
    }
    dispatch({ type: farmsLoadAllDispatchType, payload: farms });
    dispatch({ type: farmIsLoadingDispatchType, payload: false });
  };
}

/* eslint-enable  */

export const farmsReducers = createReducer(FarmsInitialState, (builder) => {
  builder
    .addCase(farmsLoadAll, (state, action) => {
      state.farms = action.payload;
    })
    .addCase(farmAdded, (state, action) => {
      // push if not exist
      const exist = state.farms.find((farm) => farm.id === action.payload.id);
      if (!exist) state.farms.push(action.payload);
    })
    .addCase(farmIsloading, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(farmsReset, (state, action) => {
      state.farms = [];
    });
});
