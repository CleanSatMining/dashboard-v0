import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

import { ADMIN_ADDRESSES } from './admin';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { address } = req.query;
  let status = false;

  if (ADMIN_ADDRESSES.includes(address.toString())) {
    status = true;
  }

  const response = {
    admin: status,
    address: address,
  };

  res.status(200).json(response);
};
export default handler;
