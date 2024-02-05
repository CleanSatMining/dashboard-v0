import { createAction, createReducer } from '@reduxjs/toolkit';
import {
  MiningHistory,
  SiteMiningHistory,
  MiningExpenses,
} from 'src/types/mining/Mining';

interface sitesInitialStateType {
  miningHistory: MiningHistory;
  miningExpenses: MiningExpenses;
}

const sitesInitialState: sitesInitialStateType = {
  miningHistory: {
    byId: {},
  },
  miningExpenses: {
    byId: {},
  },
};

// DISPATCH TYPE
export const siteAddedDispatchType = 'site/added';
export const siteRemovedDispatchType = 'site/removed';
export const siteResetDispatchType = 'site/reset';
export const expensesAddedDispatchType = 'expenses/added';
export const expensesResetDispatchType = 'expenses/reset';

// ACTIONS
export const siteAdded = createAction<SiteMiningHistory>(siteAddedDispatchType);
export const siteRemoved = createAction<string>(siteRemovedDispatchType);
export const siteReset = createAction<void>(siteResetDispatchType);
export const expensesAdded = createAction<MiningExpenses>(
  expensesAddedDispatchType,
);
export const expensesReset = createAction<void>(expensesResetDispatchType);

export const sitesReducers = createReducer(sitesInitialState, (builder) => {
  builder
    .addCase(siteAdded, (state, action) => {
      state.miningHistory.byId[action.payload.id] = action.payload;
    })
    .addCase(siteRemoved, (state, action) => {
      const empty: SiteMiningHistory = {
        id: '',
        mining: { days: [] },
        token: { byUser: {} },
      };
      state.miningHistory.byId[action.payload] = empty;
    })
    .addCase(siteReset, (state) => {
      state.miningHistory = sitesInitialState.miningHistory;
    })
    .addCase(expensesAdded, (state, action) => {
      state.miningExpenses = action.payload;
    })
    .addCase(expensesReset, (state) => {
      state.miningExpenses = {
        byId: {},
      };
    });
});
