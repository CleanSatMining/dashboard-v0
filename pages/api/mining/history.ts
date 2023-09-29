import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { SITES, SiteID } from 'src/constants/csm';
import { APIMiningHistoryQuery } from 'src/types/mining/MiningAPI';
import { Contractor } from 'src/types/mining/Site';

import { antpoolHistory } from './pool/antpool';
import { luxorHistory } from './pool/luxor';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
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
      site.api.url,
    );
    const history = {
      days: [],
    };
    json = history; //JSON.stringify(history);
  }

  res.status(200).json(json);
};
export default handler;
