import { FC, useEffect, useState } from 'react';

import { Flex, Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { ALLOWED_SITES } from '../../../constants';
import { CSMStates } from '../../../types/CSMState';
import { SiteCard } from '../Site/SiteCard';

type SiteProps = {
  btcPrice: number;
  states: CSMStates;
  period: number;
  account?: string;
};

const _SiteGrid: FC<SiteProps> = ({ account, btcPrice, states, period }) => {
  const [hasBalance, setHasBalance] = useState<boolean[]>(
    ALLOWED_SITES.map(() => true)
  );
  const [address, setAddress] = useState(account ?? '');

  useEffect(() => {
    setAddress(account ?? '');
  }, [account]);

  const [csmPeriod, setCsmPeriod] = useState(period);
  useEffect(() => {
    setCsmPeriod(period);
  }, [setCsmPeriod, period]);

  console.log('SITE GRID', csmPeriod);

  function setShallDisplay(siteId: number, shallDisplay: boolean): void {
    // const display = [...hasBalance];
    // display[siteId] = shallDisplay;
    // setHasBalance(() => display);

    hasBalance[siteId] = shallDisplay;
  }

  return (
    <Flex gap={0} direction={'column'} align={'center'}>
      <Grid gutter={0} gutterMd={25} gutterXs={'xs'} style={{ width: '100%' }}>
        {ALLOWED_SITES.length > 0
          ? ALLOWED_SITES.filter((id) => hasBalance[Number(id)]).map((i) => (
              <Grid.Col md={6} lg={4} key={`grid-${i}`}>
                <SiteCard
                  siteId={i}
                  siteState={states[i]}
                  account={address}
                  btcPrice={btcPrice}
                  period={csmPeriod}
                  shallDisplay={(siteId: number, shallDisplay: boolean) =>
                    setShallDisplay(siteId, shallDisplay)
                  }
                ></SiteCard>
              </Grid.Col>
            ))
          : // TODO: add message when no offers
            undefined}
      </Grid>
    </Flex>
  );
};

export const SiteGrid = _SiteGrid;
