import { createAction, createReducer } from '@reduxjs/toolkit';
import { MiningState, SiteMiningSummary } from 'src/types/mining/Mining';

interface sitesInitialStateType {
  miningState: MiningState;
}

const sitesInitialState: sitesInitialStateType = {
  miningState: {
    byId: {},
  },
};

// DISPATCH TYPE
export const siteAddedDispatchType = 'site/added';
export const siteRemovedDispatchType = 'site/removed';
export const siteResetDispatchType = 'site/reset';

// ACTIONS
export const siteAdded = createAction<SiteMiningSummary>(siteAddedDispatchType);
export const siteRemoved = createAction<string>(siteRemovedDispatchType);
export const siteReset = createAction<void>(siteResetDispatchType);

export const sitesReducers = createReducer(sitesInitialState, (builder) => {
  builder
    .addCase(siteAdded, (state, action) => {
      state.miningState.byId[action.payload.id] = action.payload;
    })
    .addCase(siteRemoved, (state, action) => {
      const empty: SiteMiningSummary = {
        id: '',
        mining: { days: [] },
        token: { byUser: {} },
      };
      state.miningState.byId[action.payload] = empty;
    })
    .addCase(siteReset, (state) => {
      state.miningState = sitesInitialState.miningState;
    });
});
