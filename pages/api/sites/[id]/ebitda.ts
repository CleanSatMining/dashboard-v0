import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { APIMiningHistoryResponse } from 'src/types/mining/MiningAPI';
import { Site } from 'src/types/mining/Site';
import {
  calculateElectricityCostPerPeriod,
  calculateCostsAndEBITDAByPeriod,
} from 'src/components/CSM/Utils/pnl';
import { APIEbitdaQuery } from 'src/types/mining/MiningAPI';
import {
  calculateDaysBetweenDates,
  getMidnightTimestamp,
  getLastMinuteTimestamp,
  getFirstDayOfPreviousMonth,
  getLastDayOfPreviousMonth,
} from 'src/utils/date';
import { getMiningHistory } from './mining/history';
import { LRUCache } from 'lru-cache';
import {
  mapHistoryMiningToSiteHistoryMining,
  MiningHistory,
  filterOldDates,
} from 'src/types/mining/Mining';
import {
  getMinedBtcBySite,
  getUptimeBySite,
} from 'src/components/CSM/Utils/yield';
import { SITES, SiteID } from 'src/constants/csm';
import BigNumber from 'bignumber.js';

// cache 60 min
/* eslint-disable */
const cache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 60 });
/* eslint-enable */

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id } = req.query;
  const siteId = id as SiteID;

  let startTimestamp = getFirstDayOfPreviousMonth();
  let endTimestamp = getLastDayOfPreviousMonth();
  let btcPrice = 50000;
  let basePricePerKWH: number | undefined = undefined;

  if (req.body) {
    let requestBody: APIEbitdaQuery = req.body;
    if (typeof req.body === 'string') {
      console.log('req.body', req.body);
      requestBody = JSON.parse(req.body);
    } else {
      console.log('req.body', JSON.stringify(req.body));
    }
    startTimestamp = getMidnightTimestamp(Number(requestBody.startTimestamp));
    endTimestamp = getLastMinuteTimestamp(Number(requestBody.endTimestamp));
    btcPrice = Number(requestBody.btcPrice);
    basePricePerKWH = requestBody.basePricePerKWH
      ? Number(requestBody.basePricePerKWH)
      : undefined;
  }

  const period = calculateDaysBetweenDates(startTimestamp, endTimestamp);
  const first = calculateDaysBetweenDates(startTimestamp, new Date().getTime());

  let miningHistoryResponse: APIMiningHistoryResponse | undefined = undefined;

  // Generate a cache key based on the address, page, and pageSize
  const cacheKey = `${siteId}-${first}`;

  // Check if the response is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    miningHistoryResponse = cachedData;
  } else {
    miningHistoryResponse = await getMiningHistory(siteId, first);

    // Cache the response for future use
    if (miningHistoryResponse && miningHistoryResponse.error === undefined) {
      cache.set(cacheKey, miningHistoryResponse);
    }
  }

  const siteHistoryMining = mapHistoryMiningToSiteHistoryMining(
    siteId,
    miningHistoryResponse?.days.filter(filterOldDates(first)) ?? [],
  );
  const miningHistory: MiningHistory = {
    byId: { [siteId]: siteHistoryMining },
  };

  const site: Site = SITES[siteId as SiteID];
  const feeParameters = site.fees;
  const equipement = new BigNumber(site.mining.intallationCosts.equipement);
  const electricityCost = calculateElectricityCostPerPeriod(
    miningHistory,
    siteId,
    period,
    startTimestamp,
    endTimestamp,
    [],
    btcPrice,
    basePricePerKWH,
  );
  const minedBtc = getMinedBtcBySite(
    miningHistory,
    siteId,
    period,
    btcPrice,
    startTimestamp,
    endTimestamp,
  );

  const result = calculateCostsAndEBITDAByPeriod(
    minedBtc.value,
    electricityCost,
    feeParameters,
    equipement,
    period,
    startTimestamp,
    endTimestamp,
    [],
    btcPrice,
  );

  const uptime = getUptimeBySite(
    miningHistory,
    siteId,
    period,
    startTimestamp,
    endTimestamp,
  );

  const returnValue = {
    feeCsm: result.feeCsm,
    taxe: result.taxe,
    EBITDA: result.EBITDA,
    provision: result.provision,
    feeOperator: result.feeOperator,
    electricityCost: electricityCost,
    btcPrice: btcPrice,
    minedBtc: minedBtc,
    period: period,
    startTimestamp: startTimestamp,
    endTimestamp: endTimestamp,
    uptime: uptime,
  };

  res.status(200).json(returnValue);
  // } else {
  //   res.status(400).json({ error: 'body expected' });
  // }
};

export default handler;
