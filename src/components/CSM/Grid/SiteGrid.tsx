import { FC, useEffect, useState } from 'react';

import { Flex, Grid } from '@mantine/core';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { ALLOWED_SITES } from '../../../constants';
import { SiteCard } from 'src/components/CSM/Card/SiteCard';
import { FilterStatus, FilterSite, MiningStatus } from 'src/types/mining/Site';
import { getSite } from 'src/components/CSM/Utils/site';
import { useMediaQuery } from '@mantine/hooks';
import {
  AddErc20ToWalletWidget,
  AddNftToWalletPaperWidget,
} from '../Wallet/AddTokenToWallet';

type SiteProps = {
  btcPrice: number;
  period: number;
  account: string;
  ownerFilter: FilterSite;
  stateFilter: FilterStatus;
};

const _SiteGrid: FC<SiteProps> = ({
  account,
  btcPrice,
  period,
  ownerFilter,
  stateFilter,
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const usersState = useAppSelector(selectUsersState);
  const [hasBalance, setHasBalance] = useState<boolean[]>(
    ALLOWED_SITES.map((siteId) => getShallDisplay(siteId)),
  );
  useEffect(() => {
    function getShallDisplay(siteId: string): boolean {
      if (
        usersState &&
        usersState.byAddress &&
        usersState.byAddress[account] &&
        usersState.byAddress[account].bySite &&
        usersState.byAddress[account].bySite[siteId] &&
        usersState.byAddress[account].bySite[siteId].token
      ) {
        return usersState.byAddress[account].bySite[siteId].token.balance > 0;
      }
      return false;
    }

    setHasBalance(ALLOWED_SITES.map((siteId) => getShallDisplay(siteId)));
  }, [account, usersState]);

  const [address, setAddress] = useState(account ?? '');
  useEffect(() => {
    setAddress(account ?? '');
  }, [account]);

  const [csmPeriod, setCsmPeriod] = useState(period);
  useEffect(() => {
    setCsmPeriod(period);
  }, [setCsmPeriod, period]);

  function getShallDisplay(siteId: string): boolean {
    if (
      usersState &&
      usersState.byAddress &&
      usersState.byAddress[account] &&
      usersState.byAddress[account].bySite &&
      usersState.byAddress[account].bySite[siteId] &&
      usersState.byAddress[account].bySite[siteId].token
    ) {
      return usersState.byAddress[account].bySite[siteId].token.balance > 0;
    }
    return false;
  }

  const displayedSites = ALLOWED_SITES.filter(
    (id) =>
      (ownerFilter === FilterSite.all || hasBalance[Number(id) - 1]) &&
      (stateFilter === FilterStatus.all ||
        (stateFilter === FilterStatus.active &&
          getSite(id).status === MiningStatus.active) ||
        (stateFilter === FilterStatus.inactive &&
          getSite(id).status === MiningStatus.inactive)),
  );
  return (
    <Flex gap={0} direction={'column'} align={'center'}>
      <AddErc20ToWalletWidget
        erc20TokenAddress={'0x20D2F2d4b839710562D25274A3e98Ea1F0392D24'}
        erc20TokenSymbol={'CSM-DELTA'}
      ></AddErc20ToWalletWidget>
      <AddNftToWalletPaperWidget
        nftContractAddress={'0x765495Be1E0c23447163f6402D17dEbc9eCeF0E2'}
        nftTokenId={'1'}
        fullAddress={false}
      ></AddNftToWalletPaperWidget>
      <Grid gutter={0} gutterMd={25} gutterXs={'xs'} style={{ width: '100%' }}>
        {displayedSites.map((i) => (
          <Grid.Col md={6} lg={4} key={`grid-${i}`}>
            <SiteCard
              siteId={i}
              account={address}
              btcPrice={btcPrice}
              period={csmPeriod}
              isMobile={isMobile}
              //</Grid.Col>shallDisplay={(siteId: number, shallDisplay: boolean) => setShallDisplay(siteId, shallDisplay)
            ></SiteCard>
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};

export const SiteGrid = _SiteGrid;
