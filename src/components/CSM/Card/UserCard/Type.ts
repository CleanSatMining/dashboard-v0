import { HashratePeriod } from 'src/types/mining/Mining';
import { Income } from '../../../../types/mining/Site';
import { Operator } from 'src/types/mining/Site';
import { SiteCost } from 'src/types/mining/Site';

export type CardData = {
  id: string;
  label: string;
  dataMissing: boolean;
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
    grossDepreciationFree: {
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
    amountToCome: number;
    valueToCome: number;
  };

  site: {
    operator: Operator | undefined;
    miningStart: string;
    machines: number;
    hashrate: number;
    equipmentCost: number;
    uptime: {
      period: {
        real: {
          days: number;
          start: number;
          end: number;
        };
        instruction: {
          days: number;
          start: number;
          end: number;
        };
      };
      //onPeriod: number;
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
