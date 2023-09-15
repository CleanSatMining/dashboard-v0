import { FC, memo, useEffect, useState } from 'react';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectMiningState } from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { SITES, SiteID } from '../../../constants';
import { Site } from '../../../types/mining/Site';
import { SiteData, UserSiteCard } from '../Card/Card';
import { getRealPeriod } from '../Utils/yield';
import {
  getMinedBtcBySite,
  getUptimeBySite,
  getUserSiteShare,
  getUserTokenBalance,
  getUserYieldBySite,
  getYieldBySite,
} from '../Utils/yield';

type SiteProps = {
  siteId: string;
  btcPrice: number;
  account: string;
  period: number;
  shallDisplay?: (siteId: number, shallDisplay: boolean) => void;
};

const _SiteCard: FC<SiteProps> = ({
  siteId = '1',
  btcPrice,
  period,
  account,
  shallDisplay,
}) => {
  const [csmPeriod, setCsmPeriod] = useState(period);
  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningState);

  const site: Site = SITES[siteId as SiteID];

  useEffect(() => {
    setCsmPeriod(period);
  }, [setCsmPeriod, period]);

  const yieldSite = getYieldBySite(miningState, siteId, period, btcPrice);
  const yieldUser = getUserYieldBySite(
    miningState,
    usersState,
    siteId,
    account,
    period,
    btcPrice
  );

  const minedBTC = getMinedBtcBySite(miningState, siteId, period).toNumber();
  const token = getUserTokenBalance(usersState, account, siteId);
  const tokenBalance = token.balance;
  const tokenValue = token.usd;
  const csmPercent = getUserSiteShare(
    miningState,
    usersState,
    siteId,
    account
  ).toNumber();
  const uptime = getUptimeBySite(miningState, siteId, period);

  if (shallDisplay) {
    //console.log('SHALL DISPLAY', siteId, tokenBalance, tokenBalance > 0);
    shallDisplay(Number(siteId), tokenBalance > 0);
  }

  const onTotalMachines =
    uptime.machines > 0 ? '/' + site.mining.asics.units : '';
  const data: SiteData = {
    apr: yieldSite.apr,
    id: csmPeriod.toString(),
    income: {
      site: {
        btc: yieldSite.btc,
        usd: yieldSite.usd,
      },
      user: {
        btc: yieldUser.btc,
        usd: yieldUser.usd,
      },
    },
    label: '',
    mined: {
      btc: minedBTC,
      usd: minedBTC * btcPrice,
    },
    uptime: {
      days:
        uptime.days > 0
          ? uptime.days.toString() + '/' + getRealPeriod(site, period)
          : '0',
      machine: uptime.machines.toFixed(0) + onTotalMachines,
    },
  };

  const [csmData, setCsmData] = useState<SiteData>(data);
  useEffect(() => {
    const yieldSite = getYieldBySite(miningState, siteId, period, btcPrice);
    const yieldUser = getUserYieldBySite(
      miningState,
      usersState,
      siteId,
      account,
      period,
      btcPrice
    );

    const minedBTC = getMinedBtcBySite(miningState, siteId, period).toNumber();
    const uptime = getUptimeBySite(miningState, siteId, period);

    const onTotalMachines =
      uptime.machines > 0 ? '/' + site.mining.asics.units : '';

    setCsmData({
      apr: yieldSite.apr,
      id: csmPeriod.toString(),
      income: {
        site: {
          btc: yieldSite.btc,
          usd: yieldSite.usd,
        },
        user: {
          btc: yieldUser.btc,
          usd: yieldUser.usd,
        },
      },
      label: '',
      mined: {
        btc: minedBTC,
        usd: minedBTC * btcPrice,
      },
      uptime: {
        days:
          uptime.days > 0
            ? uptime.days.toString() + '/' + getRealPeriod(site, period)
            : '0',
        machine: uptime.machines.toFixed(0) + onTotalMachines,
      },
    });
    if (shallDisplay) {
      shallDisplay(Number(siteId), tokenBalance > 0);
    }
  }, [
    tokenBalance,
    shallDisplay,
    setCsmData,
    csmPeriod,
    btcPrice,
    site.token.supply,
    period,
    site.mining.asics.units,
    account,
    miningState,
    siteId,
    usersState,
  ]);

  return (
    <>
      {tokenBalance > 0 && (
        <UserSiteCard
          title={site.name}
          csm={tokenBalance}
          csmPercent={csmPercent}
          csmUsd={tokenValue}
          csmSymbol={site.token.symbol}
          csmSupply={site.token.supply}
          image={site.image}
          tokenUrl={site.token.gnosisscanUrl}
          data={csmData}
          miningState={site.status}
          startingDate={site.mining.startingDate}
        />
      )}
    </>
  );
};

export const SiteCard = memo(_SiteCard);
