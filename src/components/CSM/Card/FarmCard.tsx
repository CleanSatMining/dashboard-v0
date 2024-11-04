import { FC, useEffect, useState } from 'react';
import { NativeSelect, SelectItem, ActionIcon } from '@mantine/core';
import { useAppSelector } from 'src/hooks/react-hooks';
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
import { HashratePeriod } from 'src/types/mining/Mining';
import BigNumber from 'bignumber.js';
import { useCsmTokens } from 'src/hooks/useCsmTokens';
import { getPeriodFromStart } from '../Utils/period';
import { useAtomValue, useAtom } from 'jotai';
import {
  adminUserAtom,
  userGrossProfitAtom,
  userGrossProfitLastUpdateAtom,
} from 'src/states';
import { IconDownload } from '@tabler/icons-react';

import {
  getUserSiteShare,
  getUserTokenBalance,
  getUserTokenBalanceToCome,
} from '../Utils/yield';
import { API_FARM_BALANCE, API_MINING_DATA } from 'src/constants/apis';

import {
  APIMiningDataQuery,
  DayDataAntpool,
  DayDataFoundry,
  DayDataLuxor,
} from 'src/types/mining/MiningAPI';
import { getTimestampUTC } from 'src/utils/date';
import { getSubSites } from '../Utils/site';
import { BalanceSheet, DetailedBalanceSheet, Farm } from 'src/types/api/farm';
import { fetchFarm } from 'src/store/features/farms/farmSlice';
import { useSelector } from 'react-redux';
import { selectFarm } from 'src/store/features/farms/farmSelector';
import { RootState } from '../../../store/store';
import { useAppDispatch } from 'src/hooks/react-hooks';

type FarmProps = {
  siteId: string;
  btcPrice: number;
  account: string;
  period: number;
  isMobile: boolean;
  startDate: number;
  endDate: number;
  shallDisplay?: (siteId: number, shallDisplay: boolean) => void;
};

const _FarmCard: FC<FarmProps> = ({
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
  const [userGrossProfit, setUserGrossProfit] = useAtom(userGrossProfitAtom);
  const [, setUserGrossProfitLastUpdate] = useAtom(
    userGrossProfitLastUpdateAtom,
  );
  const usersState = useAppSelector(selectUsersState);
  const { getPropertyToken } = useCsmTokens();
  const site: Site = SITES[siteId as SiteID];
  const subSites = getSubSites(site);
  const allSites = [site, ...subSites];
  const [siteValue, setSiteValue] = useState(site.name);
  //const [farm_, setFarm] = useState<Farm>();
  const farm = useSelector((state: RootState) =>
    selectFarm(state, getFarmId(siteId)),
  );
  const dispatch = useAppDispatch();

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

  const [userSiteData, setUserSiteData] = useState<CardData | undefined>(
    farm
      ? buildEmptyUserSiteData(
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
        )
      : undefined,
  );

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

    const dispatchFarmData = async () => {
      //const url = API_FARM.url(farmId);
      //const response = await fetch(url); // Remplacez par votre URL d'API
      //const farmData: Farm = await response.json();
      //console.log('Fetch Farm data:', farmData.slug);
      if (!farm) {
        try {
          dispatch(fetchFarm(farmId));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.log('Farm already fetched at init:', farm.slug);
        //fetchFarmData();
      }

      // const _farm = useSelector((state: RootState) =>
      //   selectFarm(state, getFarmId(siteId)),
      // );

      // if (_farm !== undefined) {
      //   setUserSiteData(
      //     buildEmptyUserSiteData(
      //       siteId,
      //       _farm,
      //       startDate,
      //       realStartTimestamp,
      //       endDate,
      //       endDate,
      //       realPeriod,
      //       period,
      //       userShare,
      //       userToken,
      //       userTokenToCome,
      //       getPropertyToken,
      //     ),
      //   );
      // }
    };

    dispatchFarmData();
  }, []);

  useEffect(() => {
    // appel API pour récupérer les données de minage

    fetchFarmData()();

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

  function fetchFarmData() {
    const farmId = getFarmId(siteId);

    return async () => {
      if (farm !== undefined) {
        console.log('Fetch farm mining data:', farm.slug);
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

          setUserSiteData(
            buildUserSiteData(
              siteId,
              farm,
              startDate,
              new Date(data.start).getTime(),
              endDate,
              new Date(data.end).getTime(),
              data.days,
              period,
              userShare,
              userToken,
              userTokenToCome,
              getPropertyToken,
              data,
            ),
          );

          if (userToken.balance > 0) {
            userGrossProfit.set(
              farm.token.symbol,
              userShare.times(data.balance.revenue.gross.btc).toNumber(),
            );
            setUserGrossProfit(userGrossProfit);
          } else {
            userGrossProfit.delete(farm.token.symbol);
            setUserGrossProfit(userGrossProfit);
          }
          setUserGrossProfitLastUpdate(new Date());
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        console.log('Farm not loaded:', farmId);
      }
    };
  }
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
  // const siteReference =
  //   farm.sites[farm.slug === 'delta' ? 0 : farm.sites.length - 1];
  const siteReference =
    farm.sites.findLast((site) => !site.isClosed && site.mainSite) ??
    farm.sites[farm.sites.length - 1];
  const tokenProperties = getPropertyToken(farm.token.address);
  const tokenSupply = tokenProperties
    ? tokenProperties.supply
    : farm.token.supply;
  const expenses = new BigNumber(farmPerformance.balance.expenses.csm.usd)
    .plus(farmPerformance.balance.expenses.operator.usd)
    .plus(farmPerformance.balance.expenses.electricity.usd)
    .toNumber();

  let electricity = farmPerformance.balance.expenses.electricity.usd;
  let feeCSM = farmPerformance.balance.expenses.csm.usd;
  let feeOperator = farmPerformance.balance.expenses.operator.usd;

  if (siteReference.contract.opTaxRate === 0) {
    electricity = new BigNumber(electricity).plus(feeOperator).toNumber();
    feeOperator = 0;
  }
  if (siteReference.contract.csmTaxRate === 0) {
    electricity = new BigNumber(electricity).plus(feeCSM).toNumber();
    feeCSM = 0;
  }

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
          electricity: electricity,
          feeCSM: feeCSM,
          feeOperator: feeOperator,
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

function buildEmptyUserSiteData(
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
): CardData {
  const data: DetailedBalanceSheet = {
    days: 0,
    start: '',
    end: '',
    details: [],
    equipments: {
      asics: [],
      hashrateTHs: 0,
      hashrateTHsMax: 0,
      powerWMax: 0,
      totalCost: 0,
      uptime: 0,
    },
    balance: {
      btcSellPrice: 0,
      expenses: {
        csm: { btc: 0, usd: 0, source: '' },
        depreciation: { btc: 0, usd: 0, source: '' },
        electricity: { btc: 0, usd: 0, source: '' },
        operator: { btc: 0, usd: 0, source: '' },
        other: { btc: 0, usd: 0, source: '' },
      },
      incomes: {
        mining: { btc: 0, usd: 0, source: '' },
        other: { btc: 0, usd: 0, source: '' },
      },
      revenue: {
        gross: { btc: 0, usd: 0, source: '' },
        net: { btc: 0, usd: 0, source: '' },
      },
    },
  };
  return buildUserSiteData(
    siteId,
    farm,
    instructionStart,
    realStart,
    instructionEnd,
    realEnd,
    realPeriod,
    instructionPeriod,
    userShare,
    userToken,
    userTokenToCome,
    getPropertyToken,
    data,
  );
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
