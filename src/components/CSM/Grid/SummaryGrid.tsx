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
import { SummaryCard } from '../Card/SummaryCard/SummaryCard';
import { NFTCard } from '../Card/NFTCard';
import { Data } from '../Card/SummaryCard/SummaryType';
import {
  getUserInvestment,
  getUserSiteIds,
  getUserYield,
  getUserYieldBySite,
  getUserTokenBalance,
} from '../Utils/yield';
import { useNFTs } from 'src/hooks/useWalletNft';

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
  const NFT = useNFTs('0x765495Be1E0c23447163f6402D17dEbc9eCeF0E2', account);
  console.log('NFT', JSON.stringify(NFT, null, 4));

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
    const dataSite: Data = {
      label: site.name,
      value: t(site.location.name),
    };
    const dataYieldNet: Data = {
      label: token.symbol, //site.name,
      value: formatBTC(yields.net.btc),
    };

    const dataYieldGross: Data = {
      label: token.symbol, // site.name,
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
      sx={{ marginBottom: isMobile ? '10px' : '20px' }}
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
      {
        <>
          <SummaryCard
            title={isMobile ? t('incomes-net-short') : t('incomes-net')}
            toolTip={t('income-net-explained')}
            value={formatBTC(userYield.net.btc)}
            subValue={formatUsd(userYield.net.usd)}
            data={dataIncomeNet}
            Icon={IconCoinBitcoin}
            warning={userYield.net.usd < 0}
          ></SummaryCard>
          <SummaryCard
            title={isMobile ? t('incomes-gross-short') : t('incomes-gross')}
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
      {NFT.balance > 0 && (
        <NFTCard data={NFT.metadata} title={NFT.collectionName}></NFTCard>
      )}
    </SimpleGrid>
  );
};

export const SummaryGrid = memo(_Summary);
