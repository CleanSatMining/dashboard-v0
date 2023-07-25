import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ADMIN_ADDRESSES: string[] = [
  '0xED9E4DFFa08573AA7AbFd9cf891cb9238956E39B',
];

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
