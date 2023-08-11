import { useEffect, useState } from 'react';

import { API_BITCOIN_ORACLE } from '../constants/apis';

interface BitcoinOracle {
  price: number;
}

export const useBitcoinOracle = (): BitcoinOracle => {
  const [bitcoinPrice, setBitcoinPrice] = useState<BitcoinOracle | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const getMiningSummary = async (): Promise<BitcoinOracle> => {
        return new Promise<BitcoinOracle>(async (resolve, reject) => {
          {
            try {
              const body = {};

              const result = await fetch(API_BITCOIN_ORACLE.url, {
                method: API_BITCOIN_ORACLE.method,
                body: JSON.stringify(body),
              });

              if (result.ok) {
                const bitcoinOracle: BitcoinOracle = await result.json();
                //console.log(JSON.stringify(bitcoinOracle, null, 4));
                resolve(bitcoinOracle);
              } else {
                reject('Failed to fetch bitcoin oracle');
              }
            } catch (err) {
              console.log('Failed to fetch bitcoin oracle: ', err);
              reject(err);
            }
          }
        });
      };
      const data = await getMiningSummary();
      setBitcoinPrice(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return bitcoinPrice ?? { price: 0 };
};
