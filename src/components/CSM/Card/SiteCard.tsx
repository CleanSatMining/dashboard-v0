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
import { CardData } from './UserCard/Type';
import { SiteCost } from 'src/types/mining/Site';
import { HashratePeriod } from 'src/types/mining/Mining';
import BigNumber from 'bignumber.js';
import { Yield } from 'src/types/mining/Site';
import { useCsmTokens } from 'src/hooks/useCsmTokens';
import { Operator } from 'src/types/mining/Site';
import {
  getPeriodFromStart,
  getAverageHashrate,
  getAverageMachines,
  getProgressSteps,
  getAverageEquipmentCost,
} from '../Utils/period';

import {
  getMinedBtc,
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
  const { realPeriod, realStartTimestamp } = getPeriodFromStart(
    site,
    startDate,
    endDate,
  );
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
  const siteMinedBTC = getMinedBtc(
    miningState,
    siteId,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const userYield = getUserYieldBySite(
    miningState,
    usersState,
    siteId,
    account,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const siteYield = getYieldBySite(
    miningState,
    siteId,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const siteUptime = getUptimeBySite(
    miningState,
    siteId,
    realPeriod,
    realStartTimestamp,
    endDate,
  );
  const siteCosts: SiteCost = getSiteExpensesByPeriod(
    miningState,
    siteId,
    btcPrice,
    realPeriod,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );

  if (shallDisplay) {
    //console.log('SHALL DISPLAY', siteId, tokenBalance, tokenBalance > 0);
    shallDisplay(Number(siteId), tokenBalance > 0);
  }

  const steps = getProgressSteps(site, realStartTimestamp, endDate);
  const hashratePeriods: HashratePeriod[] = steps.map((step) => {
    //console.log('Step', step);
    const uptime = getUptimeBySite(
      miningState,
      siteId,
      realPeriod,
      step.start.getTime(),
      step.end.getTime(),
    );
    const e: HashratePeriod = {
      start: step.start,
      end: step.end,
      hashrateHs: uptime.hashrate,
      hashrateMax: step.hashrateMax,
      equipmentInstalled: step.equipmentInstalled,
      equipmentUninstalled: step.equipmentUninstalled,
    };
    return e;
  });

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
    hashratePeriods,
    siteCosts,
    realPeriod,
    getPropertyToken,
    undefined,
  );

  const [userSiteData, setUserSiteData] = useState<CardData>(data);

  useEffect(() => {
    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      site,
      startDate,
      endDate,
    );
    const userYield = getUserYieldBySite(
      miningState,
      usersState,
      siteId,
      account,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );

    const siteMinedBTC = getMinedBtc(
      miningState,
      siteId,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const siteUptime = getUptimeBySite(
      miningState,
      siteId,
      realPeriod,
      realStartTimestamp,
      endDate,
    );
    const siteYield = getYieldBySite(
      miningState,
      siteId,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const siteCosts: SiteCost = getSiteExpensesByPeriod(
      miningState,
      siteId,
      btcPrice,
      realPeriod,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const userTokenToCome = getUserTokenBalanceToCome(
      usersState,
      account,
      siteId,
    );
    const steps = getProgressSteps(site, realStartTimestamp, endDate);
    const hashratePeriods: HashratePeriod[] = steps.map((step) => {
      //console.log('Step', JSON.stringify(step));

      const uptime = getUptimeBySite(
        miningState,
        siteId,
        realPeriod,
        step.start.getTime(),
        step.end.getTime(),
      );
      // if (steps.length > 1) {
      //   console.log(
      //     'hashratePeriods',
      //     siteId,
      //     realPeriod,
      //     step.start.getTime(),
      //     step.end.getTime(),
      //     JSON.stringify(uptime),
      //   );
      //}
      const e: HashratePeriod = {
        start: step.start,
        end: step.end,
        hashrateHs: uptime.hashrate,
        hashrateMax: step.hashrateMax,
        equipmentInstalled: step.equipmentInstalled,
        equipmentUninstalled: step.equipmentUninstalled,
      };
      return e;
    });

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
        hashratePeriods,
        siteCosts,
        realPeriod,
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
  userYield: { net: Yield; gross: Yield; grossTaxeFree: Yield },
  siteYield: { net: Yield; gross: Yield; grossTaxeFree: Yield },
  userToken: TokenBalance,
  userTokenToCome: TokenBalance,
  siteUptime: {
    machines: number;
    days: number;
    percent: number;
    hashrate: number;
  },
  hashratePeriods: HashratePeriod[],
  costs: SiteCost,
  period: number,
  getPropertyToken: (address: string) => PropertiesERC20 | undefined,
  operator: Operator | undefined,
): CardData {
  // const siteHashrate = new BigNumber(site.mining.asics.hashrateHs)
  //   .times(site.mining.asics.units)
  //   .toNumber();
  const siteAverageHashrate = getAverageHashrate(
    site,
    startTimestamp,
    endTimestamp,
  );
  const tokenProperties = getPropertyToken(site.token.address);
  const tokenSupply = tokenProperties
    ? tokenProperties.supply
    : site.token.supply;
  return {
    id: siteId,
    label: site.name,
    income: {
      available: site.api[0].enable,
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
      grossTaxeFree: {
        balance: {
          btc: userYield.grossTaxeFree.btc,
          usd: userYield.grossTaxeFree.usd,
        },
        apy: userYield.grossTaxeFree.apr,
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
      miningStart: site.mining.startingDate,
      machines: getAverageMachines(site, startTimestamp, endTimestamp),
      hashrate: siteAverageHashrate.toNumber(),
      equipmentCost: getAverageEquipmentCost(
        site,
        startTimestamp,
        endTimestamp,
      ),
      uptime: {
        hashrate: siteUptime.hashrate,
        hashratePercent: new BigNumber(siteUptime.hashrate)
          .dividedBy(siteAverageHashrate)
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
        earnedTaxFree: {
          btc: siteYield.grossTaxeFree.btc,
          usd: siteYield.grossTaxeFree.usd,
        },
        costs: costs,
        hashratePeriods: hashratePeriods,
      },
    },
  };
}
