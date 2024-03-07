import { FC, useEffect, useState } from 'react';

import { useAppSelector } from 'src/hooks/react-hooks';
import {
  selectMiningHistory,
  selectMiningExpenses,
} from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';
import { PropertiesERC20 } from 'src/types/PropertiesToken';
import { SITES, SiteID } from '../../../constants';
import { Site, TokenBalance } from '../../../types/mining/Site';
import { UserSiteCard } from './UserCard/UserSiteCard';
import { UserSiteCardMobile } from './UserCard/UserSiteCardMobile';
import { CardData, CardCost } from './UserCard/Type';
import BigNumber from 'bignumber.js';
import { Yield } from 'src/types/mining/Site';
import { useCsmTokens } from 'src/hooks/useCsmTokens';
import { Operator } from 'src/types/mining/Site';
import {
  getHashrate,
  getNumberOfMachines,
} from 'src/components/CSM/Utils/period';
import { getTimestampUTC } from 'src/components/Display/components/Utils';

import {
  getMinedBtcBySite,
  getUptimeBySite,
  getUserSiteShare,
  getUserTokenBalance,
  getUserTokenBalanceToCome,
  getUserYieldBySite,
  getYieldBySite,
  getSiteExpensesByPeriod,
} from '../Utils/yield';

type SiteProps = {
  siteId: string;
  btcPrice: number;
  account: string;
  period: number;
  isMobile: boolean;
  startDate: number;
  endDate: number;
  shallDisplay?: (siteId: number, shallDisplay: boolean) => void;
};

const _SiteCard: FC<SiteProps> = ({
  siteId = '1',
  btcPrice,
  period,
  account,
  isMobile,
  startDate,
  endDate,
  shallDisplay,
}) => {
  //const isMobile = useMediaQuery('(max-width: 36em)');

  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningHistory);
  const expensesState = useAppSelector(selectMiningExpenses);
  const { getPropertyToken } = useCsmTokens();

  const site: Site = SITES[siteId as SiteID];

  const userToken = getUserTokenBalance(usersState, account, siteId);
  const tokenBalance = userToken.balance;
  const userTokenToCome = getUserTokenBalanceToCome(
    usersState,
    account,
    siteId,
  );
  const userShare = getUserSiteShare(
    miningState,
    usersState,
    siteId,
    account,
    getPropertyToken(site.token.address),
  );
  const siteMinedBTC = getMinedBtcBySite(
    miningState,
    siteId,
    period,
    btcPrice,
    startDate,
    endDate,
  );
  const userYield = getUserYieldBySite(
    miningState,
    usersState,
    siteId,
    account,
    period,
    btcPrice,
    startDate,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const siteYield = getYieldBySite(
    miningState,
    siteId,
    period,
    btcPrice,
    startDate,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const siteUptime = getUptimeBySite(
    miningState,
    siteId,
    period,
    startDate,
    endDate,
  );
  const siteCosts: CardCost = getSiteExpensesByPeriod(
    miningState,
    siteId,
    btcPrice,
    period,
    startDate,
    endDate,
    expensesState.byId[siteId] ?? [],
  );

  if (shallDisplay) {
    //console.log('SHALL DISPLAY', siteId, tokenBalance, tokenBalance > 0);
    shallDisplay(Number(siteId), tokenBalance > 0);
  }

  const data: CardData = buildUserSiteData(
    siteId,
    site,
    startDate,
    endDate,
    siteMinedBTC,
    userShare,
    userYield,
    siteYield,
    userToken,
    userTokenToCome,
    siteUptime,
    siteCosts,
    period,
    getPropertyToken,
    undefined,
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
      startDate,
      endDate,
      [],
    );

    const siteMinedBTC = getMinedBtcBySite(
      miningState,
      siteId,
      period,
      btcPrice,
      startDate,
      endDate,
    );
    const siteUptime = getUptimeBySite(
      miningState,
      siteId,
      period,
      startDate,
      endDate,
    );
    const siteYield = getYieldBySite(
      miningState,
      siteId,
      period,
      btcPrice,
      startDate,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const siteCosts: CardCost = getSiteExpensesByPeriod(
      miningState,
      siteId,
      btcPrice,
      period,
      startDate,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const userTokenToCome = getUserTokenBalanceToCome(
      usersState,
      account,
      siteId,
    );

    setUserSiteData(
      buildUserSiteData(
        siteId,
        site,
        startDate,
        endDate,
        siteMinedBTC,
        userShare,
        userYield,
        siteYield,
        userToken,
        userTokenToCome,
        siteUptime,
        siteCosts,
        period,
        getPropertyToken,
        undefined,
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
    startDate,
    endDate,
  ]);
  /* eslint-enable */

  return (
    <>
      {isMobile ? (
        <UserSiteCardMobile
          title={site.name}
          subTitle={site.location.name}
          image={site.image}
          countryCode={site.location.countryCode}
          data={userSiteData}
          status={site.status}
        />
      ) : (
        <UserSiteCard
          title={site.name}
          subTitle={site.location.name}
          countryCode={site.location.countryCode}
          image={site.image}
          data={userSiteData}
          status={site.status}
        />
      )}
    </>
  );
};

export const SiteCard = _SiteCard;

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
  startTimestamp: number,
  endTimestamp: number,
  siteMinedBTC: {
    quantity: BigNumber;
    value: BigNumber;
  },
  userShare: BigNumber,
  userYield: { net: Yield; gross: Yield },
  siteYield: { net: Yield; gross: Yield },
  userToken: TokenBalance,
  userTokenToCome: TokenBalance,
  siteUptime: {
    machines: number;
    days: number;
    percent: number;
    hashrate: number;
    hashratePercent: number;
    hashrates: number[];
    hashratePercents: number[];
  },
  costs: CardCost,
  period: number,
  getPropertyToken: (address: string) => PropertiesERC20 | undefined,
  operator: Operator | undefined,
): CardData {
  const siteHashrates = site.mining.asics
    .filter((a) => {
      // console.log(
      //   'siteHashrates a.date',
      //   getTimestampUTC(new Date(a.date)),
      //   startTimestamp,
      //   endTimestamp,
      // );
      return (
        getTimestampUTC(new Date(a.date)) <= startTimestamp ||
        getTimestampUTC(new Date(a.date)) <= endTimestamp
      );
    })
    .map((asics) => {
      return getHashrate(site, new Date(asics.date));
    });
  //console.log('siteHashrates', JSON.stringify(siteHashrates, null, 4));
  const siteMachines = site.mining.asics
    .filter(
      (a) =>
        getTimestampUTC(new Date(a.date)) <= startTimestamp ||
        getTimestampUTC(new Date(a.date)) <= endTimestamp,
    )
    .map((asics) => getNumberOfMachines(site, new Date(asics.date)));
  const tokenProperties = getPropertyToken(site.token.address);
  const tokenSupply = tokenProperties
    ? tokenProperties.supply
    : site.token.supply;
  return {
    id: siteId,
    label: site.name,
    income: {
      available: site.api.enable,
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
      supply: tokenSupply,
      url: site.token.gnosisscanUrl,
      symbol: site.token.symbol,
      address: site.token.address,
      decimal: 9,
      image: 'https://cleansatmining.com/data/files/logo_csm.png',
      toCome: userTokenToCome.balance,
      valueToCome: userTokenToCome.usd,
    },
    site: {
      operator: operator,
      miningStart: site.mining.asics.map((asics) => asics.date),
      machines: siteMachines,
      hashrate: siteHashrates,
      uptime: {
        startTimestamp: startTimestamp,
        endTimestamp: endTimestamp,
        hashrate: siteUptime.hashrate,
        hashratePercent: siteUptime.hashratePercent,
        hashrates: siteUptime.hashrates,
        hashratePercents: siteUptime.hashratePercents,
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
