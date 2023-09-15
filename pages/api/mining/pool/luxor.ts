import { APIMiningHistoryResponse } from 'src/types/mining/MiningAPI';

interface RevenueHistory {
  data: {
    getHashrateScoreHistory: {
      nodes: [
        {
          date: string;
          efficiency: number;
          hashrate: number;
          revenue: number;
          uptimePercentage: number;
          uptimeTotalMinutes: number;
          uptimeTotalMachines: number;
        }
      ];
    };
  };
}

export async function luxorHistory(
  url: string,
  username: string,
  first: number
) {
  let json;
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'x-lux-api-key': process.env.LUXOR_API_KEY_ACCOUNT ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
    
          query getHashrateScoreHistory($mpn: MiningProfileName!, $uname: String!, $first : Int) {
            getHashrateScoreHistory(mpn: $mpn, uname: $uname, first: $first, orderBy: DATE_DESC) {
                nodes {
                    date
                    efficiency
                    hashrate
                    revenue
                    uptimePercentage
                    uptimeTotalMinutes
                    uptimeTotalMachines
                  }
                }
          }
            `,
        variables: {
          uname: username,
          mpn: 'BTC',
          first: first,
        },
      }),
    });

    if (result.ok) {
      const response: RevenueHistory = await result.json();
      //console.log(JSON.stringify(response, null, 4));
      const history: APIMiningHistoryResponse = {
        days: response.data.getHashrateScoreHistory.nodes,
      };
      json = history; // JSON.stringify(history, null);
    } else {
      const erreur = {
        message: await result.json(),
      };
      json = erreur; // JSON.stringify(erreur);
      console.error('LUXOR Revenu summary error' + JSON.stringify(erreur));
    }
  } catch (err) {
    console.error('LUXOR Revenu summary error' + err);
  }
  return json;
}
