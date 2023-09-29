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
import { ACTIVATE_DISPLAY_APY } from 'src/constants/csm';

import {
  formatBTC,
  formatPercent,
  formatUsd,
} from '../../../utils/format/format';
import { getSite } from '../Utils/site';
import { SummaryCard } from '../Summary/SummaryCard';
import { Data } from '../Summary/SummaryType';
import {
  getUserInvestment,
  getUserSiteIds,
  getUserYield,
  getUserYieldBySite,
  getUserTokenBalance,
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
  const [userYield, setUserYield] = useState<{ net: Yield; gross: Yield }>(
    getUserYield(miningState, usersState, account, period, btcPrice),
  );

  //console.log('REDUX USERS', JSON.stringify(usersState, null, 4));
  //console.log('REDUX SITEs', JSON.stringify(miningState, null, 4));

  const siteIds = getUserSiteIds(usersState, account);
  const investment = getUserInvestment(usersState, account);
  const numberOfSite = siteIds.length;

  const dataTokens: Data[] = [];

  const dataSites: Data[] = [];

  const dataIncomeNet: Data[] = [];

  const dataIncomeGross: Data[] = [];

  const dataAPR: Data[] = [];

  for (const siteId of siteIds) {
    const token = getUserTokenBalance(usersState, account, siteId);
    const site = getSite(siteId);
    const yields = getUserYieldBySite(
      miningState,
      usersState,
      siteId,
      account,
      period,
      btcPrice,
    );

    const dataToken: Data = {
      label: token.symbol,
      value: formatUsd(token.usd),
    };
    const dataSite: Data = { label: site.name, value: t(site.location) };
    const dataYieldNet: Data = {
      label: site.name,
      value: formatBTC(yields.net.btc),
    };

    const dataYieldGross: Data = {
      label: site.name,
      value: formatBTC(yields.gross.btc),
    };

    dataTokens.push(dataToken);
    dataSites.push(dataSite);
    dataIncomeNet.push(dataYieldNet);
    dataIncomeGross.push(dataYieldGross);
  }

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
        { minWidth: 1200, cols: ACTIVATE_DISPLAY_APY ? 5 : 4 },
      ]}
      spacing={isMobile ? 'xs' : undefined}
      sx={{ marginBottom: isMobile ? '20px' : '50px' }}
    >
      <SummaryCard
        title={t('my-tokens')}
        value={formatUsd(investment.toNumber())}
        data={dataTokens}
        Icon={IconCoins}
      ></SummaryCard>
      <SummaryCard
        title={t('my-sites')}
        value={numberOfSite.toString()}
        data={dataSites}
        Icon={IconBuildingFactory}
      ></SummaryCard>
      {/* {!isMobile && (
        <SummariesCard
          title={t('my-yield')}
          valueTitle1={t('income-net')}
          value1={formatBTC(userYield.net.btc)}
          subValue1={formatUsd(userYield.net.usd)}
          valueTitle2={t('income-gross')}
          value2={formatBTC(userYield.gross.btc)}
          subValue2={formatUsd(userYield.gross.usd)}
          data={dataIncomeNet}
          Icon={IconCoinBitcoin}
        ></SummariesCard>
      )} */}
      {
        <>
          <SummaryCard
            title={t('incomes-net')}
            toolTip={t('income-net-explained')}
            value={formatBTC(userYield.net.btc)}
            subValue={formatUsd(userYield.net.usd)}
            data={dataIncomeNet}
            Icon={IconCoinBitcoin}
            warning={userYield.net.usd < 0}
          ></SummaryCard>
          <SummaryCard
            title={t('incomes-gross')}
            toolTip={t('income-gross-explained')}
            value={formatBTC(userYield.gross.btc)}
            subValue={formatUsd(userYield.gross.usd)}
            data={dataIncomeGross}
            Icon={IconCoinBitcoin}
          ></SummaryCard>
        </>
      }
      {ACTIVATE_DISPLAY_APY && (
        <SummaryCard
          title={t('my-yield')}
          value={formatPercent(userYield.net.apr)}
          Icon={IconTrendingUp}
          data={dataAPR}
        ></SummaryCard>
      )}
    </SimpleGrid>
  );
};

export const SummaryGrid = memo(_Summary);
