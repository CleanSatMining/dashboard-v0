import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { error } from 'console';

import { APIMiningSummaryQuery } from '../../../src/types/Mining';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let json = '';
  let inputDuration = '_1_DAY';
  const requestBody: APIMiningSummaryQuery = JSON.parse(req.body);
  const { username, duration } = requestBody;
  console.log('username', username);
  console.log('duration', JSON.stringify(duration));

  if (duration.days !== undefined && duration.days > 0) {
    inputDuration = '_1_DAY';
  } else if (duration.hours !== undefined && duration.hours < 6) {
    inputDuration = '_1_HOUR';
  } else if (duration.hours !== undefined && duration.hours > 0) {
    inputDuration = '_6_HOUR';
  }

  try {
    const result = await fetch('https://api.beta.luxor.tech/graphql', {
      method: 'POST',
      headers: {
        'x-lux-api-key':
          process.env.LUXOR_API_KEY_ACCOUNT ??
          'lxk.7bbaeccc6dedd8c2032a7268a8e7d027',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
  
        query getMiningSummary($mpn: MiningProfileName!, $userName: String!, $inputDuration: HashrateIntervals!) {
          getMiningSummary(mpn: $mpn, userName: $userName, inputDuration: $inputDuration) {
             username
             validShares
             invalidShares
             staleShares
             lowDiffShares
             badShares
             duplicateShares
             revenue
             hashrate
          }
        }
          `,
        variables: {
          userName: username,
          mpn: 'BTC',
          inputDuration: inputDuration, //other options are: "_1_HOUR", "_6_HOUR" and "_1_DAY"
        },
      }),
    });

    if (result.ok) {
      json = await result.json();
      console.log(JSON.stringify(json, null, 4));
    } else {
      const erreur = {
        message: await result.json(),
      };
      json = JSON.stringify(erreur);
    }
  } catch (err) {
    console.log('Luxor revenu summary error');
  }
  res.status(200).json(json);
};
export default handler;
