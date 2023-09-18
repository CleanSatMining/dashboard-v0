import { FC, memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBuildingFactory,
  IconCoinBitcoin,
  IconCoins,
  IconTrendingUp,
} from '@tabler/icons';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectMiningState } from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';
import { Yield } from 'src/types/mining/Site';

import {
  formatBTC,
  formatPercent,
  formatUsd,
} from '../../../utils/format/format';
import { AssetCard, Data } from '../Summary/SummaryCard';
import {
  getUserInvestment,
  getUserSiteIds,
  getUserYield,
} from '../Utils/yield';

type AssetProps = {
  btcPrice: number;
  period: number;
  account: string;
};

const _Summary: FC<AssetProps> = ({ btcPrice, period, account }) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningState);
  const [userYield, setUserYield] = useState<Yield>(
    getUserYield(miningState, usersState, account, period, btcPrice),
  );

  //console.log('REDUX USERS', JSON.stringify(usersState, null, 4));
  //console.log('REDUX SITEs', JSON.stringify(miningState, null, 4));

  const dataTokens: Data[] = [];

  const dataSites: Data[] = [];

  const dataBTC: Data[] = [];

  const dataAPR: Data[] = [];

  const numberOfSite = getUserSiteIds(usersState, account).length;
  const investment = getUserInvestment(usersState, account);

  // console.log(
  //   'REDUX',
  //   numberOfSite,
  //   investment.toNumber(),
  //   userYield.usd,
  //   userYield.btc,
  //   userYield.apr
  // );

  useEffect(() => {
    setUserYield(
      getUserYield(miningState, usersState, account, period, btcPrice),
    );
  }, [usersState, miningState, account, btcPrice, period]);

  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { minWidth: 'xs', cols: 2 },
        { minWidth: 'sm', cols: 2 },
        { minWidth: 'md', cols: 3 },
        { minWidth: 1200, cols: 4 },
      ]}
      spacing={isMobile ? 'xs' : undefined}
      sx={{ marginBottom: isMobile ? '20px' : '50px' }}
    >
      <AssetCard
        title={t('my-tokens')}
        value={formatUsd(investment.toNumber())}
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
        value={formatBTC(userYield.btc)}
        subValue={formatUsd(userYield.usd)}
        data={dataBTC}
        Icon={IconCoinBitcoin}
      ></AssetCard>
      <AssetCard
        title={t('my-apy')}
        value={formatPercent(userYield.apr)}
        Icon={IconTrendingUp}
        data={dataAPR}
      ></AssetCard>
    </SimpleGrid>
  );
};

export const SummaryGrid = memo(_Summary);
