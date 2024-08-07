// pages/api/getBalance.ts
import { SITES } from 'src/constants/csm';
import { SiteID, Site } from 'src/types/mining/Site';
import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { fetchBicoinOverview } from 'pages/api/hashrate/overview';
import { fetchBitcoinPrice } from 'pages/api/quote/bitcoin';
import BigNumber from 'bignumber.js';

interface Overview {
  networkExaHashrate: number;
  bitcoinValue: number;
  networkTransactionFees: number;
  asicsHashrate: number;
  asicsPower: number;
  electricityPriceKwh: number;
  containerUnitNumber: number;
  operatorFeesRate: number;
  csmFeesRate: number;
  csmOperationalFeesRate: number;
  poolFees: number;
  isRate: number;
  provisionRate: number;
  asics: number;
  vat: number;
  miscellaneousEquipment: number;
  totalInvestment: number;
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
    const site = SITES[id as SiteID];

    const cacheKey = `overview_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    const bitchoinOverview = await fetchBicoinOverview();
    const bitcoinPrice = await fetchBitcoinPrice();

    const data: Overview = {
      networkExaHashrate: bitchoinOverview
        ? new BigNumber(bitchoinOverview.networkHashrate7D)
            .dividedBy(1000000)
            .toNumber()
        : 0,
      bitcoinValue: bitcoinPrice ? bitcoinPrice.price : 0,
      networkTransactionFees: bitchoinOverview
        ? bitchoinOverview.feesBlocks24H
        : 0,
      asicsHashrate: site.mining.asics.reduce(
        (acc, asic) =>
          new BigNumber(acc)
            .plus(
              new BigNumber(asic.hashrateHs)
                .dividedBy(new BigNumber(1000000000000))
                .times(asic.units),
            )
            .toNumber(),
        0,
      ),
      asicsPower: site.mining.asics.reduce(
        (acc, asic) => acc + asic.powerW * asic.units,
        0,
      ),
      electricityPriceKwh: site.mining.electricity.usdPricePerKWH,
      containerUnitNumber: site.mining.asics.reduce(
        (acc, asic) => acc + asic.units,
        0,
      ),
      operatorFeesRate: site.fees.operational.operator.rate,
      csmFeesRate: site.fees.operational.csm,
      csmOperationalFeesRate: site.fees.crowdfunding.csm,
      poolFees: site.fees.operational.pool,
      isRate: site.fees.operational.taxe,
      provisionRate: site.fees.operational.provision,
      asics: site.mining.asics.reduce(
        (acc, asic) => acc + asic.intallationCosts.equipement,
        0,
      ),
      vat: 0,
      miscellaneousEquipment: 0,
      totalInvestment: site.mining.asics.reduce(
        (acc, asic) => acc + asic.intallationCosts.total,
        0,
      ),
    };

    // Mettre en cache la réponse pour la durée spécifiée
    cache.set(cacheKey, data);

    console.log('PASS NO CACHE');

    res.status(200).json(data);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données de la ferme :',
      error,
    );
    res.status(500).json({
      error: 'Erreur serveur lors de la récupération des données de la ferme.',
    });
  }
}
