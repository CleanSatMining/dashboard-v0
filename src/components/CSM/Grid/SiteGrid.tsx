import { FC, useEffect, useState } from 'react';

import { Flex, Grid } from '@mantine/core';

import { useAppSelector } from 'src/hooks/react-hooks';
import { selectUsersState } from 'src/store/features/userData/userDataSelector';

import { ALLOWED_SITES } from '../../../constants';
import { SiteCard } from '../Site/SiteCard';

type SiteProps = {
  btcPrice: number;
  period: number;
  account: string;
};

const _SiteGrid: FC<SiteProps> = ({ account, btcPrice, period }) => {
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

  return (
    <Flex gap={0} direction={'column'} align={'center'}>
      <Grid gutter={0} gutterMd={25} gutterXs={'xs'} style={{ width: '100%' }}>
        {ALLOWED_SITES.length > 0
          ? ALLOWED_SITES.filter((id) => hasBalance[Number(id) - 1]).map(
              (i) => (
                <Grid.Col md={6} lg={4} key={`grid-${i}`}>
                  <SiteCard
                    siteId={i}
                    account={address}
                    btcPrice={btcPrice}
                    period={csmPeriod}
                    //</Grid.Col>shallDisplay={(siteId: number, shallDisplay: boolean) => setShallDisplay(siteId, shallDisplay)
                  ></SiteCard>
                </Grid.Col>
              ),
            )
          : // TODO: add message when no offers
            undefined}
      </Grid>
    </Flex>
  );
};

export const SiteGrid = _SiteGrid;
