import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import 'firebase/firestore';
import {
  collection,
  getDocs,
  getDoc,
  DocumentReference,
} from 'firebase/firestore/lite';
import { db } from 'src/database/firebase';
import { CleanSatMiningSite, Operator } from 'src/types/mining/Site';
import { SITES, SiteID } from 'src/constants/csm';

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

    if (!id) {
      return res.status(400).json({ error: "L'id du site est requis." });
    }

    const cacheKey = `site_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    const data = await getSite(id as string);

    if (!data) {
      return res.status(404).json({ error: 'Site non trouvé.' });
    }

    // Mettre en cache la réponse pour la durée spécifiée
    cache.set(cacheKey, data);

    console.log('PASS NO CACHE');

    res.status(200).json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des depenses :', error);
    res
      .status(500)
      .json({ error: 'Erreur serveur lors de la récupération des depense.' });
  }
}

/* eslint-disable */
async function getSite(
  siteId: string,
): Promise<CleanSatMiningSite | undefined> {
  const siteCol = collection(db, `sites`);
  console.log('siteCol passed');
  const siteSnapshot = await getDocs(siteCol);
  const site = siteSnapshot.docs
    .map((doc) => doc.data())
    .find((site) => site.id === siteId) as CleanSatMiningSite;

  //console.log('Firebase  site', siteId, JSON.stringify(site, null, 4));

  let operatorData: Operator | undefined = undefined;

  if (site) {
    const operatorRef = site.operator as unknown as DocumentReference;
    const operatorDoc = await getDoc(operatorRef);

    if (operatorDoc.exists()) {
      operatorData = operatorDoc.data() as Operator;
    } else {
      console.log(
        "Aucun document trouvé avec l'ID bbgs dans la collection operators",
      );
    }
  }

  return {
    id: site.id,
    name: site.name,
    shortName: site.shortName,
    operator: operatorData,
    data: SITES[siteId as SiteID],
  };
}
