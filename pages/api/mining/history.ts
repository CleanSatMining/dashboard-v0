import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { SITES, SiteID } from 'src/constants/csm';

import {
  APIMiningHistoryQuery,
  APIMiningHistoryResponse,
} from '../../../src/types/Mining';

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
  let json = '[]';
  const requestBody: APIMiningHistoryQuery = JSON.parse(req.body);
  const { first, siteId } = requestBody;

  const site = SITES[siteId as SiteID];
  const username = site.api.username ?? '';
  const url = site.api.url ?? '';

  console.log('siteId', siteId);
  console.log('first', first);
  console.log('username', username);
  console.log('url', url);

  if (site.api.username && site.api.url) {
    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'x-lux-api-key': process.env.LUXOR_API_KEY_ACCOUNT ?? '', //'lxk.7bbaeccc6dedd8c2032a7268a8e7d027',
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
        json = JSON.stringify(history);
      } else {
        const erreur = {
          message: await result.json(),
        };
        json = JSON.stringify(erreur);
      }
    } catch (err) {
      console.log('Revenu summary error');
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
    json = JSON.stringify(history);
  }

  res.status(200).json(json);
};
export default handler;
