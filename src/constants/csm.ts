import { MiningState, Site } from '../types/Site';

export const FEE_RATE_CSM = 0.1;
export const FEE_RATE_BBGS = 0.05;
export const PROVISION_RATE = 0.2;
export const SWISS_TAXE = 0.1357;

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
    image: 'https://cleansatmining.com/data/files/virunga-congo.jpg',
    token: {
      address: '0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
      supply: 100000,
      price: 14.05,
      symbol: 'CSM-alpha',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
    },
    miningState: MiningState.inactive,
    api: {
      username: undefined,
      url: undefined,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 0,
        units: 0,
      },
      electricity: {
        usdPricePerKWH: 0,
      },
    },
  },
  [SiteID.beta]: {
    name: 'CMS beta',
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
    miningState: MiningState.inactive,
    api: {
      username: undefined,
      url: undefined,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 0,
        units: 0,
      },
      electricity: {
        usdPricePerKWH: 0,
      },
    },
  },

  [SiteID.gamma]: {
    name: 'CMS gamma',
    image:
      'https://cleansatmining.com/data/files/shutterstock_1996306160_c.jpg',
    token: {
      address: '0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
      supply: 100000,
      price: 9.99,
      symbol: 'CSM-gamma',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
    },
    miningState: MiningState.active,
    api: {
      username: 'cleansatmininggamma',
      url: 'https://api.beta.luxor.tech/graphql',
    },
    mining: {
      startingDate: '20/06/2023',
      asics: {
        powerW: 3000,
        units: 189,
      },
      electricity: {
        usdPricePerKWH: 0.078,
      },
    },
  },
  [SiteID.omega]: {
    name: 'CMS omega',
    image: 'https://cleansatmining.com/data/files/434184-1260x630-finlande.jpg',
    token: {
      address: '0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
      supply: 100000,
      price: 14.35,
      symbol: 'CSM-omega',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
    },
    miningState: MiningState.inactive,
    api: {
      username: undefined,
      url: undefined,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 0,
        units: 0,
      },
      electricity: {
        usdPricePerKWH: 0,
      },
    },
  },
  [SiteID.delta]: {
    name: 'CMS delta',
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
    miningState: MiningState.inactive,
    api: {
      username: undefined,
      url: undefined,
    },
    mining: {
      startingDate: '-',
      asics: {
        powerW: 0,
        units: 0,
      },
      electricity: {
        usdPricePerKWH: 4.6,
      },
    },
  },
};

export const ALLOWED_SITES = Array.from(Object.keys(SITES));

export const DAYS_PERIODS: number[] = [1, 7, 30, 60];
