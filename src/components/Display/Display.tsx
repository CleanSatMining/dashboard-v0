import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedControl } from '@mantine/core';
import { useWeb3React } from '@web3-react/core';

import { CSMPeriodState, CSMStates } from 'src/types/CSMState';
import { Displays } from 'src/types/Displays';

import { ALLOWED_SITES, DAYS_PERIODS, SITES, SiteID } from '../../constants';
import { useBitcoinOracle } from '../../hooks/useBitcoinOracle';
import {
  SiteMiningState,
  SiteUser,
  useMiningStates,
} from '../../hooks/useMiningStates';
import {
  Balance,
  useWalletERC20Balances,
} from '../../hooks/useWalletERC20Balance';
import { AssetGrid } from '../CSM/Grid/AssetGrid';
import { SiteGrid } from '../CSM/Grid/SiteGrid';
import { AddressInput } from '../CSM/UserInput/UserInput';

interface ApiAdmin {
  admin: boolean;
}
interface Display {
  display: Displays;
  title: string;
  component: React.ReactElement;
}
const Display: FC = () => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { account: accountAddress } = useWeb3React();
  const [account, setAccount] = useState(
    accountAddress
      ? accountAddress
      : '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0'
  );
  const [adminData, setAdminData] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const address = accountAddress;
      try {
        const result = await fetch('/api/admin/' + address, {
          method: 'POST',
          body: JSON.stringify(''),
        });

        if (result.ok) {
          const responseData: ApiAdmin = await result.json();
          setAdminData(responseData.admin);

          setAccount(accountAddress ? accountAddress : '');
          console.log('DISPLAY account set ', accountAddress);
        } else {
          setAdminData(false);
          setAccount(accountAddress ? accountAddress : '');
          console.error("Erreur lors de la récupération des données de l'API.");
        }
        console.log('DISPLAY account', account, accountAddress);
      } catch (error) {
        console.error('Erreur réseau : ', error);
      }
    };

    fetchData();
  }, [accountAddress, account]);

  const [period, setPeriod] = useState(DAYS_PERIODS[0].toString());

  const {
    users,
    tokenAddress: tokenAddresses,
  }: { users: SiteUser[]; tokenAddress: string[] } =
    getMiningSiteQueryParameters();

  const { price } = useBitcoinOracle();
  const { states } = useMiningStates(users, DAYS_PERIODS);
  const { balances } = useWalletERC20Balances(tokenAddresses, account);

  const csmState: CSMStates = getCsmState(balances, states);

  const dataSegmentedControl: { label: string; value: string }[] =
    DAYS_PERIODS.map((d) => {
      return {
        label: d > 1 ? d + t('days') : d + t('day'),
        value: d.toString(),
      };
    });

  return (
    <>
      {adminData && (
        <AddressInput
          initialValue={account}
          setAccount={setAccount}
          updateAccount={(a: string) => {
            if (a !== account) {
              console.log('WARNING account changed', account, a);
            }
          }}
        ></AddressInput>
      )}
      <Flex
        mih={70}
        gap={'xl'}
        justify={'center'}
        align={'center'}
        direction={'row'}
        wrap={'wrap'}
      >
        <SegmentedControl
          data={dataSegmentedControl}
          w={500}
          radius={50}
          value={period}
          onChange={setPeriod}
        />
      </Flex>

      <AssetGrid
        account={account}
        btcPrice={price}
        states={csmState}
        period={Number(period)}
      ></AssetGrid>
      <SiteGrid
        account={account}
        btcPrice={price}
        period={Number(period)}
        states={csmState}
      ></SiteGrid>
    </>
  );
};
export default Display;

function getCsmState(
  balances: { [tokenAddress: string]: Balance },
  states: {
    [siteId: string]: {
      siteId: string;
      states: {
        [byPeriod: number]: SiteMiningState;
      };
    };
  }
) {
  const csmState: CSMStates = {};
  for (const siteId of ALLOWED_SITES) {
    const csmTokenAddress = SITES[siteId as SiteID].token.address;

    if (
      balances[csmTokenAddress] !== undefined &&
      balances[csmTokenAddress].balance > 0
    ) {
      const byPeriod: {
        [days: number]: CSMPeriodState;
      } = initializePeriodData();

      csmState[siteId] = {
        id: siteId,

        state: {
          incomes: {
            byPeriod,
          },
          user: {
            token: {
              balance: balances[csmTokenAddress].balance,
            },
          },
        },
      };
      const state = states[siteId];
      if (state !== undefined) {
        for (const period of DAYS_PERIODS) {
          if (state.states[period] !== undefined) {
            csmState[siteId].state.incomes.byPeriod[period] = {
              days: period,
              revenue: state.states[period].revenue,
              uptimePercentage: state.states[period].uptimePercentage,
              activeDays: state.states[period].activeDays,
              uptimeTotalDays: state.states[period].uptimeTotalDays,
              uptimeTotalMachines: state.states[period].uptimeTotalMachines,
              electricityCost: state.states[period].electricityCost,
            };
          }
        }
      }
    }
  }
  return csmState;
}

function getMiningSiteQueryParameters() {
  const users: SiteUser[] = [];
  const tokenAddress: string[] = [];
  for (const siteId of ALLOWED_SITES) {
    const username = SITES[siteId as SiteID].api.username;
    if (username !== undefined) {
      users.push({ siteId, username });
    }
    tokenAddress.push(SITES[siteId as SiteID].token.address);
  }
  return { users, tokenAddress };
}

function initializePeriodData() {
  const byPeriod: {
    [days: number]: CSMPeriodState;
  } = {};
  for (const period of DAYS_PERIODS) {
    byPeriod[period] = {
      days: period,
      revenue: 0,
      uptimePercentage: 0,
      activeDays: 0,
      uptimeTotalDays: 0,
      uptimeTotalMachines: 0,
      electricityCost: 0,
    };
  }
  return byPeriod;
}
