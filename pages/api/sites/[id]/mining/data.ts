import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { APIMiningDataResponse } from 'src/types/mining/MiningAPI';

import { SITES } from 'src/constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { APIMiningDataQuery } from 'src/types/mining/MiningAPI';
import { Contractor } from 'src/types/mining/Site';

import { antpoolData } from './pool/antpool';
import { luxorData } from './pool/luxor';
import { foundryData } from './pool/foundry';
import { LRUCache } from 'lru-cache';
import { getDayOfMonthUTC } from 'src/utils/date';
import { userAdded } from 'src/store/features/userData/userDataSlice';

// cache 60 min * 24 = 1 day
/* eslint-disable */
const cache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 60 * 24 });
/* eslint-enable */

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id } = req.query;
  const siteId = id as SiteID;
  let first: number = 500;

  if (!req.body) {
    return res.status(400).json({ error: 'Missing body' });
  }
    let requestBody: APIMiningDataQuery = req.body;
    if (typeof req.body === 'string') {
      requestBody = JSON.parse(req.body);
    }

    const { first: firstParameter , username} = requestBody;

    first = firstParameter ?? 500;
    if (typeof firstParameter === 'string') {
      first = parseInt(firstParameter);
    } else if (!Number.isInteger(firstParameter)) {
      first = 500;
    }
  
  

  // Generate a cache key based on the address, page, and pageSize
  const cacheKey = `data${siteId}-${first}-${username}`;

  // Check if the response is cached
  const cachedData: APIMiningDataResponse = cache.get(cacheKey);
  if (cachedData && cachedData.updated > 0) {
    const cacheDay = getDayOfMonthUTC(cachedData.updated);
    const currentDay = getDayOfMonthUTC(new Date().getTime());

    if (cacheDay !== currentDay) {
      console.log('CACHE EXPIRED', cacheDay, currentDay);
    } else {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }
  }

  const json: APIMiningDataResponse | undefined = await getMiningData(
    siteId,
    first,
    username
  );

  //if (siteId === '2') console.log('BETA RESULT', JSON.stringify(json, null, 4));

  // Cache the response for future use
  if (json && json.error === undefined) {
    cache.set(cacheKey, json);
  }

  res.status(200).json(json);
};
export default handler;

/**
 *
 * @param siteId
 * @param first
 * @param json
 * @returns
 */
export async function getMiningData(
  siteId: SiteID,
  first: number,
  username: string,
): Promise<APIMiningDataResponse | undefined> {
  let json: APIMiningDataResponse | undefined = undefined;

  const site = SITES[siteId as SiteID];

  if (!site.api || site.api.length === 0) {
    console.warn('API SUMMARY : no api defined', siteId);
    const history = {
      updated: new Date().getTime(),
      days: [],
    };
    json = history;
    return json;
  }

  const api = site.api.find((api) => api.username === username);
  if (api) {


    let apiResponse: APIMiningDataResponse | undefined = undefined;
    const username = api.username ?? '';
    const url = api.url ?? '';
    const pool = api.contractor;
    const subaccountId = api.subaccount?.id ?? undefined;

    console.log('API MINING siteId', siteId);
    console.log('API MINING first', first);
    console.log('API MINING username', username);
    console.log('API MINING url', url);
    console.log('API MINING pool', pool);

    if (username && url && pool) {
      switch (pool) {
        case Contractor.LUXOR: {
          apiResponse = await luxorData(url, username, first, subaccountId);
          break;
        }
        case Contractor.ANTPOOL: {
          apiResponse = await antpoolData(
            url,
            username,
            first,
            siteId,
            subaccountId,
          );
          break;
        }
        case Contractor.FOUNDRY: {
          apiResponse = await foundryData(
            url,
            username,
            first,
            siteId,
            subaccountId,
          );
          break;
        }
        default: {
          //statements;
          console.warn(
            'API SUMMARY : unknown pool' + pool + ' siteId' + siteId,
          );
          break;
        }
      }
      if (apiResponse && apiResponse.error) {
        console.error('API SUMMARY : error', apiResponse.error);
      } else if (apiResponse && apiResponse.days) {
        
          json = apiResponse;
       
      }
    } else {
      console.log('WARN : No url or user defined', api.username, api.url);
      const history = {
        updated: new Date().getTime(),
        days: [],
      };
      json = history;
    }
  }
  

  return json;
}
