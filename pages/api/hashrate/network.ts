import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  let json = '';

  try {
    const result = await fetch('https://api.hashrateindex.com/graphql', {
      method: 'POST',
      headers: {
        'x-hi-api-key': process.env.LUXOR_API_KEY_HASHRATE ?? '', //'hi.348b7c0e9abaa8579be589ff860d4cd7',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query get_network_hashrate($inputInterval: ChartsInterval!, $first: Int) {
          getNetworkHashrate(inputInterval: $inputInterval, first: $first) {
              nodes {
                  timestamp
                  networkHashrate
              }
          }
      }`,
        variables: { first: 1, inputInterval: '_1_DAY' },
      }),
    });

    json = await result.json();
  } catch (err) {
    console.log('hashrate index error');
  }
  res.status(200).json(json);
};
export default handler;
