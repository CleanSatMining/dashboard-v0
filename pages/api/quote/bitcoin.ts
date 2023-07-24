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

// import axios from 'axios';

// interface Quote {
//   price: number;
// }

// const handler: NextApiHandler = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   let json;

//   try {
//     const result = await axios.get(
//       'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=1',
//       {
//         headers: {
//           'X-CMC_PRO_API_KEY':
//             process.env.COINMARKETCAP_API_KEY ??
//             '4e5c1fcf-371a-4b87-b31f-0270134adbb3',
//         },
//       }
//     );

//     if (result) {
//       // success
//       json = result.data;
//       console.log(JSON.stringify(json, null, 4));
//       json = JSON.parse(json);
//     }
//   } catch (err) {
//     console.log('coinmarket cap API error');
//   }
//   const quote: Quote = {
//     price: json.data['1'].quote['USD'].price,
//   };

//   res.status(200).json(quote);
// };
// export default handler;

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  let json = '';
  //const { username } = JSON.parse(req.body);
  //const input: APIMiningSummaryQuery = req.body;
  //input.username;
  //console.log('username', username);
  try {
    const result = await fetch('https://api.hashrateindex.com/graphql', {
      method: 'POST',
      headers: {
        'x-hi-api-key': 'hi.348b7c0e9abaa8579be589ff860d4cd7',
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
