import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { API_BITCOIN_QUOTE } from 'src/constants/apis';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 60 * 8,
});
/* eslint-enable */

type PriceResponse = {
  data: {
    getChartBySlug: {
      data: [
        {
          timestamp: string;
          open: number;
          high: number;
          low: number;
          close: number;
        },
      ];
    };
  };
};

interface Quote {
  price: number;
  message?: any;
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const json = await fetchBitcoinPrice();

  res.status(200).json(json);
};
export default handler;

export async function fetchBitcoinPrice(): Promise<Quote | undefined> {
  let json = undefined;

  // Generate a cache key based on the address, page, and pageSize
  const cacheKey = `bitcoin-price`;

  // Check if the response is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const result = await fetch(API_BITCOIN_QUOTE.url, {
      method: API_BITCOIN_QUOTE.method,
      headers: {
        'x-hi-api-key': process.env.LUXOR_API_KEY_HASHRATE ?? '', //'hi.348b7c0e9abaa8579be589ff860d4cd7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
      query get_ohlc_prices($inputInterval: ChartsInterval, $inputSlug: String) {
        getChartBySlug(inputInterval: $inputInterval, inputSlug: $inputSlug) {
            data
        }
    }`,
        variables: { inputInterval: '_1_DAY', inputSlug: 'bitcoin-ohlc' },
      }),
    });

    if (result.ok) {
      const response: PriceResponse = await result.json();

      const quote: Quote = {
        price:
          response.data.getChartBySlug.data[
            response.data.getChartBySlug.data.length - 1
          ].close,
      };
      json = quote; // JSON.stringify(quote);

      // Cache the response for future use
      if (json) {
        cache.set(cacheKey, json);
      }
    } else {
      const erreur = {
        price: 0,
        message: await result.json(),
      };
      json = erreur; //JSON.stringify(erreur);
    }
  } catch (err) {
    console.log('Error api BTC price');
  }
  return json;
}
