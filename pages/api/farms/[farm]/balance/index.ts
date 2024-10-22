import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { API_GATEWAY_BALANCE } from 'src/constants/apis';
import { DetailedBalanceSheet, FarmSummary } from 'src/types/api/farm';

const CACHE_DURATION_SECONDS = 8 * 60 * 60; // 8 heures
/* eslint-disable */
const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * CACHE_DURATION_SECONDS,
});
/* eslint-enable */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { farm, btc, start, end } = req.query;

  try {
    const cacheKey = `balance_farm_${farm}_from_${start}_to_${end}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    const url = `${API_GATEWAY_BALANCE.url}?farm=${farm}&btc=${btc}${start ? '&start=' + start : ''}${end ? '&end=' + end : ''}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Error while fetching balance gateway api :', response);
      return res.status(response.status).json({
        error: 'Error while fetching farms balance api.' + response.statusText,
      });
    }

    const data: DetailedBalanceSheet = await response.json();

    // Mettre en cache la réponse pour la durée spécifiée
    cache.set(cacheKey, data);

    console.log('PASS NO CACHE');

    res.status(200).json(data);
  } catch (error) {
    console.error('Error while fetching farms gateway api :', error);
    res.status(500).json({ error: 'Error while fetching farms gateway api.' });
  }
}
