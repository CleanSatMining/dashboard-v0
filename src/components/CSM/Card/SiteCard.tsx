import { FC, useEffect, useState } from 'react';
import { NativeSelect, SelectItem, ActionIcon, Group } from '@mantine/core';
import { useAppSelector } from 'src/hooks/react-hooks';
import {
  selectMiningHistory,
  selectMiningExpenses,
} from 'src/store/features/miningData/miningDataSelector';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';
import { PropertiesERC20 } from 'src/types/PropertiesToken';
import { SITES } from '../../../constants';
import {
  Site,
  TokenBalance,
  SiteID,
  Contractor,
} from '../../../types/mining/Site';
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
import { useAtomValue } from 'jotai';
import { adminUserAtom } from 'src/states';
import { IconDownload } from '@tabler/icons-react';

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
import { API_MINING_DATA } from 'src/constants/apis';

import {
  APIMiningDataQuery,
  DayDataAntpool,
  DayDataFoundry,
  DayDataLuxor,
} from 'src/types/mining/MiningAPI';
import { getTimestampUTC } from 'src/utils/date';

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
  const adminUser = useAtomValue(adminUserAtom);
  const usersState = useAppSelector(selectUsersState);
  const miningState = useAppSelector(selectMiningHistory);
  const expensesState = useAppSelector(selectMiningExpenses);
  const { getPropertyToken } = useCsmTokens();
  const site: Site = SITES[siteId as SiteID];
  const subSites = getSubSites(site);
  const allSites = [site, ...subSites];
  const [siteValue, setSiteValue] = useState(site.name);

  const { realPeriod, realStartTimestamp, dataMissing } = getPeriodFromStart(
    site,
    startDate,
    endDate,
  );
  const userToken = getUserTokenBalance(usersState, account, site);
  const tokenBalance = userToken.balance;
  const userTokenToCome = getUserTokenBalanceToCome(usersState, account, site);
  const userShare = getUserSiteShare(
    miningState,
    usersState,
    site,
    account,
    getPropertyToken(site.token.address),
  );
  const siteMinedBTC = getMinedBtc(
    miningState,
    site,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const userYield = getUserYieldBySite(
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
  const siteYield = getYieldBySite(
    miningState,
    site,
    realPeriod,
    btcPrice,
    realStartTimestamp,
    endDate,
    expensesState.byId[siteId] ?? [],
  );
  const siteUptime = getUptimeBySite(
    miningState,
    site,
    realPeriod,
    realStartTimestamp,
    endDate,
  );
  const siteCosts: SiteCost = getSiteExpensesByPeriod(
    miningState,
    site,
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
      site,
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
    realStartTimestamp,
    endDate,
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
    period,
    getPropertyToken,
    undefined,
    dataMissing,
  );

  const [userSiteData, setUserSiteData] = useState<CardData>(data);

  const handleClick = async () => {
    const selectedSite =
      allSites.find(
        (s) => s.api.length === 1 && s.api[0].subaccount?.name === siteValue,
      ) ?? site;

    const username = selectedSite.api[0].username;
    const body: APIMiningDataQuery = {
      siteId: siteId,
      first: 600,
      username: username ?? '',
    };
    console.log(
      'API call:',
      API_MINING_DATA.url(siteId),
      JSON.stringify(body, null, 2),
    );
    try {
      const response = await fetch(API_MINING_DATA.url(siteId), {
        method: API_MINING_DATA.method,
        body: JSON.stringify(body),
      });
      const apiData = await response.json();
      //console.log('API Response:', JSON.stringify(apiData, null, 2));
      switch (site.api[0].contractor) {
        case Contractor.ANTPOOL:
          const antpoolData: { days: DayDataAntpool[] } = apiData;
          const antpoolDataDays = antpoolData.days
            .filter(
              (d) =>
                convertToTimestamp(d.timestamp) >= startDate &&
                convertToTimestamp(d.timestamp) <= endDate,
            )
            .map((dayData) => ({
              ...dayData,
            }));
          const csv = convertToCSV(antpoolDataDays);
          downloadCSV(csv, 'antpool.csv');
          break;
        case Contractor.FOUNDRY:
          const foundryData: { days: DayDataFoundry[] } = apiData;
          const foundryDataDays = foundryData.days
            .filter(
              (d) =>
                convertToTimestamp(d.startTime) >= startDate &&
                convertToTimestamp(d.startTime) <= endDate,
            )
            .map((dayData) => ({
              ...dayData,
            }));
          const csvFoundry = convertToCSV(foundryDataDays);
          downloadCSV(csvFoundry, siteValue + '.csv');
          break;
        case Contractor.LUXOR:
          const luxorData: { days: DayDataLuxor[] } = apiData;
          const luxorDataDays = luxorData.days
            .filter(
              (d) =>
                convertToTimestamp(d.date) >= startDate &&
                convertToTimestamp(d.date) <= endDate,
            )
            .map((dayData) => ({
              ...dayData,
            }));
          const csvLuxor = convertToCSV(luxorDataDays);
          downloadCSV(csvLuxor, siteValue + '.csv');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const selectedSite =
      allSites.find(
        (s) => s.api.length === 1 && s.api[0].subaccount?.name === siteValue,
      ) ?? site;

    const { realPeriod, realStartTimestamp } = getPeriodFromStart(
      selectedSite,
      startDate,
      endDate,
    );
    const userYield = getUserYieldBySite(
      miningState,
      usersState,
      selectedSite,
      account,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );

    const siteMinedBTC = getMinedBtc(
      miningState,
      selectedSite,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
      siteValue !== site.name,
    );
    const siteUptime = getUptimeBySite(
      miningState,
      selectedSite,
      realPeriod,
      realStartTimestamp,
      endDate,
    );
    const siteYield = getYieldBySite(
      miningState,
      selectedSite,
      realPeriod,
      btcPrice,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const siteCosts: SiteCost = getSiteExpensesByPeriod(
      miningState,
      selectedSite,
      btcPrice,
      realPeriod,
      realStartTimestamp,
      endDate,
      expensesState.byId[siteId] ?? [],
    );
    const userTokenToCome = getUserTokenBalanceToCome(
      usersState,
      account,
      selectedSite,
    );
    const steps = getProgressSteps(selectedSite, realStartTimestamp, endDate);
    const hashratePeriods: HashratePeriod[] = steps.map((step) => {
      //console.log('Step', JSON.stringify(step));

      const uptime = getUptimeBySite(
        miningState,
        selectedSite,
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
        selectedSite,
        startDate,
        realStartTimestamp,
        endDate,
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
        period,
        getPropertyToken,
        undefined,
        dataMissing,
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
    siteValue,
  ]);
  /* eslint-enable */

  return (
    <>
      {adminUser && (
        <div style={{ display: 'flex', width: '100%' }}>
          <NativeSelect
            style={{ flex: 1, width: '100%', marginRight: '8px' }}
            data={[
              ...(allSites.map((site) =>
                site.api.length > 1
                  ? site.name
                  : (site.api[0].subaccount?.name ?? site.name),
              ) as unknown as SelectItem[]),
            ]}
            value={siteValue}
            onChange={(event) => setSiteValue(event.currentTarget.value)}
          />
          <ActionIcon onClick={handleClick}>
            <IconDownload size='1.125rem' />
          </ActionIcon>
        </div>
      )}
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
 * @param realPeriod
 * @returns
 */
function buildUserSiteData(
  siteId: string,
  site: Site,
  instructionStart: number,
  realStart: number,
  instructionEnd: number,
  realEnd: number,
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
  realPeriod: number,
  instructionPeriod: number,
  getPropertyToken: (address: string) => PropertiesERC20 | undefined,
  operator: Operator | undefined,
  dataMissing: boolean,
): CardData {
  // const siteHashrate = new BigNumber(site.mining.asics.hashrateHs)
  //   .times(site.mining.asics.units)
  //   .toNumber();
  const siteAverageHashrate = getAverageHashrate(
    site,
    instructionStart,
    instructionEnd,
  );
  const tokenProperties = getPropertyToken(site.token.address);
  const tokenSupply = tokenProperties
    ? tokenProperties.supply
    : site.token.supply;
  return {
    id: siteId,
    label: site.name,
    dataMissing: dataMissing,
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
      machines: getAverageMachines(site, instructionStart, instructionEnd),
      hashrate: siteAverageHashrate.toNumber(),
      equipmentCost: getAverageEquipmentCost(
        site,
        instructionStart,
        instructionEnd,
      ),
      uptime: {
        period: {
          real: {
            days: realPeriod,
            start: realStart,
            end: realEnd,
          },
          instruction: {
            days: instructionPeriod,
            start: instructionStart,
            end: instructionEnd,
          },
        },
        hashrate: siteUptime.hashrate,
        hashratePercent: siteAverageHashrate.gt(0)
          ? new BigNumber(siteUptime.hashrate)
              .dividedBy(siteAverageHashrate)
              .times(100)
              .toNumber()
          : 0,
        //onPeriod: realPeriod,
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

function getSubSites(site: Site): Site[] {
  // Vérifie si site.api est un tableau et contient des éléments
  if (Array.isArray(site.api) && site.api.length > 1) {
    // Crée une nouvelle liste de sites où chaque site est identique à l'original,
    // mais avec le champ `site` remplacé par l'élément correspondant de site.api
    const ms = site.api.map((apiElement, index) => ({
      ...site, // Copie toutes les propriétés de l'objet site
      api: [apiElement],
    }));

    return ms;
  } else {
    // Retourne un tableau vide ou gère l'erreur comme vous le souhaitez
    return [];
  }
}

function convertToCSV(data: { [key: string]: string | number }[]): string {
  if (data.length === 0) {
    return '';
  }

  const keys = Object.keys(data[0]); // Récupère les clés du premier objet comme en-têtes
  const header = keys.join(','); // Construit les en-têtes CSV
  const rows = data
    .map((row) => keys.map((key) => row[key]).join(','))
    .join('\n'); // Construit les lignes CSV

  return `${header}\n${rows}`;
}

function downloadCSV(csvString: string, filename: string) {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

function convertToTimestamp(dateString: string): number {
  const date = new Date(dateString);

  return getTimestampUTC(date);
}
