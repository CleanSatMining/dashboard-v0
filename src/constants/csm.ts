import { Contractor, MiningStatus, Site } from '../types/mining/Site';

export const FEE_RATE_CSM = 0.1;
export const FEE_RATE_BBGS = 0.05;
export const PROVISION_RATE = 0.2;
export const SWISS_TAXE = 0.1357;
export const ACTIVATE_DISPLAY_APY = false;

export enum SiteID {
  alpha = '1',
  beta = '2',
  gamma = '3',
  omega = '4',
  delta = '5',
}

export const SITES: Record<SiteID, Site> = {
  [SiteID.alpha]: {
    name: 'CMS alpha',
    location: 'location-alpha',
    image: 'https://cleansatmining.com/data/files/virunga-congo.jpg',
    token: {
      address: '0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
      supply: 100000,
      price: 14.05,
      symbol: 'CSM-alpha',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
    },
    status: MiningStatus.active,
    api: {
      username: 'bbgs-csma',
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '2023-09-01',
      asics: {
        powerW: 3100,
        units: 441,
        hashrateHs: 100000000000000,
      },
      electricity: {
        usdPricePerKWH: 0.038,
      },
      intallationCosts: {
        equipement: 747020,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: 0.15,
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
  },
  [SiteID.beta]: {
    name: 'CMS beta',
    location: 'location-beta',
    image:
      'https://cleansatmining.com/data/files/barrage-d-itaipu_1_croped_1681572415.jpg',
    token: {
      address: '0x364D1aAF7a98e26A1F072e926032f154428481d1',
      supply: 100000,
      price: 12.16,
      symbol: 'CSM-beta',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x364D1aAF7a98e26A1F072e926032f154428481d1',
    },
    status: MiningStatus.inactive,
    api: {
      username: undefined,
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 3100,
        units: 375,
        hashrateHs: 100000000000000,
      },
      electricity: {
        usdPricePerKWH: 0.058,
      },
      intallationCosts: {
        equipement: 1606587,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: 0.1,
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
  },
  [SiteID.omega]: {
    name: 'CMS omega',
    location: 'location-omega',
    image: 'https://cleansatmining.com/data/files/434184-1260x630-finlande.jpg',
    token: {
      address: '0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
      supply: 100000,
      price: 14.35,
      symbol: 'CSM-omega',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
    },
    status: MiningStatus.active,
    api: {
      username: 'bbgs-fin',
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '2023-08-18',
      asics: {
        powerW: 3400,
        units: 352,
        hashrateHs: 122000000000000,
      },
      electricity: {
        usdPricePerKWH: 0.059,
      },
      intallationCosts: {
        equipement: 1021739,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: 0.1,
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
  },
  [SiteID.gamma]: {
    name: 'CMS gamma',
    location: 'location-gamma',
    image: 'https://cleansatmining.com/data/files/img_3861.jpg',
    token: {
      address: '0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
      supply: 100000,
      price: 9.99,
      symbol: 'CSM-gamma',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
    },
    status: MiningStatus.active,
    api: {
      username: 'cleansatmininggamma',
      url: 'https://api.beta.luxor.tech/graphql',
      contractor: Contractor.LUXOR,
    },
    mining: {
      startingDate: '2023-06-20',
      asics: {
        powerW: 3010,
        units: 189,
        hashrateHs: 141000000000000,
      },
      electricity: {
        usdPricePerKWH: 0.078,
      },
      intallationCosts: {
        equipement: 726565,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: 0,
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
  },

  [SiteID.delta]: {
    name: 'CMS delta',
    location: 'location-delta',
    image:
      'https://cleansatmining.com/data/files/mount-hood-reflected-in-mirror-lake-oregon.jpg',
    token: {
      address: '0x20D2F2d4b839710562D25274A3e98Ea1F0392D24',
      supply: 100000,
      price: 6.7,
      symbol: 'CSM-omega',
      gnosisscanUrl:
        'https://gnosisscan.io/token/0x20D2F2d4b839710562D25274A3e98Ea1F0392D24',
    },
    status: MiningStatus.inactive,
    api: {
      username: undefined,
      url: undefined,
      contractor: undefined,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 3300,
        units: 352,
        hashrateHs: 122000000000000,
      },
      electricity: {
        usdPricePerKWH: 0.046,
      },
      intallationCosts: {
        equipement: 650000,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: 0.15,
        csm: 0,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
  },
};

export const ALLOWED_SITES = Array.from(Object.keys(SITES));

export const DAYS_PERIODS: number[] = [1, 7, 30, 90, 180];
export const DAYS_PERIODS_MOBILE_FILTER = [1, 7, 30, 90];

export function filterMobile(
  isMobile: boolean,
): (value: number, index: number, array: number[]) => unknown {
  return (p) => !isMobile || DAYS_PERIODS_MOBILE_FILTER.includes(p);
}
