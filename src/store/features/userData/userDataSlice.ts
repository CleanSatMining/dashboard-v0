import { createAction, createReducer } from '@reduxjs/toolkit';
import { UserState, UserSummary } from 'src/types/mining/Mining';

interface usersInitialStateType {
  users: UserState;
}

const usersInitialState: usersInitialStateType = {
  users: { byAddress: {} },
};

// DISPATCH TYPE
export const userAddedDispatchType = 'user/added';
export const userRemovedDispatchType = 'user/removed';
export const userResetDispatchType = 'user/reset';

// ACTIONS
export const userAdded = createAction<UserSummary>(userAddedDispatchType);
export const userRemoved = createAction<string>(userRemovedDispatchType);
export const userReset = createAction<void>(userResetDispatchType);

export const usersReducers = createReducer(usersInitialState, (builder) => {
  builder
    .addCase(userAdded, (state, action) => {
      state.users.byAddress[action.payload.address] = action.payload;
    })
    .addCase(userRemoved, (state, action) => {
      const empty: UserSummary = {
        address: '',
        bySite: {},
      };
      state.users.byAddress[action.payload] = empty;
    })
    .addCase(userReset, (state) => {
      state.users = usersInitialState.users;
    });
});
