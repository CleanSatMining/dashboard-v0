import { FC, memo, useEffect, useState } from 'react';

import { SimpleGrid } from '@mantine/core';
import {
  IconBuildingFactory,
  IconCoinBitcoin,
  IconCoins,
  IconMoneybag,
} from '@tabler/icons';

import { CSMStates } from 'src/types/CSMState';

import {
  formatBTC,
  formatPercent,
  formatUsd,
} from '../../../utils/format/format';
import { AssetCard, Data } from '../Asset/AssetCard';
import {
  getUserAssetValue,
  getUserSiteIds,
  getUserYield,
} from '../Utils/yield';

type AssetProps = {
  btcPrice: number;
  states: CSMStates;
  period: number;
  account?: string;
};

const _AssetGrid: FC<AssetProps> = ({ account, btcPrice, states, period }) => {
  const [address, setAddress] = useState(account);

  useEffect(() => {
    setAddress(account);
  }, [account]);

  const dataTokens: Data[] = [];

  const dataSites: Data[] = [];

  const dataBTC: Data[] = [];

  const dataAPR: Data[] = [];

  const {
    apr: yieldApr,
    btc: yieldBtc,
    usd: yieldUsd,
  } = getUserYield(states, period, btcPrice);

  const assetValue = getUserAssetValue(states);
  const numberOfSite = getUserSiteIds(states).length;

  return (
    <SimpleGrid cols={4} sx={{ marginBottom: '50px' }}>
      <AssetCard
        title={'Tokens'}
        value={formatUsd(assetValue.usd)}
        data={dataTokens}
        Icon={IconCoins}
      ></AssetCard>
      <AssetCard
        title={'Sites'}
        value={numberOfSite.toString()}
        data={dataSites}
        Icon={IconBuildingFactory}
      ></AssetCard>
      <AssetCard
        title={'Revenus'}
        value={formatBTC(yieldBtc)}
        subValue={formatUsd(yieldUsd)}
        data={dataBTC}
        Icon={IconCoinBitcoin}
      ></AssetCard>
      <AssetCard
        title={'APR'}
        value={formatPercent(yieldApr)}
        Icon={IconMoneybag}
        data={dataAPR}
      ></AssetCard>
    </SimpleGrid>
  );
};

export const AssetGrid = memo(_AssetGrid);
