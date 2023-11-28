import { FC, useEffect, useState } from 'react';

import { Flex, Grid } from '@mantine/core';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { ALLOWED_SITES } from '../../../constants';
import { SiteCard } from 'src/components/CSM/Card/SiteCard';
import { FilterStatus, FilterSite, MiningStatus } from 'src/types/mining/Site';
import { getSite } from 'src/components/CSM/Utils/site';
import { useMediaQuery } from '@mantine/hooks';

type SiteProps = {
  btcPrice: number;
  period: number;
  account: string;
  ownerFilter: FilterSite;
  stateFilter: FilterStatus;
  startDate: number;
  endDate: number;
};

const _SiteGrid: FC<SiteProps> = ({
  account,
  btcPrice,
  period,
  ownerFilter,
  stateFilter,
  startDate,
  endDate,
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
      <Grid gutter={0} gutterMd={25} gutterXs={'xs'} style={{ width: '100%' }}>
        {displayedSites.map((i) => (
          <Grid.Col md={6} lg={4} key={`grid-${i}`}>
            <SiteCard
              siteId={i}
              account={address}
              btcPrice={btcPrice}
              period={csmPeriod}
              isMobile={isMobile}
              endDate={endDate}
              startDate={startDate}
            ></SiteCard>
          </Grid.Col>
        ))}
      </Grid>
    </Flex>
  );
};

export const SiteGrid = _SiteGrid;
