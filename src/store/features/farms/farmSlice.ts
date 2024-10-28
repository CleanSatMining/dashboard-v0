import { gql } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { createAction, createReducer } from '@reduxjs/toolkit';
import { API_FARM } from 'src/constants/apis';

import { getRightAllowBuyTokens } from 'src/hooks/useAllowedTokens';
import { AppDispatch, RootState } from 'src/store/store';
import { PropertiesToken, PropertiesERC20 } from 'src/types';
import { AllowedToken } from 'src/types/allowedTokens';
import { Farm } from 'src/types/api/farm';
import { OFFER_LOADING, Offer } from 'src/types/offer/Offer';
import { Price } from 'src/types/price';
import { fetchOffersTheGraph } from 'src/utils/offers/fetchOffers';
import { getRealTokenClient } from 'src/utils/offers/getClientURL';
import { getPrice } from 'src/utils/price';
import { Price as P } from 'src/utils/price';
import { getERC20Properties } from 'src/utils/properties';

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

//ACTIONS
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

/* eslint-enable  */

export const farmsReducers = createReducer(FarmsInitialState, (builder) => {
  builder
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
