import { FC, memo, useEffect, useState } from 'react';

import { SimpleGrid } from '@mantine/core';
import {
  IconBuildingFactory,
  IconCoinBitcoin,
  IconCoins,
  IconMoneybag,
} from '@tabler/icons';

import { AssetCard, Data } from '../Asset/AssetCard';

type AssetProps = {
  btcPrice: number;
  account?: string;
};

const _AssetGrid: FC<AssetProps> = ({ account, btcPrice }) => {
  const [address, setAddress] = useState(account);

  useEffect(() => {
    setAddress(account);
  }, [account]);

  const dataTokens: Data[] = [
    { label: 'CSM-a', value: '10000$' },
    { label: 'CSM-b', value: '10000$' },
  ];

  const dataSites: Data[] = [
    { label: 'CSM-a', value: '10000' },
    { label: 'CSM-b', value: '10000' },
  ];

  const dataBTC: Data[] = [
    { label: 'CSM-a', value: '0.0001 BTC' },
    { label: 'CSM-b', value: '0.0001 BTC' },
  ];

  return (
    <SimpleGrid cols={4} sx={{ marginBottom: '50px' }}>
      <AssetCard
        title={'Tokens'}
        value={'100000$'}
        data={dataTokens}
        Icon={IconCoins}
      ></AssetCard>
      <AssetCard
        title={'Sites'}
        value={'4'}
        data={dataSites}
        Icon={IconBuildingFactory}
      ></AssetCard>
      <AssetCard
        title={'Revenus'}
        value={'0.002576 BTC'}
        data={dataBTC}
        Icon={IconCoinBitcoin}
      ></AssetCard>
      <AssetCard title={'APR'} value={'20%'} Icon={IconMoneybag}></AssetCard>
    </SimpleGrid>
  );
};

export const AssetGrid = memo(_AssetGrid);
