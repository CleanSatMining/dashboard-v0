import { useEffect, useState } from 'react';

interface BitcoinOverviews {
  timestamp: string;
  hashpriceUsd: string;
  networkHashrate7D: string;
  networkDiff: string;
  coinbaseRewards24H: string;
  feesBlocks24H: string;
  marketcap: string;
  nextHalvingCount: number;
  nextHalvingDate: string;
  txRateAvg7D: string;
}

interface UseBitcoinOverviews {
  bitcoinOverviews: BitcoinOverviews | undefined;
}

interface BitcoinOracle {
  price: number;
}

export const useBitcoinOverviews = (): UseBitcoinOverviews => {
  const [bitcoinOverviews, setBitcoinOverviews] = useState<
    BitcoinOverviews | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const getBitcoinOverviews = async (): Promise<BitcoinOverviews> => {
        return new Promise<BitcoinOverviews>(async (resolve, reject) => {
          try {
            const result = await fetch(
              'https://api.hashrateindex.com/graphql',
              {
                method: 'POST',
                headers: {
                  'x-hi-api-key': 'hi.348b7c0e9abaa8579be589ff860d4cd7',
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
              }
            );

            if (result.ok) {
              const bitcoinOverviews: BitcoinOverviews = await result.json();
              resolve(bitcoinOverviews);
            } else {
              reject('Failed to fetch bitcoin hasrate overviews from luxor');
            }
          } catch (err) {
            console.log('Failed to get wallet balance: ', err);
            reject(err);
          }
        });
      };
      const data = await getBitcoinOverviews();
      setBitcoinOverviews(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return {
    bitcoinOverviews,
  };
};

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

              const result = await fetch('/api/quote/bitcoin', {
                method: 'POST',
                body: JSON.stringify(body),
              });

              if (result.ok) {
                const bitcoinOracle: BitcoinOracle = await result.json();
                console.log(JSON.stringify(bitcoinOracle, null, 4));
                resolve(bitcoinOracle);
              } else {
                reject('Failed to fetch mining summary from luxor');
              }
            } catch (err) {
              console.log('Failed to fetch mining summary from luxor: ', err);
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
