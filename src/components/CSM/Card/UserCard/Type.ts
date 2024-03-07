import { Income } from '../../../../types/mining/Site';
import { Operator } from 'src/types/mining/Site';

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
    address: string;
    decimal: number;
    image: string;
    toCome: number;
    valueToCome: number;
  };

  site: {
    operator: Operator | undefined;
    miningStart: string[];
    machines: number[];
    hashrate: number[];
    uptime: {
      startTimestamp: number;
      endTimestamp: number;
      onPeriod: number;
      days: number;
      machines: number;
      mined: Income;
      hashrate: number;
      hashratePercent: number;
      hashrates: number[];
      hashratePercents: number[];
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
