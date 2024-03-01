import React, { FC, useEffect, useState } from 'react';

import { useMediaQuery } from '@mantine/hooks';
import { useWeb3React } from '@web3-react/core';

import { useAppDispatch } from 'src/hooks/react-hooks';
import { siteAddedDispatchType } from 'src/store/features/miningData/miningDataSlice';
import { userAddedDispatchType } from 'src/store/features/userData/userDataSlice';
import { Displays } from 'src/types/Displays';
import {
  MiningSummaryPerDay,
  SiteMiningHistory,
  UserSummary,
} from 'src/types/mining/Mining';
import { useAtom } from 'jotai';
import { ALLOWED_SITES, DAYS_PERIODS, filterMobile } from '../../constants';
import { API_ADMIN } from '../../constants/apis';
import { useBitcoinOracle } from '../../hooks/useBitcoinOracle';
import { useMiningSitesSummary } from '../../hooks/useMiningSummary';
import { useWalletERC20Balances } from '../../hooks/useWalletERC20Balance';
import { Dashboard } from '../CSM/Dashboard/Dashboard';
import { AccountSelect } from '../CSM/AccountSelect/AccountSelect';
import { getCSMTokenAddress, getCSMTokenAddresses } from '../CSM/Utils/yield';

import ControlPanel from './components/ControlPanel';
import { PredefinedPeriods } from './components/Types';
import { btcPriceAtom } from 'src/states';
import { MiningExpenses } from 'src/types/mining/Mining';
import { expensesAddedDispatchType } from 'src/store/features/miningData/miningDataSlice';
import { API_MINING_EXPENSES } from 'src/constants/apis';
import { AnonymeUserData } from 'src/types/payments';
import { API_USERS_PAYMENTS } from 'src/constants/apis';

interface ApiAdmin {
  admin: boolean;
}
interface Display {
  display: Displays;
  title: string;
  component: React.ReactElement;
}
const Display: FC = () => {
  const [dateModeChecked, setDateModeChecked] = useState(true);
  const isMobile = useMediaQuery('(max-width: 36em)');
  const dispatch = useAppDispatch();
  const { account: accountAddress } = useWeb3React();
  const [account, setAccount] = useState(
    accountAddress
      ? accountAddress
      : '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0',
  );
  const [adminData, setAdminData] = useState<boolean>(false);

  const [period, setPeriod] = useState(
    DAYS_PERIODS.filter(filterMobile(isMobile))[0].toString(),
  );
  const { price } = useBitcoinOracle();
  const [btcPrice, setBtcPrice] = useAtom(btcPriceAtom);
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
  const [startTimestamp, setStartTimestamp] = useState<number>(0);
  const [endTimestamp, setEndTimestamp] = useState<number>(0);
  const [paymentsData, setPaymentsData] = useState<{
    [siteId: string]: AnonymeUserData;
  }>({});

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

  useEffect(() => {
    dispatchMiningSummary();

    function dispatchMiningSummary() {
      for (const siteId of ALLOWED_SITES) {
        if (globalState[siteId] && globalState[siteId].days) {
          const days: MiningSummaryPerDay[] = globalState[siteId].days;
          const data: SiteMiningHistory = {
            id: siteId,
            mining: { days },
            token: { byUser: {} },
          };
          dispatch({ type: siteAddedDispatchType, payload: data });
        }
      }
    }
  }, [globalState, dispatch]);

  useEffect(() => {
    setBtcPrice(price);
  }, [price, setBtcPrice]);

  useEffect(() => {
    const fetchData = async () => {
      const miningExpenses: MiningExpenses = {
        byId: {},
      };
      for (const siteId of ALLOWED_SITES) {
        //const expenses = await getExpenses(siteId);
        //miningExpenses.byId[siteId] = expenses;
        try {
          const result = await fetch(API_MINING_EXPENSES.url(siteId), {
            method: API_MINING_EXPENSES.method,
          });
          if (result.ok) {
            const data = await result.json();
            miningExpenses.byId[siteId] = data;
          }
        } catch (e) {
          console.error('Failed to fetch expenses from API: ', e);
        }
      }

      dispatch({ type: expensesAddedDispatchType, payload: miningExpenses });
      return miningExpenses;
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPaymentsData = async (siteId: string) => {
      if (accountAddress === undefined) return;
      try {
        const response = await fetch(
          API_USERS_PAYMENTS.url(accountAddress, siteId),
        );

        if (!response.ok) {
          setPaymentsData((prevData) => ({
            ...prevData,
            [siteId]: {
              usdcSend: 0,
              usdcReceived: 0,
              tokenAmount: 0,
              ethAddress: accountAddress,
            },
          }));
          throw new Error(
            `Erreur lors de la récupération des données pour le site ${siteId}`,
          );
        }
        const result = await response.json();
        const data = result.data as AnonymeUserData[];

        const userData: AnonymeUserData = data.reduce(
          (accumulator, currentData) => {
            return {
              usdcSend: accumulator.usdcSend + currentData.usdcSend,
              usdcReceived: accumulator.usdcReceived + currentData.usdcReceived,
              tokenAmount: accumulator.tokenAmount + currentData.tokenAmount,
              ethAddress: accountAddress,
            };
          },
          {
            usdcSend: 0,
            usdcReceived: 0,
            tokenAmount: 0,
            ethAddress: accountAddress,
          },
        );

        // Mise à jour de l'état avec les données récupérées
        setPaymentsData((prevData) => ({
          ...prevData,
          [siteId]: userData, // Utilisation de siteId comme clé
        }));
      } catch (error) {
        console.error(error);
        setPaymentsData((prevData) => ({
          ...prevData,
          [siteId]: {
            usdcSend: 0,
            usdcReceived: 0,
            tokenAmount: 0,
            ethAddress: accountAddress,
          },
        }));
      }
    };

    // Parcourir tous les IDs de site et récupérer les données de paiement pour chaque site
    ALLOWED_SITES.forEach((siteId) => {
      fetchPaymentsData(siteId);
    });

    dispatchUserSummary();
  }, [account, isLoaded]);

  return (
    <>
      {adminData && (
        <AccountSelect
          initialValue={account}
          setAccount={setAccount}
          updateAccount={(newAccount: string) => {
            if (newAccount !== account) {
              console.log('WARNING account changed', account, newAccount);
            }
          }}
        ></AccountSelect>
      )}
      <ControlPanel
        defaultValue={PredefinedPeriods.Last7Days}
        isMobile={isMobile}
        period={period}
        setPeriod={setPeriod}
        adminData={adminData}
        dateModeChecked={dateModeChecked}
        setDateModeChecked={setDateModeChecked}
        startTimestamp={startTimestamp}
        setStartTimestamp={setStartTimestamp}
        endTimestamp={endTimestamp}
        setEndTimestamp={setEndTimestamp}
      />

      <Dashboard
        account={account}
        miningStates={globalState}
        period={Number(period)}
        price={btcPrice ?? 0}
        balances={balances}
        startDate={dateModeChecked ? startTimestamp : 0} //getTimestampFirstDayOfPreviousMonth(today) : 0
        endDate={dateModeChecked ? endTimestamp : 0} //getTimestampLastDayOfPreviousMonth(today) : 0
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
            toCome: {
              amount: paymentsData[siteId]?.tokenAmount ?? 0,
              usd: paymentsData[siteId]?.usdcReceived ?? 0,
            },
          },
        };
        isUpdated = true;
      }
    }

    if (isUpdated && isLoaded && account === balanceAccount) {
      dispatch({ type: userAddedDispatchType, payload: user });
    }
  }
};

export default Display;
