import { HashratePeriod } from 'src/types/mining/Mining';
import { Income } from '../../../../types/mining/Site';
import { Operator } from 'src/types/mining/Site';
import { SiteCost } from 'src/types/mining/Site';

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
    grossTaxeFree: {
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
    miningStart: string;
    machines: number;
    hashrate: number;
    equipmentCost: number;
    uptime: {
      onPeriod: number;
      days: number;
      machines: number;
      hashratePercent: number;
      hashratePeriods: HashratePeriod[];
      mined: Income;
      hashrate: number;
      earned: Income;
      earnedTaxFree: Income;
      costs: SiteCost;
    };
  };
};
