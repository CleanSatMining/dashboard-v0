import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, SegmentedControl } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useWeb3React } from '@web3-react/core';

import { Displays } from 'src/types/Displays';

import { ALLOWED_SITES, DAYS_PERIODS, filterMobile } from '../../constants';
import { API_ADMIN } from '../../constants/apis';
import { useBitcoinOracle } from '../../hooks/useBitcoinOracle';
import { useMiningSitesStatesByPeriods } from '../../hooks/useMiningStates';
import { UserAssets } from '../CSM/Assets/UserAssets';
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
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { account: accountAddress } = useWeb3React();
  const [account, setAccount] = useState(
    accountAddress
      ? accountAddress
      : '0xC78f0e746A2e6248eE6D57828985D7fD8d6B33B0'
  );
  const [adminData, setAdminData] = useState<boolean>(false);
  useEffect(() => {
    // console.log('WARNING DISPLAY CHANGE ACCOUNT', accountAddress);
    if (accountAddress) {
      setAccount(accountAddress);
    }
    const fetchData = async () => {
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

    fetchData();
  }, [accountAddress]);

  const [period, setPeriod] = useState(
    DAYS_PERIODS.filter(filterMobile(isMobile))[0].toString()
  );

  const { price } = useBitcoinOracle();
  const { states: globalState } = useMiningSitesStatesByPeriods(
    ALLOWED_SITES,
    DAYS_PERIODS.filter(filterMobile(isMobile))
  );

  const dataSegmentedControl: { label: string; value: string }[] =
    DAYS_PERIODS.filter(filterMobile(isMobile)).map((d) => {
      let label = '';
      if (d >= 360 && d <= 366) {
        label = 1 + t('year');
      } else if (Math.round(d / 30) === d / 30) {
        label =
          Math.round(d / 30) +
          (Math.round(d / 30) > 1 ? t('months') : t('month'));
      } else if (Math.round(d / 31) === d / 31) {
        label =
          Math.round(d / 31) +
          (Math.round(d / 31) > 1 ? t('months') : t('month'));
      } else if (Math.ceil(d / 30) >= d / 30 && Math.ceil(d / 31) <= d / 31) {
        label =
          Math.ceil(d / 31) +
          (Math.ceil(d / 31) > 1 ? t('months') : t('month'));
      } else {
        label = d > 1 ? d + t('days') : d + t('day');
      }

      return {
        label: label,
        value: d.toString(),
      };
    });

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
      <UserAssets
        account={account}
        miningStates={globalState}
        period={Number(period)}
        price={price}
      ></UserAssets>
    </>
  );
};
export default Display;
