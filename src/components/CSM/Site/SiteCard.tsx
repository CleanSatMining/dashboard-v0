import { FC, memo, useEffect, useState } from 'react';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectMiningState } from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { SITES, SiteID } from '../../../constants';
import { Site, TokenBalance } from '../../../types/mining/Site';
import { UserSiteCard } from './Card/UserSiteCard';
import { CardData, CardCost } from './Card/Type';
import BigNumber from 'bignumber.js';
import { Yield } from 'src/types/mining/Site';

import {
  getMinedBtcBySite,
  getUptimeBySite,
  getUserSiteShare,
  getUserTokenBalance,
  getUserYieldBySite,
  getYieldBySite,
  getSiteCostsByPeriod,
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
  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningState);

  const site: Site = SITES[siteId as SiteID];

  const userToken = getUserTokenBalance(usersState, account, siteId);
  const tokenBalance = userToken.balance;
  const userShare = getUserSiteShare(miningState, usersState, siteId, account);
  const siteMinedBTC = getMinedBtcBySite(miningState, siteId, period, btcPrice);
  const userYield = getUserYieldBySite(
    miningState,
    usersState,
    siteId,
    account,
    period,
    btcPrice,
  );
  const siteYield = getYieldBySite(miningState, siteId, period, btcPrice);
  const siteUptime = getUptimeBySite(miningState, siteId, period);
  const siteCosts: CardCost = getSiteCostsByPeriod(
    miningState,
    siteId,
    btcPrice,
    period,
  );

  if (shallDisplay) {
    //console.log('SHALL DISPLAY', siteId, tokenBalance, tokenBalance > 0);
    shallDisplay(Number(siteId), tokenBalance > 0);
  }

  const data: CardData = buildUserSiteData(
    siteId,
    site,
    siteMinedBTC,
    userShare,
    userYield,
    siteYield,
    userToken,
    siteUptime,
    siteCosts,
    period,
  );

  const [userSiteData, setUserSiteData] = useState<CardData>(data);
  useEffect(() => {
    const userYield = getUserYieldBySite(
      miningState,
      usersState,
      siteId,
      account,
      period,
      btcPrice,
    );

    const siteMinedBTC = getMinedBtcBySite(
      miningState,
      siteId,
      period,
      btcPrice,
    );
    const siteUptime = getUptimeBySite(miningState, siteId, period);
    const siteYield = getYieldBySite(miningState, siteId, period, btcPrice);
    const siteCosts: CardCost = getSiteCostsByPeriod(
      miningState,
      siteId,
      btcPrice,
      period,
    );

    setUserSiteData(
      buildUserSiteData(
        siteId,
        site,
        siteMinedBTC,
        userShare,
        userYield,
        siteYield,
        userToken,
        siteUptime,
        siteCosts,
        period,
      ),
    );
    if (shallDisplay) {
      shallDisplay(Number(siteId), tokenBalance > 0);
    }
    /* eslint-disable */
  }, [
    account,
    btcPrice,
    miningState,
    period,
    shallDisplay,
    site,
    siteId,
    //tokenBalance,
    //userShare,
    //userToken,
    //usersState,
  ]);
  /* eslint-enable */

  return (
    <>
      {tokenBalance > 0 && (
        <UserSiteCard
          title={site.name}
          subTitle={site.location}
          image={site.image}
          data={userSiteData}
          status={site.status}
        />
      )}
    </>
  );
};

export const SiteCard = memo(_SiteCard);

/**
 * buildUserSiteData
 *
 * @param siteId
 * @param site
 * @param siteMinedBTC
 * @param userShare
 * @param userYield
 * @param userToken
 * @param siteUptime
 * @param period
 * @returns
 */
function buildUserSiteData(
  siteId: string,
  site: Site,
  siteMinedBTC: {
    quantity: BigNumber;
    value: BigNumber;
  },
  userShare: BigNumber,
  userYield: { net: Yield; gross: Yield },
  siteYield: { net: Yield; gross: Yield },
  userToken: TokenBalance,
  siteUptime: {
    machines: number;
    days: number;
    percent: number;
    hashrate: number;
  },
  costs: CardCost,
  period: number,
): CardData {
  const siteHashrate = new BigNumber(site.mining.asics.hashrateHs)
    .times(site.mining.asics.units)
    .toNumber();
  return {
    id: siteId,
    label: site.name,
    income: {
      mined: {
        btc: siteMinedBTC.quantity.times(userShare).toNumber(),
        usd: siteMinedBTC.value.times(userShare).toNumber(),
      },
      net: {
        balance: {
          btc: userYield.net.btc,
          usd: userYield.net.usd,
        },
        apy: userYield.net.apr,
      },
      gross: {
        balance: {
          btc: userYield.gross.btc,
          usd: userYield.gross.usd,
        },
        apy: userYield.gross.apr,
      },
    },

    token: {
      balance: userToken.balance,
      value: userToken.usd,
      percent: userShare.toNumber(),
      supply: site.token.supply,
      url: site.token.gnosisscanUrl,
      symbol: site.token.symbol,
    },
    site: {
      miningStart: site.mining.startingDate,
      machines: site.mining.asics.units,
      hashrate: siteHashrate,
      uptime: {
        hashrate: siteUptime.hashrate,
        hashratePercent: new BigNumber(siteUptime.hashrate)
          .dividedBy(siteHashrate)
          .times(100)
          .toNumber(),
        onPeriod: period,
        days: siteUptime.days,
        machines: siteUptime.machines,
        mined: {
          btc: siteMinedBTC.quantity.toNumber(),
          usd: siteMinedBTC.value.toNumber(),
        },
        earned: {
          btc: siteYield.net.btc,
          usd: siteYield.net.usd,
        },
        costs: costs,
      },
    },
  };
}
