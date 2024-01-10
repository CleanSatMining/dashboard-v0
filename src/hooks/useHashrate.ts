import { useEffect, useState } from 'react';

import { API_NETWORK_OVERVIEW } from '../constants/apis';

export interface NetworkOverview {
  timestamp: number;
  hashpriceUsd: number;
  networkHashrate7D: number;
  networkDiff: number;
  estDiffAdj: number;
  coinbaseRewards24H: number;
  feesBlocks24H: number;
  marketcap: number;
  nextHalvingCount: number;
  nextHalvingDate: number;
  txRateAvg7D: number;
}

interface ApiNetworkOverview {
  data: {
    bitcoinOverviews: {
      nodes: NetworkOverview[];
    };
  };
}

interface Network {
  overview: NetworkOverview;
  isLoading: boolean;
}

export const useHashrate = (): Network => {
  const [networkOverview, setNetworkOverview] = useState<
    NetworkOverview | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const getNetworkOverview = async (): Promise<NetworkOverview> => {
        return new Promise<NetworkOverview>(async (resolve, reject) => {
          {
            setIsLoading(true);
            try {
              const body = {};

              const result = await fetch(API_NETWORK_OVERVIEW.url, {
                method: API_NETWORK_OVERVIEW.method,
                body: JSON.stringify(body),
              });

              if (result.ok) {
                const overview: ApiNetworkOverview = await result.json();
                console.log(
                  'getNetworkOverview',
                  JSON.stringify(overview, null, 4),
                );
                resolve(overview.data.bitcoinOverviews.nodes[0]);
              } else {
                reject('Failed to fetch bitcoin oracle');
              }
              setIsLoading(false);
            } catch (err) {
              console.log('Failed to fetch bitcoin oracle: ', err);
              setIsLoading(false);
              reject(err);
            }
          }
        });
      };
      const data = await getNetworkOverview();
      setNetworkOverview(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, []);

  return {
    overview: networkOverview ?? {
      timestamp: 0,
      hashpriceUsd: 0,
      networkHashrate7D: 0,
      networkDiff: 0,
      estDiffAdj: 0,
      coinbaseRewards24H: 0,
      feesBlocks24H: 0,
      marketcap: 0,
      nextHalvingCount: 0,
      nextHalvingDate: 0,
      txRateAvg7D: 0,
    },
    isLoading: isLoading,
  };
};
