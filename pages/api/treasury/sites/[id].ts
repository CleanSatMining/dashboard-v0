// pages/api/getBalance.ts
import { SITES, SiteID } from 'src/constants/csm';
import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

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
  try {
    const { id } = req.query;
    const bitcoinAddress = SITES[id as SiteID].vault.btcAddress;

    if (!bitcoinAddress) {
      return res.status(400).json({ error: "L'adresse Bitcoin est requise." });
    }

    const cacheKey = `balance_${bitcoinAddress}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    // const response = await fetch(
    //   `https://blockchain.info/rawaddr/${bitcoinAddress}`,
    // );

    const response = await fetch(
      `https://api.blockcypher.com/v1/btc/main/addrs/${bitcoinAddress}/balance`,
    );

    const data = await response.json();

    // Mettre en cache la réponse pour la durée spécifiée
    cache.set(cacheKey, data);

    console.log('PASS NO CACHE');

    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération de la balance :', error);
    res
      .status(500)
      .json({ error: 'Erreur serveur lors de la récupération de la balance.' });
  }
}
