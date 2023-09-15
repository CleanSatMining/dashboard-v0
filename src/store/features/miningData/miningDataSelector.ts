import { RootState } from 'src/store/store';
import { MiningState } from 'src/types/mining/Mining';

export const selectMiningState = (state: RootState): MiningState =>
  state.sites.miningState;
