import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { APIMiningHistoryResponse } from 'src/types/mining/MiningAPI';

import { SITES, SiteID } from 'src/constants/csm';
import { APIMiningHistoryQuery } from 'src/types/mining/MiningAPI';
import { Contractor } from 'src/types/mining/Site';

import { antpoolHistory } from './pool/antpool';
import { luxorHistory } from './pool/luxor';
import { LRUCache } from 'lru-cache';

// cache 60 min
/* eslint-disable */
const cache = new LRUCache<string, any>({ max: 500, ttl: 1000 * 60 * 60 });
/* eslint-enable */

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  let json: APIMiningHistoryResponse | undefined;

  if (!req.body) {
    return res.status(400).json('body expected');
  }

  let requestBody: APIMiningHistoryQuery = req.body;
  if (typeof req.body === 'string') {
    requestBody = JSON.parse(req.body);
  }

  let { first } = requestBody;
  const { siteId } = requestBody;
  if (!first || !siteId) {
    return res
      .status(400)
      .json('body not valid ' + JSON.stringify(requestBody));
  }
  if (typeof first === 'string') {
    first = parseInt(first);
  } else if (!Number.isInteger(first)) {
    first = 500;
  }

  // Generate a cache key based on the address, page, and pageSize
  const cacheKey = `${siteId}-${first}`;

  // Check if the response is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  const site = SITES[siteId as SiteID];
  const username = site.api.username ?? '';
  const url = site.api.url ?? '';
  const pool = site.api.contractor;

  console.log('API MINING siteId', siteId);
  console.log('API MINING first', first);
  console.log('API MINING username', username);
  console.log('API MINING url', url);

  if (username && url && pool) {
    switch (pool) {
      case Contractor.LUXOR: {
        json = await luxorHistory(url, username, first);
        break;
      }
      case Contractor.ANTPOOL: {
        json = await antpoolHistory(url, username, first, siteId);
        break;
      }
      default: {
        //statements;
        console.warn('API SUMMARY : unknown pool' + pool + ' siteId' + siteId);
        break;
      }
    }
  } else {
    console.log(
      'WARN : No url or user defined',
      site.api.username,
      site.api.url,
    );
    const history = {
      days: [],
    };
    json = history; //JSON.stringify(history);
  }

  //if (siteId === '2') console.log('BETA RESULT', JSON.stringify(json, null, 4));

  // Cache the response for future use
  if (json && json.error === undefined) {
    cache.set(cacheKey, json);
  }

  res.status(200).json(json);
};
export default handler;
