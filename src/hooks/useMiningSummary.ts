import { useEffect, useState } from 'react';

import { APIMiningSummaryQuery, Duration } from '../types/Mining';

interface ResultMiningSummary {
  data: { getMiningSummary: MiningSummary };
}

export interface MiningSummary {
  username: string;
  validShares: string;
  invalidShares: string;
  networkDiff: string;
  staleShares: string;
  lowDiffShares: string;
  badShares: string;
  duplicateShares: string;
  revenue: number;
  hashrate: number;
}

interface UseMiningSummary {
  summary: MiningSummary | undefined;
}

export const useMiningSummary = (
  username: string,
  duration: Duration
): UseMiningSummary => {
  const [miningSummary, setMiningSummary] = useState<MiningSummary | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      const getMiningSummary = async (): Promise<MiningSummary> => {
        return new Promise<MiningSummary>(async (resolve, reject) => {
          console.log('https://api.beta.luxor.tech/graphql', username);
          {
            try {
              const body: APIMiningSummaryQuery = {
                username,
                duration,
              };

              const result = await fetch('/api/mining/summary', {
                method: 'POST',
                body: JSON.stringify(body),
              });

              if (result.ok) {
                const miningSummary: ResultMiningSummary = await result.json();
                console.log(JSON.stringify(miningSummary, null, 4));
                resolve(miningSummary.data.getMiningSummary);
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
      setMiningSummary(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [username, duration]);

  return {
    summary: miningSummary,
  };
};

interface UseMiningSummaries {
  summaries: MiningSummary[] | undefined;
}

export const useMiningSummaries = (
  username: string,
  durations: Duration[]
): UseMiningSummaries => {
  const [miningSummaries, setMiningSummaries] = useState<
    MiningSummary[] | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const getMiningSummary = async (): Promise<MiningSummary[]> => {
        return new Promise<MiningSummary[]>(async (resolve, reject) => {
          console.log('https://api.beta.luxor.tech/graphql', username);
          const summaries: MiningSummary[] = [];
          if (username !== '') {
            for (const duration of durations) {
              try {
                const body: APIMiningSummaryQuery = {
                  username,
                  duration,
                };

                const result = await fetch('/api/mining/summary', {
                  method: 'POST',
                  body: JSON.stringify(body),
                });

                if (result.ok) {
                  const miningSummary: ResultMiningSummary =
                    await result.json();
                  console.log(JSON.stringify(miningSummary, null, 4));
                  summaries.push(miningSummary.data.getMiningSummary);
                } else {
                  reject('Failed to fetch mining summary from luxor');
                }
              } catch (err) {
                console.log('Failed to fetch mining summary from luxor: ', err);
                reject(err);
              }
            }
          }

          resolve(summaries);
        });
      };
      const data = await getMiningSummary();
      setMiningSummaries(data);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [username, durations]);

  return {
    summaries: miningSummaries,
  };
};
