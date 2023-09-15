import { RootState } from 'src/store/store';
import { UserState } from 'src/types/mining/Mining';

export const selectUsersState = (state: RootState): UserState =>
  state.users.users;
