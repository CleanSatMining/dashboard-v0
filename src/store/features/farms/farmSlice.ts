import { createAction, createReducer } from '@reduxjs/toolkit';
import { API_FARM, API_FARMS, API_FARM_BALANCE } from 'src/constants/apis';

import { AppDispatch, RootState } from 'src/store/store';

import { DetailedBalanceSheet, Farm, FarmSummary } from 'src/types/api/farm';

interface PeriodMiningStateType {
  isLoading: boolean;
  data: { [dates: string]: DetailedBalanceSheet };
}
interface FarmMiningStateType {
  farm: string;
  start: string;
  end: string;
  mining: DetailedBalanceSheet;
}

interface FarmsStateType {
  isLoading: boolean;
  farms: Farm[];
  miningData: {
    [farm: string]: PeriodMiningStateType;
  };
}

const FarmsInitialState: FarmsStateType = {
  isLoading: true,
  farms: [],
  miningData: {},
};

//DISPATCH TYPE
export const farmAddDispatchType = 'farms/farmAdd';
export const farmIsLoadingDispatchType = 'farms/farmIsLoading';
export const farmsResetDispatchType = 'farms/farmsReset';
export const farmsLoadAllDispatchType = 'farms/farmsLoadAll';
export const farmAddMiningDataDispatchType = 'farms/farmAddMiningData';
export const farmMiningDataIsLoadingDispatchType =
  'farms/farmMiningDataIsLoading';

//ACTIONS
export const farmsLoadAll = createAction<Farm[]>(farmsLoadAllDispatchType);
export const farmAdded = createAction<Farm>(farmAddDispatchType);
export const farmIsloading = createAction<boolean>(farmIsLoadingDispatchType);
export const farmsReset = createAction<undefined>(farmsResetDispatchType);
export const farmAddMiningData = createAction<FarmMiningStateType>(
  farmAddMiningDataDispatchType,
);
export const farmDataMiningIsloading = createAction<{
  farm: string;
  isLoading: boolean;
}>(farmMiningDataIsLoadingDispatchType);

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

export function fetchFarmMiningData(
  slug: string,
  btcPrice: number,
  start: Date,
  end: Date,
) {
  // TODO: look for type
  return async function fetchFarmMiningDataThunk(
    dispatch: AppDispatch,
    getState: () => RootState,
  ) {
    dispatch({
      type: farmMiningDataIsLoadingDispatchType,
      payload: { farm: slug, isLoading: true },
    });

    try {
      // convert timstamp to string format 'YYYY-MM-DD'

      const endIso = new Date(end).toISOString().split('T')[0];
      const startIso = new Date(start).toISOString().split('T')[0];
      const url =
        API_FARM_BALANCE.url(slug) +
        '?btc=' +
        btcPrice +
        '&start=' +
        startIso +
        '&end=' +
        endIso;
      console.log('fetch', url);
      const response = await fetch(url); // Remplacez par votre URL d'API
      const data: DetailedBalanceSheet = await response.json();

      dispatch({
        type: farmAddMiningDataDispatchType,
        payload: {
          farm: slug,
          start: startIso,
          end: endIso,
          mining: data,
        },
      });
    } catch (error) {
      console.error('Error fetching mining data', error);
    }

    dispatch({
      type: farmMiningDataIsLoadingDispatchType,
      payload: { farm: slug, isLoading: false },
    });
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
    })
    .addCase(farmAddMiningData, (state, action) => {
      const { farm, start, end, mining } = action.payload;
      if (!state.miningData[farm]) {
        state.miningData[farm] = {
          isLoading: false,
          data: {},
        };
      }
      console.log('add mining data', farm, start + ' - ' + end);
      state.miningData[farm].data[start + ' - ' + end] = mining;
    })
    .addCase(farmDataMiningIsloading, (state, action) => {
      const { farm } = action.payload;
      if (!state.miningData[farm]) {
        state.miningData[farm] = {
          isLoading: action.payload.isLoading,
          data: {},
        };
      }
      state.miningData[farm].isLoading = action.payload.isLoading;
    });
});
