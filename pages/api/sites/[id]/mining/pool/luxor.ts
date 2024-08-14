import {
  APIMiningHistoryResponse,
  DayDataLuxor,
} from 'src/types/mining/MiningAPI';

interface RevenueHistory {
  data: {
    getHashrateScoreHistory: {
      nodes: DayDataLuxor[];
    };
  };
}

export async function luxorHistory(
  url: string,
  username: string,
  first: number,
  subaccountId: number | undefined,
): Promise<APIMiningHistoryResponse | undefined> {
  let json;
  try {
    console.log(
      'LUXOR API PARAMETERS: x-lux-api-key',
      process.env.LUXOR_API_KEY_ACCOUNT,
    );
    console.log('LUXOR API PARAMETERS: username', username);
    console.log('LUXOR API PARAMETERS: url', url);

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
        updated: new Date().getTime(),
        days: response.data.getHashrateScoreHistory.nodes.map((node) => {
          return {
            subaccountId: subaccountId,
            date: node.date,
            efficiency: node.efficiency,
            hashrate: node.hashrate,
            revenue: node.revenue,
            uptimePercentage: node.uptimePercentage,
            uptimeTotalMinutes: node.uptimeTotalMinutes,
            uptimeTotalMachines: node.uptimeTotalMachines,
          };
        }),
      };
      json = history; // JSON.stringify(history, null);
    } else {
      const erreur: APIMiningHistoryResponse = {
        updated: new Date().getTime(),
        days: [],
        error: await result.json(),
      };
      json = erreur; // JSON.stringify(erreur);
      console.error('LUXOR Revenu summary error' + JSON.stringify(erreur));
    }
  } catch (err) {
    console.error('LUXOR Revenu summary error' + err);
  }
  return json;
}

export async function luxorData(
  url: string,
  username: string,
  first: number,
  subaccountId: number | undefined,
): Promise<any | undefined> {
  let json;
  try {
    console.log(
      'LUXOR API PARAMETERS: x-lux-api-key',
      process.env.LUXOR_API_KEY_ACCOUNT,
    );
    console.log('LUXOR API PARAMETERS: username', username);
    console.log('LUXOR API PARAMETERS: url', url);

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
      const history = {
        updated: new Date().getTime(),
        days: response.data.getHashrateScoreHistory.nodes,
      };
      json = history; // JSON.stringify(history, null);
    } else {
      const erreur: APIMiningHistoryResponse = {
        updated: new Date().getTime(),
        days: [],
        error: await result.json(),
      };
      json = erreur; // JSON.stringify(erreur);
      console.error('LUXOR Revenu summary error' + JSON.stringify(erreur));
    }
  } catch (err) {
    console.error('LUXOR Revenu summary error' + err);
  }
  return json;
}
