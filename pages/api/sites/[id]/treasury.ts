// pages/api/getBalance.ts
import { SITES } from 'src/constants/csm';
import { SiteID } from 'src/types/mining/Site';
import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

interface BalanceInfo {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
}

interface BalanceDetails {
  confirmed: number;
  unconfirmed: number;
  received: number;
  utxo: number;
}

interface BalanceResponse {
  balance: BalanceDetails;
}

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
    const xpub = SITES[id as SiteID].vault.xpub;

    if (!bitcoinAddress && !xpub) {
      return res
        .status(400)
        .json({ error: "L'adresse Bitcoin ou xpub est requise." });
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

    let response = null;
    let data: BalanceInfo | null = null;
    if (xpub) {
      response = await fetch(
        `https://api.haskoin.com/btc/xpub/${xpub}?derive=segwit&nocache=true`,
      );
      const xpubData: BalanceResponse = await response.json();
      data = {
        address: xpub,
        total_received: 0,
        total_sent: 0,
        balance: xpubData.balance.confirmed,
        unconfirmed_balance: xpubData.balance.unconfirmed,
        final_balance: xpubData.balance.confirmed,
        n_tx: 0,
        unconfirmed_n_tx: 0,
        final_n_tx: 0,
      };
    } else {
      response = await fetch(
        `https://api.blockcypher.com/v1/btc/main/addrs/${bitcoinAddress}/balance`,
      );
      data = await response.json();
    }

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
