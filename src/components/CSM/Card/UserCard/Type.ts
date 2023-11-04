import { Income } from '../../../../types/mining/Site';

export type CardData = {
  id: string;
  label: string;
  income: {
    available: boolean;
    mined: Income;
    net: {
      balance: Income;
      apy: number;
    };
    gross: {
      balance: Income;
      apy: number;
    };
  };

  token: {
    balance: number;
    value: number;
    percent: number;
    supply: number;
    url: string;
    symbol: string;
  };

  site: {
    miningStart: string;
    machines: number;
    hashrate: number;
    uptime: {
      onPeriod: number;
      days: number;
      machines: number;
      hashratePercent: number;
      mined: Income;
      hashrate: number;
      earned: Income;
      costs: CardCost;
    };
  };
};

export type CardCost = {
  total: number;
  electricity: number;
  feeCSM: number;
  feeOperator: number;
  taxe: number;
  provision: number;
};
