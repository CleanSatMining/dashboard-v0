import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { API_GATEWAY_GET_FARM } from 'src/constants/apis';
import { Farm } from 'src/types/api/farm';

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
  const { farm } = req.query;
  try {
    const cacheKey = `get_farm_${farm}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    const response = await fetch(API_GATEWAY_GET_FARM.url(farm as string));

    if (!response.ok) {
      console.error('Error while fetching farms gateway api :', response);
      return res.status(response.status).json({
        error: 'Error while fetching farms gateway api.' + response.statusText,
      });
    }

    const data: Farm = await response.json();

    // Mettre en cache la réponse pour la durée spécifiée
    cache.set(cacheKey, data);

    console.log('PASS NO CACHE');

    res.status(200).json(data);
  } catch (error) {
    console.error('Error while fetching farms gateway api :', error);
    res.status(500).json({ error: 'Error while fetching farms gateway api.' });
  }
}
