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
  getUserSiteShare,
  getUserTokenBalance,
  getUserTokenBalanceToCome,
} from '../Utils/yield';
import {
  API_FARM,
  API_FARM_BALANCE,
  API_GATEWAY_GET_FARM,
  API_MINING_DATA,
} from 'src/constants/apis';

import {
  APIMiningDataQuery,
  DayDataAntpool,
  DayDataFoundry,
  DayDataLuxor,
} from 'src/types/mining/MiningAPI';
import { getTimestampUTC } from 'src/utils/date';
import { getSubSites } from '../Utils/site';
import { BalanceSheet, DetailedBalanceSheet, Farm } from 'src/types/api/farm';

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

const _FarmCard: FC<SiteProps> = ({
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
  const { getPropertyToken } = useCsmTokens();
  const site: Site = SITES[siteId as SiteID];
  const subSites = getSubSites(site);
  const allSites = [site, ...subSites];
  const [siteValue, setSiteValue] = useState(site.name);
  const [farm, setFarm] = useState<Farm>();

  const { realPeriod, realStartTimestamp } = getPeriodFromStart(
    site,
    startDate,
    endDate,
  );
  const userToken = getUserTokenBalance(usersState, account, site);
  const tokenBalance = userToken.balance;
  const userTokenToCome = getUserTokenBalanceToCome(usersState, account, site);
  const userShare = getUserSiteShare(
    usersState,
    site,
    account,
    getPropertyToken(site.token.address),
  );

  if (shallDisplay) {
    //console.log('SHALL DISPLAY', siteId, tokenBalance, tokenBalance > 0);
    shallDisplay(Number(siteId), tokenBalance > 0);
  }

  const [userSiteData, setUserSiteData] = useState<CardData>();

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
    // appel API pour récupérer les données de minage
    const farmId = getFarmId(siteId);

    const fetchData = async () => {
      try {
        const url = API_FARM.url(farmId);
        const response = await fetch(url); // Remplacez par votre URL d'API
        const data: Farm = await response.json();
        console.log('Fetch Farm data:', data.slug);
        setFarm(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // appel API pour récupérer les données de minage
    const farmId = getFarmId(siteId);

    const fetchData = async () => {
      if (farm !== undefined) {
        try {
          // convert timstamp to string format 'YYYY-MM-DD'
          const end = new Date(endDate + 43200000).toISOString().split('T')[0];
          const start = new Date(startDate).toISOString().split('T')[0];
          const url =
            API_FARM_BALANCE.url(farmId) +
            '?btc=' +
            btcPrice +
            '&start=' +
            start +
            '&end=' +
            end;
          const response = await fetch(url); // Remplacez par votre URL d'API
          const data: DetailedBalanceSheet = await response.json();
          console.log('Fetch Farm balance:', data.days);
          setUserSiteData(
            buildUserSiteData(
              siteId,
              farm,
              startDate,
              realStartTimestamp,
              endDate,
              endDate,
              realPeriod,
              period,
              userShare,
              userToken,
              userTokenToCome,
              getPropertyToken,
              data,
            ),
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();

    if (shallDisplay) {
      shallDisplay(Number(siteId), tokenBalance > 0);
    }

    /* eslint-disable */
  }, [farm, account, btcPrice, startDate, endDate]);
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
      {userSiteData && (
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
      )}
    </>
  );
};

export const SiteCard = _FarmCard;

function getFarmId(siteId: string) {
  let farmId = '';
  switch (siteId) {
    case '1':
      farmId = 'alpha';
      break;
    case '2':
      farmId = 'beta';
      break;
    case '3':
      farmId = 'omega';
      break;
    case '4':
      farmId = 'gamma';
      break;
    case '5':
      farmId = 'delta';
      break;
  }
  return farmId;
}

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
  farm: Farm,
  instructionStart: number,
  realStart: number,
  instructionEnd: number,
  realEnd: number,
  realPeriod: number,
  instructionPeriod: number,
  userShare: BigNumber,
  userToken: TokenBalance,
  userTokenToCome: TokenBalance,
  getPropertyToken: (address: string) => PropertiesERC20 | undefined,
  farmPerformance: DetailedBalanceSheet,
): CardData {
  const siteReference =
    farm.sites[farm.slug === 'delta' ? 0 : farm.sites.length - 1];
  const tokenProperties = getPropertyToken(farm.token.address);
  const tokenSupply = tokenProperties
    ? tokenProperties.supply
    : farm.token.supply;
  const expenses = new BigNumber(farmPerformance.balance.expenses.csm.usd)
    .plus(farmPerformance.balance.expenses.operator.usd)
    .plus(farmPerformance.balance.expenses.electricity.usd)
    .toNumber();

  return {
    id: siteId,
    label: farm.name,
    dataMissing: false,
    income: {
      available: true,
      mined: {
        btc: userShare
          .times(farmPerformance.balance.incomes.mining.btc)
          .toNumber(),
        usd: userShare
          .times(farmPerformance.balance.incomes.mining.usd)
          .toNumber(),
      },
      net: {
        balance: {
          btc: userShare
            .times(farmPerformance.balance.revenue.net.btc)
            .toNumber(),
          usd: userShare
            .times(farmPerformance.balance.revenue.net.usd)
            .toNumber(),
        },
        apy: 0,
      },
      gross: {
        balance: {
          btc: userShare
            .times(farmPerformance.balance.revenue.gross.btc)
            .toNumber(),
          usd: userShare
            .times(farmPerformance.balance.revenue.gross.usd)
            .toNumber(),
        },
        apy: 0,
      },
      grossDepreciationFree: {
        balance: {
          btc: userShare
            .times(farmPerformance.balance.revenue.gross.btc)
            .toNumber(),
          usd: userShare
            .times(farmPerformance.balance.revenue.gross.usd)
            .toNumber(),
        },
        apy: 0,
      },
    },

    token: {
      balance: userToken.balance,
      value: userToken.usd,
      percent: userShare.toNumber(),
      supply: tokenSupply,
      url: farm.token.gnosisscanUrl,
      symbol: farm.token.symbol,
      address: farm.token.address,
      decimal: 9,
      image: 'https://cleansatmining.com/data/files/logo_csm.png',
      amountToCome: userTokenToCome.balance,
      valueToCome: userTokenToCome.usd,
    },
    site: {
      operator: {
        name: siteReference.operator.name,
        logo: siteReference.operator.logo,
        website: siteReference.operator.website,
      },
      miningStart: siteReference.started_at ? siteReference.started_at : '',
      machines: farmPerformance.equipments.asics.reduce(
        (acc, asic) => acc + asic.units,
        0,
      ),

      hashrate: convertHashrateTHsToHs(
        farmPerformance.equipments.hashrateTHsMax,
      ),
      equipmentCost: farmPerformance.equipments.totalCost,
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
        hashrate: convertHashrateTHsToHs(
          farmPerformance.equipments.hashrateTHs,
        ),
        hashratePercent: farmPerformance.equipments.uptime * 100,
        //onPeriod: realPeriod,
        days: realPeriod,
        machines: farmPerformance.equipments.asics
          .reduce((acc, asic) => acc.plus(asic.units), new BigNumber(0))
          .times(farmPerformance.equipments.uptime)
          .toNumber(),
        mined: {
          btc: farmPerformance.balance.incomes.mining.btc,
          usd: farmPerformance.balance.incomes.mining.usd,
        },
        earned: {
          btc: farmPerformance.balance.revenue.net.btc,
          usd: farmPerformance.balance.revenue.net.usd,
        },
        earnedTaxFree: {
          btc: farmPerformance.balance.revenue.gross.btc,
          usd: farmPerformance.balance.revenue.gross.usd,
        },
        costs: {
          electricity: farmPerformance.balance.expenses.electricity.usd,
          feeCSM: farmPerformance.balance.expenses.csm.usd,
          feeOperator: farmPerformance.balance.expenses.operator.usd,
          provision: farmPerformance.balance.expenses.depreciation.usd,
          taxe: 0,
          total: expenses,
          totalTaxeFree: expenses,
        },
        hashratePeriods: hashratePeriods(farmPerformance.details),
      },
    },
  };
}

function hashratePeriods(details: BalanceSheet[]): HashratePeriod[] {
  const periods = details.map((detail) => ({
    start: new Date(detail.start),
    end: new Date(detail.end),
    equipmentUninstalled: [],
    hashrateHs: convertHashrateTHsToHs(detail.equipments.hashrateTHs),
    hashrateMax: convertHashrateTHsToHs(detail.equipments.hashrateTHsMax),
    equipmentInstalled: equipmentsInstalled(detail),
  }));
  return periods;
}

function equipmentsInstalled(balancesheet: BalanceSheet): {
  date: Date;
  hashrateHs: number;
  units: number;
  model: string;
  powerW: number;
}[] {
  const equipments = balancesheet.equipments.asics.map((asic) => ({
    date: new Date(balancesheet.start),
    hashrateHs: convertHashrateTHsToHs(asic.hashrateTHs),
    units: asic.units,
    model: asic.manufacturer + ' ' + asic.model,
    powerW: asic.powerW,
  }));
  return equipments;
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

function convertHashrateTHsToHs(hashrateTHs: number): number {
  return new BigNumber(hashrateTHs)
    .times(new BigNumber(10).exponentiatedBy(12))
    .toNumber();
}
