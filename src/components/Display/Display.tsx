import React, { FC, useState } from 'react';

import { Displays } from 'src/types/Displays';

import { useBitcoinOracle } from '../../hooks/useHashrate';
import { AssetGrid } from '../CSM/Grid/AssetGrid';
import { SiteGrid } from '../CSM/Grid/SiteGrid';
import { AddressInput } from '../CSM/TestOnly/UserInput';

interface Display {
  display: Displays;
  title: string;
  component: React.ReactElement;
}
const Display: FC = () => {
  const [account, setAccount] = useState(
    '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0'
  );
  //const { bitcoinOverviews } = useBitcoinOverviews();
  const { price } = useBitcoinOracle();
  //console.log(JSON.stringify(bitcoinOverviews));
  return (
    <>
      <AddressInput
        address={'0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0'}
        setAccount={setAccount}
      ></AddressInput>
      <AssetGrid account={account} btcPrice={price}></AssetGrid>
      <SiteGrid account={account} btcPrice={price}></SiteGrid>
    </>
  );
};
export default Display;
