import { Contractor, MiningStatus, Site } from '../types/mining/Site';
import { UltraRare } from '../types/mining/UltraRare';

export const FEE_RATE_CSM = 0.1;
export const FEE_RATE_BBGS = 0.05;
export const PROVISION_RATE = 0.2;
export const SWISS_TAXE = 0.1357;
export const ACTIVATE_DISPLAY_APY = false;
export const TAXE_FREE_MODE = true;

export const ULTRA_RARE: UltraRare = {
  collection: 'CleanSat Mining Ultra-Rare',
  contract: '0x78994c361ef29506bf19a5957582fa10ee561b4b',
  contractLink:
    'https://gnosisscan.io/address/0x78994c361ef29506bf19a5957582fa10ee561b4b',
};

export enum SiteID {
  alpha = '1',
  beta = '2',
  omega = '3',
  gamma = '4',
  delta = '5',
}

export const SITES: Record<SiteID, Site> = {
  [SiteID.alpha]: {
    name: 'CSM Alpha',
    location: {
      countryCode: 'CD',
      name: 'location-alpha',
    },
    image: 'https://cleansatmining.com/data/files/virunga-congo.jpg',
    token: {
      address: '0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
      supply: 100000,
      price: 14.05,
      symbol: 'CSM-ALPHA',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0xf8419b6527A24007c2BD81bD1aA3b5a735C1F4c9',
    },
    status: MiningStatus.active,
    api: {
      enable: true,
      username: 'bbgs-csma',
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '2023-09-01T00:00:00+00:00',
      asics: [
        {
          date: '2023-09-01T00:00:00+00:00',
          model: 'Whatsminer M30S++',
          powerW: 3100,
          units: 375,
          hashrateHs: 100000000000000,
          intallationCosts: {
            equipement: 1238414,
          },
        },
        {
          date: '2024-03-04T00:00:00+00:00',
          model: 'Whatsminer M50',
          powerW: 3300,
          units: 192,
          hashrateHs: 120000000000000,
          intallationCosts: {
            equipement: 586080,
          },
        },
      ],
      electricity: {
        usdPricePerKWH: 0.0375,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: {
          rate: 0.15,
          includeWithElectricity: false,
        },
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
    vault: {
      btcAddress: 'bc1q2n4v9l8gxlzp7f4c8f4q79vryugjj4hu2ela8r',
      xpub: 'xpub6Bk1T4YnHrQ1oT4VcnsqJqvdeMuovopD7HVbbrVGe4iQXqv2sQfFLuJ68GeSqdvVVw2PWbUuyrEwpwdfpaFFqM2ZxGmnU6udhdQa3FzXQRj',
    },
  },
  [SiteID.beta]: {
    name: 'CSM Beta',
    location: {
      countryCode: 'PY',
      name: 'location-beta',
    },
    image:
      'https://cleansatmining.com/data/files/barrage-d-itaipu_1_croped_1681572415.jpg',
    token: {
      address: '0x364D1aAF7a98e26A1F072e926032f154428481d1',
      supply: 100000,
      price: 12.16,
      symbol: 'CSM-BETA',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x364D1aAF7a98e26A1F072e926032f154428481d1',
    },
    status: MiningStatus.active,
    api: {
      enable: true,
      username: 'bbgs-csmb',
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '2023-10-01T00:00:00+00:00',
      asics: [
        {
          date: '2023-10-01T00:00:00+00:00',
          model: 'Whatsminer M30S++',
          powerW: 3100,
          units: 375,
          hashrateHs: 100000000000000,
          intallationCosts: {
            equipement: 1070445,
          },
        },
      ],
      electricity: {
        usdPricePerKWH: 0.0575,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: {
          includeWithElectricity: false,
          rate: 0.1,
        },
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
    vault: {
      btcAddress: 'bc1qkt5k46h8769h5t33phq6cuhtdhlfk66np2yklf',
      xpub: 'xpub6Bk1T4YnHrQ1q1nS37AhNWXGJwaeP97wuGFHyu95Z8qCsquuFRLeBd2bM2srKXdkYjQPPUfGGBvacn9Q4i2GdrdNn4PS1VoXgvqrd3nfrRp',
    },
  },
  [SiteID.omega]: {
    name: 'CSM Omega',
    location: {
      countryCode: 'FI',
      name: 'location-omega',
    },
    image: 'https://cleansatmining.com/data/files/434184-1260x630-finlande.jpg',
    token: {
      address: '0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
      supply: 100000,
      price: 14.35,
      symbol: 'CSM-OMEGA',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x203A5080450FFC3e038284082FBF5EBCdc9B053f',
    },
    status: MiningStatus.active,
    api: {
      enable: true,
      username: 'bbgs-fin',
      url: 'https://antpool.com/api/paymentHistoryV2.htm',
      contractor: Contractor.ANTPOOL,
    },
    mining: {
      startingDate: '2023-08-18T00:00:00+00:00',
      asics: [
        {
          date: '2023-08-18T00:00:00+00:00',
          model: 'Whatsminer M50',
          powerW: 3400,
          units: 386,
          hashrateHs: 122000000000000,
          intallationCosts: {
            equipement: 1258844,
          },
        },
      ],
      electricity: {
        usdPricePerKWH: 0.059,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: {
          includeWithElectricity: false,
          rate: 0.05,
        },
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
    vault: {
      btcAddress: 'bc1qkupuv2s5gtmardsdj57vkf2pekff7rq7es77jg',
      xpub: 'xpub6Bk1T4YnHrQ1v1s81DSBDpGPtuiJUvGC1smn6d9CesuNSgmXNryYXmJiZsCNUw9mGo9cRDiBr1t3nDBwkxjaeL1wZUL6bcJuNebdipKGNkM',
    },
  },
  [SiteID.gamma]: {
    name: 'CSM Gamma',
    location: {
      countryCode: 'SE',
      name: 'location-gamma',
    },
    image: 'https://cleansatmining.com/data/files/img_3861.jpg',
    token: {
      address: '0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
      supply: 100000,
      price: 10.86,
      symbol: 'CSM-GAMMA',
      gnosisscanUrl:
        'https://gnosisscan.io/address/0x71C86CbB71846425De5f3a693e989F4BDd97E98d',
    },
    status: MiningStatus.active,
    api: {
      enable: true,
      username: 'cleansatmininggamma',
      url: 'https://api.beta.luxor.tech/graphql',
      contractor: Contractor.LUXOR,
    },
    mining: {
      startingDate: '2023-06-20T00:00:00+00:00',
      asics: [
        {
          date: '2023-06-20T00:00:00+00:00',
          model: 'Antminer S19 XP',
          powerW: 3010,
          units: 189,
          hashrateHs: 141000000000000,
          intallationCosts: {
            equipement: 726565,
          },
        },
      ],
      electricity: {
        usdPricePerKWH: 0.063,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: {
          includeWithElectricity: true,
          rate: 0,
        },
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
    vault: {
      btcAddress: '',
      xpub: 'xpub6Bk1T4YnHrQ1eBy5tYoz1HAhkwjGh2Avg43odqjQPVL7KA29eSHr46zg61WiYbk5f5FkR4z6fWfrp9XxieecHMbPZKDg5wFxTqnQGDdv8fz',
    },
  },

  [SiteID.delta]: {
    name: 'CSM Delta',
    location: {
      countryCode: 'US',
      name: 'location-delta',
    },
    image:
      'https://cleansatmining.com/data/files/mount-hood-reflected-in-mirror-lake-oregon.jpg',
    token: {
      address: '0x20D2F2d4b839710562D25274A3e98Ea1F0392D24',
      supply: 219566,
      price: 7.44,
      symbol: 'CSM-DELTA',
      gnosisscanUrl:
        'https://gnosisscan.io/token/0x20D2F2d4b839710562D25274A3e98Ea1F0392D24',
    },
    status: MiningStatus.active,
    api: {
      enable: true,
      username: 'Datafactoryoregon',
      url: 'http://api.foundryusapool.com/earnings/',
      contractor: Contractor.FOUNDRY,
    },
    mining: {
      startingDate: '2024-02-29T00:00:00+00:00',
      asics: [
        {
          date: '2024-02-29T00:00:00+00:00',
          model: 'Antminer S19k pro',
          powerW: 3300,
          units: 827,
          hashrateHs: 117000000000000,
          intallationCosts: {
            equipement: 1451436,
          },
        },
      ],
      electricity: {
        usdPricePerKWH: 0.066,
      },
    },
    fees: {
      crowdfunding: {
        csm: 0.1,
      },
      operational: {
        operator: {
          includeWithElectricity: true,
          rate: 0,
        },
        csm: 0.05,
        pool: 0.015,
        taxe: 0.1357,
        provision: 0.2,
      },
    },
    vault: {
      btcAddress: '',
      xpub: '',
    },
  },
};

export const ALLOWED_SITES = Array.from(Object.keys(SITES));

export const DAYS_PERIODS: number[] = [1, 7, 30, 90, 180, 365];
export const DAYS_PERIODS_MOBILE_FILTER = [1, 7, 30, 90, 365];

export function filterMobile(
  isMobile: boolean,
): (value: number, index: number, array: number[]) => unknown {
  return (p) => !isMobile || DAYS_PERIODS_MOBILE_FILTER.includes(p);
}
