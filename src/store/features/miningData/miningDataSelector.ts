import { RootState } from 'src/store/store';
import { MiningHistory, MiningExpenses } from 'src/types/mining/Mining';

export const selectMiningHistory = (state: RootState): MiningHistory =>
  state.sites.miningHistory;

export const selectMiningExpenses = (state: RootState): MiningExpenses =>
  state.sites.miningExpenses;
