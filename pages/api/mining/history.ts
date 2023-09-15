import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { SITES, SiteID } from 'src/constants/csm';
import {
  APIMiningHistoryQuery,
  APIMiningHistoryResponse,
} from 'src/types/mining/MiningAPI';
import { Contractor } from 'src/types/mining/Site';

import { antpoolHistory } from './pool/antpool';
import { luxorHistory } from './pool/luxor';

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

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let json;
  const requestBody: APIMiningHistoryQuery = JSON.parse(req.body);
  const { first, siteId } = requestBody;

  const site = SITES[siteId as SiteID];
  const username = site.api.username ?? '';
  const url = site.api.url ?? '';
  const pool = site.api.contractor;

  console.log('siteId', siteId);
  console.log('first', first);
  console.log('username', username);
  console.log('url', url);

  if (username && url && pool) {
    switch (pool) {
      case Contractor.LUXOR: {
        json = await luxorHistory(url, username, first);
        break;
      }
      case Contractor.ANTPOOL: {
        json = await antpoolHistory(url, username, first, siteId);
        break;
      }
      default: {
        //statements;
        console.warn('API SUMMARY : unknown pool' + pool + ' siteId' + siteId);
        break;
      }
    }
  } else {
    console.log(
      'WARN : No url or user defined',
      site.api.username,
      site.api.url
    );
    const history = {
      days: [],
    };
    json = history; //JSON.stringify(history);
  }

  res.status(200).json(json);
};
export default handler;

async function luxorHistory0(url: string, username: string, first: number) {
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
      console.log(JSON.stringify(response, null, 4));
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
