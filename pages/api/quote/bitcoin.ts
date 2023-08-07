import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

type PriceResponse = {
  data: {
    getChartBySlug: {
      data: [
        {
          timestamp: string;
          open: number;
          high: number;
          low: number;
          close: number;
        }
      ];
    };
  };
};

interface Quote {
  price: number;
}

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
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
      query get_ohlc_prices($inputInterval: ChartsInterval, $inputSlug: String) {
        getChartBySlug(inputInterval: $inputInterval, inputSlug: $inputSlug) {
            data
        }
    }`,
        variables: { inputInterval: '_1_DAY', inputSlug: 'bitcoin-ohlc' },
      }),
    });

    if (result.ok) {
      const response: PriceResponse = await result.json();
      console.log('Bitcoin Quote', JSON.stringify(response, null, 4));
      const quote: Quote = {
        price: response.data.getChartBySlug.data[0].close,
      };
      json = JSON.stringify(quote);
    } else {
      const erreur = {
        message: await result.json(),
      };
      json = JSON.stringify(erreur);
    }
  } catch (err) {
    console.log('Error api BTC price');
  }
  res.status(200).json(json);
};
export default handler;
