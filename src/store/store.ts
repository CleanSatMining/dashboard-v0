import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createOffersReducers } from './features/createOffers/createOffersSlice';
import { interfaceReducers } from './features/interface/interfaceSlice';
import { settingsReducers } from './features/settings/settingsSlice';
import { sitesReducers } from './features/miningData/miningDataSlice';
import { usersReducers } from './features/userData/userDataSlice';
import { farmsReducers } from './features/farms/farmSlice';

const rootReducer = combineReducers({
  interface: interfaceReducers,
  settings: settingsReducers,
  createOffers: createOffersReducers,
  sites: sitesReducers,
  users: usersReducers,
  farms: farmsReducers,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
