import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

interface NetworkOverview {
  timestamp: number;
  hashpriceUsd: number;
  networkHashrate7D: number;
  networkDiff: number;
  estDiffAdj: number;
  coinbaseRewards24H: number;
  feesBlocks24H: number;
  marketcap: number;
  nextHalvingCount: number;
  nextHalvingDate: number;
  txRateAvg7D: number;
}

interface ApiNetworkOverview {
  data: {
    bitcoinOverviews: {
      nodes: NetworkOverview[];
    };
  };
}

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 60 * 8,
});
/* eslint-enable */

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const json = await _fetchBicoinOverview();

  res.status(200).json(json);
};
export default handler;

async function _fetchBicoinOverview(): Promise<ApiNetworkOverview | undefined> {
  let json: ApiNetworkOverview | undefined = undefined;

  // Generate a cache key based on the address, page, and pageSize
  const cacheKey = `bitcoin-overview`;

  // Check if the response is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  try {
    const result = await fetch('https://api.hashrateindex.com/graphql', {
      method: 'POST',
      headers: {
        'x-hi-api-key': process.env.LUXOR_API_KEY_HASHRATE ?? '', //'hi.348b7c0e9abaa8579be589ff860d4cd7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
      query bitcoinOverviews($last: Int!) {bitcoinOverviews(last: $last) {
        nodes{
            timestamp
            hashpriceUsd
            networkHashrate7D
            networkDiff
            estDiffAdj
            coinbaseRewards24H
            feesBlocks24H
            marketcap
            nextHalvingCount
            nextHalvingDate
            txRateAvg7D
        }
    }}`,
        variables: { last: 1 },
      }),
    });

    json = await result.json();

    // Cache the response for future use
    if (json) {
      cache.set(cacheKey, json);
    }
  } catch (err) {
    console.log('hashrate index error error');
  }
  return json;
}

export async function fetchBicoinOverview(): Promise<
  NetworkOverview | undefined
> {
  let json = await _fetchBicoinOverview();

  if (json) {
    return json.data.bitcoinOverviews.nodes[0];
  }

  return undefined;
}
