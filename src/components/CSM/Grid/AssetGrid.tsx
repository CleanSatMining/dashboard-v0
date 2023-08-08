import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { SimpleGrid } from '@mantine/core';
import {
  IconBuildingFactory,
  IconCoinBitcoin,
  IconCoins,
  IconTrendingUp,
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

const _AssetGrid: FC<AssetProps> = ({ btcPrice, states, period }) => {
  //const [address, setAddress] = useState(account);
  const { t } = useTranslation('site', { keyPrefix: 'card' });

  // useEffect(() => {
  //   setAddress(account);
  // }, [account]);

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
    <SimpleGrid
      breakpoints={[
        { minWidth: 'xs', cols: 1 },
        { minWidth: 'sm', cols: 2 },
        { minWidth: 'md', cols: 3 },
        { minWidth: 1200, cols: 4 },
      ]}
      sx={{ marginBottom: '50px' }}
    >
      <AssetCard
        title={t('my-tokens')}
        value={formatUsd(assetValue.usd)}
        data={dataTokens}
        Icon={IconCoins}
      ></AssetCard>
      <AssetCard
        title={t('my-sites')}
        value={numberOfSite.toString()}
        data={dataSites}
        Icon={IconBuildingFactory}
      ></AssetCard>
      <AssetCard
        title={t('my-yield')}
        value={formatBTC(yieldBtc)}
        subValue={formatUsd(yieldUsd)}
        data={dataBTC}
        Icon={IconCoinBitcoin}
      ></AssetCard>
      <AssetCard
        title={t('my-apy')}
        value={formatPercent(yieldApr)}
        Icon={IconTrendingUp}
        data={dataAPR}
      ></AssetCard>
    </SimpleGrid>
  );
};

export const AssetGrid = memo(_AssetGrid);
