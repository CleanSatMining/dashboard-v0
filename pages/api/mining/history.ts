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

  if (!req.body) {
    return res.status(400).json('body expected');
  }

  let requestBody: APIMiningHistoryQuery = req.body;
  if (typeof req.body === 'string') {
    requestBody = JSON.parse(req.body);
  }

  const { first, siteId } = requestBody;
  if (!first || !siteId) {
    return res
      .status(400)
      .json('body not valid ' + JSON.stringify(requestBody));
  }

  const site = SITES[siteId as SiteID];
  const username = site.api.username ?? '';
  const url = site.api.url ?? '';
  const pool = site.api.contractor;

  console.log('API MINING siteId', siteId);
  console.log('API MINING first', first);
  console.log('API MINING username', username);
  console.log('API MINING url', url);

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

  //if (siteId === '2') console.log('BETA RESULT', JSON.stringify(json, null, 4));

  res.status(200).json(json);
};
export default handler;
