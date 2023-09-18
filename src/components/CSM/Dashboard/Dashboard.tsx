import { FC, useEffect, useState } from 'react';

import { Center, Loader } from '@mantine/core';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { MiningSiteSummary } from '../../../hooks/useMiningSummary';
import { Balance } from '../../../hooks/useWalletERC20Balance';
import { SummaryGrid } from '../Grid/SummaryGrid';
import { SiteGrid } from '../Grid/SiteGrid';

type UserAssetsProps = {
  account: string;
  price: number;
  period: number;
  miningStates: { [siteId: string]: MiningSiteSummary };
  balances: { [tokenAddress: string]: Balance };
};

const _Dashboard: FC<UserAssetsProps> = ({ account, price, period }) => {
  const userState = useAppSelector(selectUsersState);
  //const dispatch = useAppDispatch();
  const [spinner, setSpinner] = useState(true);

  useEffect(() => {
    setSpinner(
      userState.byAddress[account] === undefined ||
        userState.byAddress[account].bySite === undefined ||
        userState.byAddress[account].bySite['1'] === undefined,
    );
  }, [userState, account, spinner]);

  return (
    <>
      {/* {spinner && <Loader color={'lime'} size={'xl'} />} */}

      {spinner && (
        <Center maw={400} h={100} mx={'auto'}>
          <Loader color={'brand'} size={'xl'} />
        </Center>
      )}

      {!spinner && (
        <>
          <SummaryGrid
            account={account}
            btcPrice={price}
            period={period}
          ></SummaryGrid>
          <SiteGrid
            account={account}
            btcPrice={price}
            period={period}
          ></SiteGrid>
        </>
      )}
    </>
  );
};

export const Dashboard = _Dashboard;
