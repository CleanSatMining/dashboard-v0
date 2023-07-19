import { MiningState, Site } from '../types/Site';

export enum SiteID {
  alpha = '1',
  beta = '2',
  gamma = '3',
  omega = '4',
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
      filters: [
        {
          label: '1 day',
          duration: {
            days: 1,
          },
        },
        {
          label: '6 hours',
          duration: {
            hours: 6,
          },
        },
        {
          label: '1 hour',
          duration: {
            hours: 1,
          },
        },
      ],
    },
    apy: 0.17,
    fee: 0.5,
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
      filters: [
        {
          label: '1 day',
          duration: {
            days: 1,
          },
        },
        {
          label: '6 hours',
          duration: {
            hours: 6,
          },
        },
        {
          label: '1 hour',
          duration: {
            hours: 1,
          },
        },
      ],
    },
    apy: 0.17,
    fee: 0.5,
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
      filters: [
        {
          label: '1 day',
          duration: {
            days: 1,
          },
        },
        {
          label: '6 hours',
          duration: {
            hours: 6,
          },
        },
        {
          label: '1 hour',
          duration: {
            hours: 1,
          },
        },
      ],
    },
    apy: 0.17,
    fee: 0.5,
  },
  [SiteID.omega]: {
    name: 'CMS omega',
    image:
      'https://cleansatmining.com/data/files/capturedecran2023-04-15a17.34.32.png',
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
      filters: [
        {
          label: '1 day',
          duration: {
            days: 1,
          },
        },
        {
          label: '6 hours',
          duration: {
            hours: 6,
          },
        },
        {
          label: '1 hour',
          duration: {
            hours: 1,
          },
        },
      ],
    },
    apy: 0.17,
    fee: 0.5,
  },
};

export const ALLOWED_SITES = Array.from(Object.keys(SITES));
