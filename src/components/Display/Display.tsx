import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedControl } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch } from 'src/hooks/react-hooks';
import { siteAddedDispatchType } from 'src/store/features/miningData/miningDataSlice';
import { userAddedDispatchType } from 'src/store/features/userData/userDataSlice';
import { Displays } from 'src/types/Displays';
import {
  MiningSummaryPerDay,
  SiteMiningSummary,
  UserSummary,
} from 'src/types/mining/Mining';

import { ALLOWED_SITES, DAYS_PERIODS, filterMobile } from '../../constants';
import { API_ADMIN } from '../../constants/apis';
import { useBitcoinOracle } from '../../hooks/useBitcoinOracle';
import { useMiningSitesSummary } from '../../hooks/useMiningSummary';
import { useWalletERC20Balances } from '../../hooks/useWalletERC20Balance';
import { Dashboard } from '../CSM/Dashboard/Dashboard';
import { AddressInput } from '../CSM/UserInput/UserInput';
import { getCSMTokenAddress, getCSMTokenAddresses } from '../CSM/Utils/yield';
import { formatPeriod } from 'src/utils/format/format';

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
  const isMobile = useMediaQuery('(max-width: 36em)');
  const dispatch = useAppDispatch();
  const { account: accountAddress } = useWeb3React();
  const [account, setAccount] = useState(
    accountAddress
      ? accountAddress
      : '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0',
  );
  const [adminData, setAdminData] = useState<boolean>(false);
  useEffect(() => {
    // console.log('WARNING DISPLAY CHANGE ACCOUNT', accountAddress);
    if (accountAddress) {
      setAccount(accountAddress);
    }
    const fetchAdminData = async () => {
      const address: string = accountAddress ?? '';
      try {
        const result = await fetch(API_ADMIN.url(address), {
          method: API_ADMIN.method,
          body: JSON.stringify(''),
        });

        if (result.ok) {
          const responseData: ApiAdmin = await result.json();
          setAdminData(responseData.admin);
        } else {
          setAdminData(false);
          console.error("Erreur lors de la récupération des données de l'API.");
        }
        //console.log('DISPLAY account', account, accountAddress);
      } catch (error) {
        console.error('Erreur réseau : ', error);
      }
    };

    fetchAdminData();
  }, [accountAddress]);

  const [period, setPeriod] = useState(
    DAYS_PERIODS.filter(filterMobile(isMobile))[0].toString(),
  );

  const { price } = useBitcoinOracle();
  const { states: globalState } = useMiningSitesSummary(
    ALLOWED_SITES,
    Math.max(...DAYS_PERIODS),
  );

  const { tokenAddress: tokenAddresses }: { tokenAddress: string[] } =
    getCSMTokenAddresses();
  const {
    balances,
    isLoaded,
    account: balanceAccount,
  } = useWalletERC20Balances(
    tokenAddresses,
    account,
    //(loadingComplete: boolean) => setSpinner(!loadingComplete),
  );

  dispatchMiningSummary();

  useEffect(() => {
    dispatchMiningSummary();

    function dispatchMiningSummary() {
      for (const siteId of ALLOWED_SITES) {
        if (globalState[siteId] && globalState[siteId].days) {
          const days: MiningSummaryPerDay[] = globalState[siteId].days;
          const data: SiteMiningSummary = {
            id: siteId,
            mining: { days },
            token: { byUser: {} },
          };
          dispatch({ type: siteAddedDispatchType, payload: data });
        }
      }
    }
  }, [globalState, dispatch]);

  dispatchUserSummary();

  const dataSegmentedControl: { label: string; value: string }[] =
    fillSegmentedControl();

  // console.log('WARNING RENDER DISPLAY', account);

  return (
    <>
      {adminData && (
        <AddressInput
          initialValue={account}
          setAccount={setAccount}
          updateAccount={(newAccount: string) => {
            if (newAccount !== account) {
              console.log('WARNING account changed', account, newAccount);
            }
          }}
        ></AddressInput>
      )}
      <Flex
        mih={isMobile ? 50 : 70}
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
      <Dashboard
        account={account}
        miningStates={globalState}
        period={Number(period)}
        price={price}
        balances={balances}
      ></Dashboard>
    </>
  );

  /**
   * dispatchUserSummary
   */
  function dispatchUserSummary() {
    let isUpdated = false;
    const user: UserSummary = {
      address: account,
      bySite: {},
    };
    for (const siteId of ALLOWED_SITES) {
      if (balances && balances[getCSMTokenAddress(siteId)]) {
        user.bySite[siteId] = {
          token: {
            balance: balances[getCSMTokenAddress(siteId)].balance,
          },
        };
        isUpdated = true;
      }
    }

    if (isUpdated && isLoaded && account === balanceAccount) {
      dispatch({ type: userAddedDispatchType, payload: user });
    }
  }

  /**
   * fillSegmentedControl
   * @returns
   */
  function fillSegmentedControl(): { label: string; value: string }[] {
    return DAYS_PERIODS.filter(filterMobile(isMobile)).map((d) => {
      const label = formatPeriod(d, t);

      return {
        label: label,
        value: d.toString(),
      };
    });
  }

  /**
   * dispatchMiningSummary
   */
  function dispatchMiningSummary() {
    for (const siteId of ALLOWED_SITES) {
      if (globalState[siteId] && globalState[siteId].days) {
        const days: MiningSummaryPerDay[] = globalState[siteId].days;
        const data: SiteMiningSummary = {
          id: siteId,
          mining: { days },
          token: { byUser: {} },
        };
        dispatch({ type: siteAddedDispatchType, payload: data });
      }
    }
  }
};
export default Display;
