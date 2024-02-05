import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';
import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { Expense } from 'src/types/mining/Mining';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY ?? '',
  authDomain: process.env.FIREBASE_API_DOMAIN ?? '',
  projectId: process.env.FIREBASE_API_PROJECT_ID ?? '',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.FIREBASE_APP_ID ?? '',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

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

    const cacheKey = `expenses_${id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      console.log('PASS WITH CACHE');
      return res.status(200).json(cachedData);
    }

    const data = await getExpenses(id as string);

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

async function getExpenses(siteId: string): Promise<Expense[]> {
  const expensesCol = collection(db, `sites/${siteId}/expenses`);
  const expenseSnapshot = await getDocs(expensesCol);
  const expenseList = expenseSnapshot.docs.map((doc) => doc.data());

  const ret = expenseList.map((expense) => {
    const dateSeconde = expense.date.seconds as string;

    const e: Expense = {
      csm: expense.csm as number,
      operator: expense.operator as number,
      electricity: expense.electricity as number,
      dateTime: parseInt(dateSeconde) * 1000,
      siteId: siteId,
    };

    return e;
  });

  console.log('Firebase expenses site', siteId, JSON.stringify(ret, null, 4));

  return ret;
}
