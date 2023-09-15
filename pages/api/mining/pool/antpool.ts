import BigNumber from 'bignumber.js';
import * as crypto from 'crypto';

import { SITES, SiteID } from 'src/constants/csm';
import { MiningSummaryPerDay } from 'src/types/mining/Mining';

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

export async function antpoolHistory(
  url: string,
  username: string,
  first: number,
  siteId: string
) {
  let json;
  const site = SITES[siteId as SiteID];
  const totalPage: number = Math.ceil(first / PAGE_SIZE);
  const { apiKey, apiSign } = getApiSecrets(username);

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
      console.log('ANTPOOL input', post_data, apiKey);

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
          json = erreur; // JSON.stringify(erreur);
          console.error(
            'ANTPOOL Revenu summary error' + JSON.stringify(erreur)
          );
        }
      } catch (err) {
        console.error('catch ANTPOOL Revenu summary error' + err);
      }
    }
  }
  //console.log('ANTPOOL', periodsData);

  const totalMachines = new BigNumber(site.mining.asics.units);
  const hashrateMax = new BigNumber(site.mining.asics.hashrateHs).times(
    totalMachines
  );

  const result: MiningSummaryPerDay[] = periodsData.map<MiningSummaryPerDay>(
    (day) => {
      const efficiency = new BigNumber(day.hashrate_unit).dividedBy(
        hashrateMax
      );
      return {
        date: day.timestamp,
        efficiency: efficiency.times(100).toNumber(),
        hashrate: day.hashrate_unit,
        revenue: new BigNumber(day.fppsBlockAmount)
          .plus(day.fppsFeeAmount)
          .toNumber(),
        uptimePercentage: efficiency.times(100).toNumber(),
        uptimeTotalMinutes: efficiency.times(24 * 60).toNumber(),
        uptimeTotalMachines: efficiency.times(totalMachines).toNumber(),
      };
    }
  );

  json = { days: result };
  console.log('ANTPOOL RESULT', json);
  return json;
}

/**
 * getApiSecrets
 * @param username
 * @returns
 */
function getApiSecrets(username: string) {
  let apiSign = ['', 0];
  let apiKey = '';
  let apiSecret = '';
  console.log('ANTPOOL username', username, apiSign);

  switch (username) {
    case SITES[SiteID.alpha].api.username: {
      apiKey = process.env.ANTPOOL_A_API_KEY_ACCOUNT ?? '';
      apiSecret = process.env.ANTPOOL_A_API_SIGN_SECRET ?? '';
      apiSign = getSignature(username, apiKey, apiSecret);
      break;
    }
    case SITES[SiteID.omega].api.username: {
      apiKey = process.env.ANTPOOL_O_API_KEY_ACCOUNT ?? '';
      apiSecret = process.env.ANTPOOL_O_API_SIGN_SECRET ?? '';
      apiSign = getSignature(username, apiKey, apiSecret);
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
