import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import axios from 'axios';

interface Quote {
  price: number;
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let json;

  try {
    const result = await axios.get(
      'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1',
      {
        headers: {
          'X-CMC_PRO_API_KEY':
            process.env.COINMARKETCAP_API_KEY ??
            '4e5c1fcf-371a-4b87-b31f-0270134adbb3',
        },
      }
    );

    if (result) {
      // success
      json = result.data;
      console.log(JSON.stringify(json, null, 4));
      json = JSON.parse(json);
    }
  } catch (err) {
    console.log('coinmarket cap API error');
  }
  const quote: Quote = {
    price: json.data['1'].quote['USD'].price,
  };

  res.status(200).json(quote);
};
export default handler;
