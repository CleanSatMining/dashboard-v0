import { FC, useState } from 'react';

import { Center, Loader } from '@mantine/core';

import { CSMPeriodState, CSMStates } from 'src/types/CSMState';

import { ALLOWED_SITES, DAYS_PERIODS, SITES, SiteID } from '../../../constants';
import {
  MiningSiteState,
  MiningSiteStateByPeriods,
} from '../../../hooks/useMiningStates';
import {
  Balance,
  useWalletERC20Balances,
} from '../../../hooks/useWalletERC20Balance';
import { AssetGrid } from '../Grid/AssetGrid';
import { SiteGrid } from '../Grid/SiteGrid';

type UserAssetsProps = {
  account: string;
  price: number;
  period: number;
  miningStates: { [siteId: string]: MiningSiteStateByPeriods };
};

const _UserAssets: FC<UserAssetsProps> = ({
  account,
  price,
  period,
  miningStates,
}) => {
  const [spinner, setSpinner] = useState(false);
  const { tokenAddress: tokenAddresses }: { tokenAddress: string[] } =
    getCSMTokenAddresses();

  const { balances } = useWalletERC20Balances(
    tokenAddresses,
    account,
    (loadingComplete: boolean) => setSpinner(!loadingComplete)
  );

  console.log(
    'WARNING RENDER ASSETS',
    account
    //JSON.stringify(balances, null, 4)
  );

  const csmUserState: CSMStates = getCsmState(balances, miningStates);

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
          <AssetGrid
            account={account}
            btcPrice={price}
            states={csmUserState}
            period={period}
          ></AssetGrid>
          <SiteGrid
            account={account}
            btcPrice={price}
            period={period}
            states={csmUserState}
          ></SiteGrid>
        </>
      )}
    </>
  );
};

export const UserAssets = _UserAssets;

function getCsmState(
  balances: { [tokenAddress: string]: Balance },
  states: {
    [siteId: string]: {
      siteId: string;
      states: {
        [byPeriod: number]: MiningSiteState;
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

function getCSMTokenAddresses() {
  const tokenAddress: string[] = [];
  for (const siteId of ALLOWED_SITES) {
    tokenAddress.push(SITES[siteId as SiteID].token.address);
  }
  return { tokenAddress };
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
