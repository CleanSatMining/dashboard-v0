import BigNumber from 'bignumber.js';
import * as crypto from 'crypto';

import { SITES } from 'src/constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { APIMiningHistoryResponse } from 'src/types/mining/MiningAPI';
import {
  getHashrate,
  getNumberOfMachines,
} from 'src/components/CSM/Utils/period';

const PAGE_SIZE = 50; //page size max

interface RevenueHistory {
  code: number;
  message: string;
  data: {
    page: number;
    totalPage: number;
    pageSize: number;
    totalRecord: number;
    rows: DayData[];
  };
}

interface DayData {
  timestamp: string;
  hashrate: string;
  hashrate_unit: number;
  ppsAmount: number;
  pplnsAmount: number;
  soloAmount: number;
  ppappsAmount: number;
  ppapplnsAmount: number;
  fppsBlockAmount: number;
  fppsFeeAmount: number;
}

interface AntpoolApiResult {
  days?: DayData[];
  /* eslint-disable */
  error?: any;
  /* eslint-enable */
}

export async function antpoolHistory(
  url: string,
  usernames: string,
  first: number,
  siteId: string,
  subaccountId: number | undefined,
): Promise<APIMiningHistoryResponse> {
  const users = usernames.split(',');

  const returns = [];

  // fetch all data
  for (const user of users) {
    const { apiKey, apiSign } = getApiSecrets(usernames, user);
    console.log('ANTPOOL API usernames', usernames);
    console.log('ANTPOOL API user', user);
    console.log('ANTPOOL API apiKey', apiKey);
    console.log('ANTPOOL API apiSign', apiSign);
    const ret = await _antPoolHistory(siteId, first, apiKey, apiSign, url);
    if (ret.days === undefined)
      return { days: [], error: ret.error, updated: new Date().getTime() };
    const result = new Map(ret.days.map((i) => [i.timestamp, i]));
    returns.push(result);
  }

  // consolid data
  const sumData = new Map<string, DayData>();
  for (const data of returns) {
    data.forEach((value: DayData, key: string) => {
      if (sumData.has(key)) {
        const oldMiningValue = sumData.get(key);
        const newMiningValue: DayData = {
          timestamp: value.timestamp,
          hashrate:
            value.hashrate +
            (oldMiningValue ? ' + ' + oldMiningValue.hashrate : ''),
          hashrate_unit: new BigNumber(value.hashrate_unit)
            .plus(oldMiningValue ? oldMiningValue.hashrate_unit : 0)
            .toNumber(),
          ppsAmount: new BigNumber(value.ppsAmount)
            .plus(oldMiningValue ? oldMiningValue.ppsAmount : 0)
            .toNumber(),
          pplnsAmount: new BigNumber(value.pplnsAmount)
            .plus(oldMiningValue ? oldMiningValue.pplnsAmount : 0)
            .toNumber(),
          soloAmount: new BigNumber(value.soloAmount)
            .plus(oldMiningValue ? oldMiningValue.soloAmount : 0)
            .toNumber(),
          ppappsAmount: new BigNumber(value.ppappsAmount)
            .plus(oldMiningValue ? oldMiningValue.ppappsAmount : 0)
            .toNumber(),
          ppapplnsAmount: new BigNumber(value.ppapplnsAmount)
            .plus(oldMiningValue ? oldMiningValue.ppapplnsAmount : 0)
            .toNumber(),
          fppsBlockAmount: new BigNumber(value.fppsBlockAmount)
            .plus(oldMiningValue ? oldMiningValue.fppsBlockAmount : 0)
            .toNumber(),
          fppsFeeAmount: new BigNumber(value.fppsFeeAmount)
            .plus(oldMiningValue ? oldMiningValue.fppsFeeAmount : 0)
            .toNumber(),
        };
        sumData.set(key, newMiningValue);
      } else {
        sumData.set(key, value);
      }
    });
  }

  const days: MiningSummaryPerDay[] = convertAPIDataToStandard(
    siteId,
    [...sumData.values()],
    subaccountId,
  );
  const updated = new Date().getTime();
  return { days, updated };
}

export async function antpoolData(
  url: string,
  username: string,
  first: number,
  siteId: string,
  subaccountId: number | undefined,
): Promise<any> {
  const { apiKey, apiSign } = getApiSecrets(username);
  console.log('ANTPOOL API usernames', username);
  console.log('ANTPOOL API apiKey', apiKey);
  console.log('ANTPOOL API apiSign', apiSign);
  const ret = await _antPoolHistory(siteId, first, apiKey, apiSign, url);
  if (ret.days === undefined)
    return { days: [], error: ret.error, updated: new Date().getTime() };

  const days = ret.days;
  const updated = new Date().getTime();
  return { days, updated };
}

async function _antPoolHistory(
  siteId: string,
  first: number,
  apiKey: string,
  apiSign: (string | number)[],
  url: string,
): Promise<AntpoolApiResult> {
  let json: AntpoolApiResult = {
    days: undefined,
    error: undefined,
  };

  const totalPage: number = Math.ceil(first / PAGE_SIZE);

  let periodsData: DayData[] = [];
  let totalPageReturned = totalPage;

  for (let page = 1; page <= totalPage; page++) {
    if (page <= totalPageReturned) {
      const post_data = new URLSearchParams({
        key: apiKey,
        nonce: apiSign[1].toString(),
        signature: apiSign[0].toString(),
        coin: 'BTC',
        pageSize: PAGE_SIZE.toString(),
        page: page.toString(),
        type: 'recv',
      });
      //console.log('ANTPOOL input', post_data, apiKey);
      try {
        const result = await fetch(url, {
          method: 'POST',
          body: post_data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (result.ok) {
          const response: RevenueHistory = await result.json();

          //console.log('ANTPOOL response', JSON.stringify(response, null, 4));
          if (response.data.page === page) {
            periodsData = [...periodsData, ...response.data.rows];
          }
          totalPageReturned = response.data.pageSize;
        } else {
          const erreur = {
            message: await result.json(),
          };
          json = { days: [], error: erreur }; // JSON.stringify(erreur);
          console.error(
            'ANTPOOL Revenu summary error' + JSON.stringify(erreur),
          );
        }
      } catch (err) {
        console.error('catch ANTPOOL Revenu summary error' + err);
      }
    }
  }
  //console.log('ANTPOOL', periodsData);
  // const result: MiningSummaryPerDay[] = convertAPIDataToStandard(
  //   siteId,
  //   periodsData,
  // );

  json = { days: periodsData.slice(0, first) };
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
  periodsData: DayData[],
  subaccountId: number | undefined,
) {
  const site = SITES[siteId as SiteID];

  const result: MiningSummaryPerDay[] = periodsData.map<MiningSummaryPerDay>(
    (day) => {
      const totalMachines = getNumberOfMachines(site, new Date(day.timestamp));
      const hashrateMax = getHashrate(site, new Date(day.timestamp));
      const efficiency = new BigNumber(day.hashrate_unit).dividedBy(
        hashrateMax,
      );
      return {
        subaccountId: subaccountId,
        date: day.timestamp.replace(' 00:00:00', 'T00:00:00+00:00'), //2024-03-10 00:00:00 => 2024-03-10T00:00:00+00:00
        efficiency: efficiency.times(100).toNumber(),
        hashrate: day.hashrate_unit,
        revenue: new BigNumber(day.fppsBlockAmount)
          .plus(day.fppsFeeAmount)
          .toNumber(),
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
function getApiSecrets(username: string, user?: string) {
  let apiSign = ['', 0];
  let apiKey = '';
  let apiSecret = '';
  //console.log('ANTPOOL username', username, apiSign);

  switch (username) {
    case SITES[SiteID.alpha].api[0].username: {
      apiKey = process.env.ANTPOOL_A_API_KEY_ACCOUNT ?? '';
      apiSecret = process.env.ANTPOOL_A_API_SIGN_SECRET ?? '';
      apiSign = getSignature(username, apiKey, apiSecret);
      break;
    }
    case SITES[SiteID.omega].api[0].username: {
      apiKey = process.env.ANTPOOL_O_API_KEY_ACCOUNT ?? '';
      apiSecret = process.env.ANTPOOL_O_API_SIGN_SECRET ?? '';
      apiSign = getSignature(username, apiKey, apiSecret);
      break;
    }
    case SITES[SiteID.beta].api[0].username: {
      if (user) {
        const users = SITES[SiteID.beta].api[0].username
          ? SITES[SiteID.beta].api[0].username.split(',')
          : [];
        const index = users.indexOf(user);
        const apiKeys = process.env.ANTPOOL_B_API_KEY_ACCOUNT ?? '';
        const apiSecrets = process.env.ANTPOOL_B_API_SIGN_SECRET ?? '';

        apiKey = apiKeys.split(',')[index];
        apiSecret = apiSecrets.split(',')[index];
        apiSign = getSignature(user, apiKey, apiSecret);
      }

      break;
    }
    default: {
      break;
    }
  }
  return { apiKey, apiSign };
}

/**
 * getSignature
 *
 * @param username
 * @returns
 */
function getSignature(username: string, key: string, secret: string) {
  const nonce = Math.floor(new Date().getTime() / 1000);

  const msgs = username + key + nonce;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(msgs)
    .digest('hex')
    .toUpperCase();

  return [signature, nonce];
}
