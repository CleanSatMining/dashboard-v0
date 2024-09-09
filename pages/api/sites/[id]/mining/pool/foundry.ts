import BigNumber from 'bignumber.js';

import { SITES } from 'src/constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import {
  APIMiningHistoryResponse,
  DayDataFoundry,
} from 'src/types/mining/MiningAPI';
import { getTimestampUTC, getTimestampNDaysAgo } from 'src/utils/date';
import {
  getHashrate,
  getNumberOfMachines,
} from 'src/components/CSM/Utils/period';

interface FoundryApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

interface FoundryApiResult {
  days: DayDataFoundry[];
  error?: FoundryApiError;
}

export async function foundryHistory(
  url: string,
  subaccount: string,
  first: number,
  siteId: string,
  subaccountId: number | undefined,
): Promise<APIMiningHistoryResponse> {
  // fetch all data

  console.log('FOUNDRY API', siteId);
  const apiKey = getApiSecrets(subaccount);
  console.log('FOUNDRY API usernames', subaccount);
  console.log('FOUNDRY API apiKey', apiKey);

  const ret = await _foundryHistory(
    first,
    apiKey,
    `${url}${subaccount}`,
    siteId,
  );

  const days: MiningSummaryPerDay[] = convertAPIDataToStandard(
    siteId,
    ret.days,
    subaccountId,
  );

  const updated = new Date().getTime();

  return { updated, days };
}

export async function foundryData(
  url: string,
  subaccount: string,
  first: number,
  siteId: string,
  subaccountId: number | undefined,
): Promise<any> {
  // fetch all data

  console.log('FOUNDRY API', siteId);
  const apiKey = getApiSecrets(subaccount);
  console.log('FOUNDRY API usernames', subaccount);
  console.log('FOUNDRY API apiKey', apiKey);

  const ret = await _foundryHistory(
    first,
    apiKey,
    `${url}${subaccount}`,
    siteId,
  );

  const days = ret.days;

  const updated = new Date().getTime();

  return { updated, days };
}

async function _foundryHistory(
  first: number,
  apiKey: string,
  url: string,
  siteId: string,
): Promise<FoundryApiResult> {
  let json: FoundryApiResult = {
    days: [],
    error: undefined,
  };
  const timestamp = getTimestampNDaysAgo(first);
  const fisrtMiningDateTimestamp = getTimestampUTC(
    new Date(SITES[siteId as SiteID].mining.startingDate),
  );
  const firstDateTimestamp = Math.max(timestamp, fisrtMiningDateTimestamp);
  const urlWithParam = `${url}?startDateUnixMs=${firstDateTimestamp}`;

  //console.log('ANTPOOL input', post_data, apiKey);
  try {
    console.log('FOUNDRY API URL', urlWithParam);

    const result = await fetch(urlWithParam, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-API-KEY': apiKey,
      },
    });

    if (result.ok) {
      const response: DayDataFoundry[] = await result.json();
      json = {
        days: response,
      };
    } else {
      const erreur: FoundryApiError = await result.json();
      console.error('FOUNDRY Revenu summary error' + JSON.stringify(erreur));
      json = {
        days: [],
        error: erreur,
      };
    }
  } catch (err) {
    console.error('catch FOUNDRY Revenu summary error' + err);
  }

  return json;
}

/**
 * convertAPIDataToStandard
 * @param siteId
 * @param periodsData
 * @returns
 */
function convertAPIDataToStandard(
  siteId: string,
  periodsData: DayDataFoundry[],
  subaccountId: number | undefined,
): MiningSummaryPerDay[] {
  const site = SITES[siteId as SiteID];

  const result: MiningSummaryPerDay[] = periodsData.map<MiningSummaryPerDay>(
    (day) => {
      const totalMachines = getNumberOfMachines(site, new Date(day.startTime));
      const hashrateMax = getHashrate(site, new Date(day.startTime));
      const hashrate = new BigNumber(day.hashrate).times(1000000000);
      const efficiency = hashrate.dividedBy(hashrateMax);
      return {
        subaccountId: subaccountId,
        date: day.startTime,
        efficiency: efficiency.times(100).toNumber(),
        hashrate: hashrate.toNumber(),
        revenue: day.totalAmount,
        uptimePercentage: efficiency.times(100).toNumber(),
        uptimeTotalMinutes: efficiency.times(24 * 60).toNumber(),
        uptimeTotalMachines: efficiency.times(totalMachines).toNumber(),
      };
    },
  );
  return result;
}

/**
 * getApiSecrets
 * @param username
 * @returns
 */
function getApiSecrets(username: string): string {
  let apiKey = '';

  switch (username) {
    case SITES[SiteID.delta].api[0].username: {
      apiKey = process.env.FOUNDRY_D_API_KEY_ACCOUNT ?? '';
      break;
    }
    case SITES[SiteID.delta].api[1].username: {
      apiKey = process.env.FOUNDRY_D_PECOS_API_KEY_ACCOUNT ?? '';
      break;
    }
    case SITES[SiteID.gamma].api[1].username: {
      apiKey = process.env.FOUNDRY_G_API_KEY_ACCOUNT ?? '';
      break;
    }
    default: {
      break;
    }
  }
  return apiKey;
}
