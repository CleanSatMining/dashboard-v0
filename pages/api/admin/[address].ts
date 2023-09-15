import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { address } = req.query;
  let status = false;

  const ADMIN_LIST: string[] = (process.env.CSM_ADMIN_LIST ?? '').split(',');
  console.log(
    'ADMIN_LIST',
    ADMIN_LIST.map((a) => a.toLowerCase()),
    'admin',
    address.toString().toLowerCase()
  );
  if (
    ADMIN_LIST.map((a) => a.toLowerCase()).includes(
      address.toString().toLowerCase()
    )
  ) {
    status = true;
  }

  const response = {
    admin: status,
    address: address,
  };

  res.status(200).json(response);
};
export default handler;
