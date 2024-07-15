import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBuildingFactory,
  IconCoinBitcoin,
  IconCoins,
  IconTrendingUp,
} from '@tabler/icons-react';

import { useAppSelector } from 'src/hooks/react-hooks';
import {
  selectMiningHistory,
  selectMiningExpenses,
} from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';
import { Yield } from 'src/types/mining/Site';
import { ACTIVATE_DISPLAY_APY, TAXE_FREE_MODE } from 'src/constants/csm';

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
  getUserTokenBalanceToCome,
} from '../Utils/yield';
import { useNFTs as useWalletNFTs } from 'src/hooks/useWalletNft';
import { ULTRA_RARE } from 'src/constants/csm';
import { getPeriodFromStart } from 'src/components/CSM/Utils/period';

type AssetProps = {
  btcPrice: number;
  period: number;
  account: string;
  startDate: number;
  endDate: number;
};

const _Summary: FC<AssetProps> = ({
  btcPrice,
  period,
  account,
  startDate,
  endDate,
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningHistory);
  const expensesState = useAppSelector(selectMiningExpenses);
  const [userYield, setUserYield] = useState<{
    net: Yield;
    gross: Yield;
    grossTaxeFree: Yield;
  }>(
    getUserYield(
      miningState,
      usersState,
      account,
      period,
      btcPrice,
      startDate,
      endDate,
      expensesState,
    ),
  );
  const ultraRare = useWalletNFTs(ULTRA_RARE.contract, account);
  //console.log('NFT', JSON.stringify(ultraRare, null, 4));
  const gridMaxSize = TAXE_FREE_MODE && ultraRare.balance === 0 ? 3 : 4;
  const siteIds = getUserSiteIds(usersState, account);
  const investment = getUserInvestment(usersState, account, true);
  const numberOfSite = siteIds.length;

  const dataTokens: Data[] = [];

  const dataSites: Data[] = [];

  const dataIncomeNet: Data[] = [];

  const dataIncomeGross: Data[] = [];

  const dataIncomeTaxeFree: Data[] = [];

  const dataAPR: Data[] = [];

  let datasMissing = false;

  for (const siteId of siteIds) {
    const site = getSite(siteId);
    const token = getUserTokenBalance(usersState, account, site);
    const tokenToCome = getUserTokenBalanceToCome(usersState, account, site);

    const { realPeriod, realStartTimestamp, dataMissing } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );

    datasMissing = datasMissing || dataMissing;

    const yields = getUserYieldBySite(
      miningState,
      usersState,
      site,
      account,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
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

    const dataYieldGrossTaxeFree: Data = {
      label: token.symbol, // site.name,
      value: formatBTC(yields.grossTaxeFree.btc),
    };

    dataTokens.push(dataToken);
    dataSites.push(dataSite);
    dataIncomeNet.push(dataYieldNet);
    dataIncomeGross.push(dataYieldGross);
    dataIncomeTaxeFree.push(dataYieldGrossTaxeFree);

    if (tokenToCome.balance > 0) {
      const dataTokenToCome: Data = {
        label: token.symbol + ' (' + t('toCome') + ')',
        value: formatUsd(tokenToCome.usd),
      };
      dataTokens.push(dataTokenToCome);
    }
  }

  useEffect(() => {
    setUserYield(
      getUserYield(
        miningState,
        usersState,
        account,
        period,
        btcPrice,
        startDate,
        endDate,
        expensesState,
      ),
    );
  }, [
    usersState,
    miningState,
    account,
    btcPrice,
    period,
    startDate,
    endDate,
    expensesState,
  ]);

  return (
    <SimpleGrid
      cols={2}
      breakpoints={[
        { minWidth: 'xs', cols: 2 },
        { minWidth: 'sm', cols: 2 },
        { minWidth: 'md', cols: 3 },
        {
          minWidth: 1200,
          cols: ACTIVATE_DISPLAY_APY ? gridMaxSize + 1 : gridMaxSize,
        },
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
      {!TAXE_FREE_MODE && (
        <>
          <SummaryCard
            title={isMobile ? t('incomes-net-short') : t('incomes-net')}
            toolTip={t('income-net-explained')}
            value={formatBTC(userYield.net.btc)}
            subValue={formatUsd(userYield.net.usd)}
            data={dataIncomeNet}
            Icon={IconCoinBitcoin}
            warningValue={userYield.net.usd < 0}
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
      )}
      {ACTIVATE_DISPLAY_APY && (
        <SummaryCard
          title={t('my-yield')}
          value={formatPercent(userYield.net.apr)}
          Icon={IconTrendingUp}
          data={dataAPR}
        ></SummaryCard>
      )}
      {TAXE_FREE_MODE && (
        <SummaryCard
          title={
            isMobile ? t('incomes-taxe-free-short') : t('incomes-taxe-free')
          }
          toolTip={t('income-taxe-free-explained')}
          value={formatBTC(userYield.grossTaxeFree.btc)}
          subValue={formatUsd(userYield.grossTaxeFree.usd)}
          data={dataIncomeTaxeFree}
          Icon={IconCoinBitcoin}
          warningValue={userYield.grossTaxeFree.usd < 0}
          warningData={datasMissing}
        ></SummaryCard>
      )}
      {ultraRare.balance > 0 && (
        <NFTCard
          data={ultraRare.metadata}
          title={ultraRare.collectionName}
        ></NFTCard>
      )}
    </SimpleGrid>
  );
};

export const SummaryGrid = _Summary;
