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
  getMinedBtcBySite,
  getUptimeBySite,
  getUserSiteShare,
  getUserTokenBalance,
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
    siteMinedBTC,
    userShare,
    userYield,
    siteYield,
    userToken,
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
  getPropertyToken: (address: string) => PropertiesERC20 | undefined,
  operator: Operator | undefined,
): CardData {
  const siteHashrate = new BigNumber(site.mining.asics.hashrateHs)
    .times(site.mining.asics.units)
    .toNumber();
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
    },
    site: {
      operator: operator,
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
