import { FC, memo, useEffect, useState } from 'react';

import { SITES, SiteID } from '../../../constants';
import { CSMSsite } from '../../../types/CSMState';
import { Site } from '../../../types/Site';
import { SiteData, UserSiteCard } from '../Card/Card';
import {
  getUptimeBySite,
  getUserSiteYield,
  getYieldBySite,
} from '../Utils/yield';

type SiteProps = {
  siteId: string;
  btcPrice: number;
  account: string;
  siteState: CSMSsite;
  period: number;
  shallDisplay: (siteId: number, shallDisplay: boolean) => void;
};

const _SiteCard: FC<SiteProps> = ({
  siteId = '1',
  btcPrice,
  siteState,
  period,
  shallDisplay,
}) => {
  const [csmPeriod, setCsmPeriod] = useState(period);

  const site: Site = SITES[siteId as SiteID];

  // console.log('_SiteCard', 'siteState', JSON.stringify(siteState, null, 4));

  const tokenBalance =
    siteState !== undefined ? siteState.state.user.token.balance : 0;
  const csmPercent =
    siteState !== undefined ? tokenBalance / site.token.supply : 0;
  const tokenValue =
    siteState !== undefined ? tokenBalance * site.token.price : 0;
  const minedBTC =
    siteState !== undefined
      ? siteState.state.incomes.byPeriod[csmPeriod] !== undefined
        ? siteState.state.incomes.byPeriod[csmPeriod].revenue
        : 0
      : 0;

  shallDisplay(Number(siteId), tokenBalance > 0);

  //console.log('SITECARD', siteId, JSON.stringify(tokenBalance));

  useEffect(() => {
    setCsmPeriod(period);
  }, [setCsmPeriod, period]);

  const yieldSite = getYieldBySite(siteState, period, btcPrice);
  const yieldUser = getUserSiteYield(siteState, period, btcPrice);
  const uptime = getUptimeBySite(siteState, period);

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
      days: uptime.days.toString() + '/' + period,
      machine: uptime.machines.toFixed(0) + onTotalMachines,
    },
  };

  const [csmData, setCsmData] = useState<SiteData>(data);
  useEffect(() => {
    const yieldSite = getYieldBySite(siteState, period, btcPrice);
    const yieldUser = getUserSiteYield(siteState, period, btcPrice);
    const uptime = getUptimeBySite(siteState, period);
    const minedBTC =
      siteState !== undefined
        ? siteState.state.incomes.byPeriod[csmPeriod] !== undefined
          ? siteState.state.incomes.byPeriod[csmPeriod].revenue
          : 0
        : 0;
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
        days: uptime.days.toString() + '/' + period,
        machine: uptime.machines.toFixed(0) + onTotalMachines,
      },
    });
  }, [
    setCsmData,
    csmPeriod,
    btcPrice,
    site.token.supply,
    siteState,
    period,
    site.mining.asics.units,
  ]);

  /* console.log(
    'Summary CARD DATA',
    csmPeriod,
    site.name,
    JSON.stringify(csmData, null, 4),
    JSON.stringify(siteState, null, 4)
  ); */

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
          miningState={site.miningState}
          startingDate={site.mining.startingDate}
        />
      )}
    </>
  );
};

export const SiteCard = memo(_SiteCard);
