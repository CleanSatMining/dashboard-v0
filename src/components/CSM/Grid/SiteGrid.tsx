import { FC, memo, useEffect, useState } from 'react';

import { Flex, Grid } from '@mantine/core';

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
  const [address, setAddress] = useState(account ?? '');

  useEffect(() => {
    setAddress(account ?? '');
  }, [account]);

  const [csmPeriod, setCsmPeriod] = useState(period);
  useEffect(() => {
    setCsmPeriod(period);
  }, [setCsmPeriod, period]);

  console.log('SITE GRID', csmPeriod);

  return (
    <Flex gap={'md'} direction={'column'} align={'center'}>
      <Grid gutterMd={25} style={{ width: '100%' }}>
        {ALLOWED_SITES.length > 0
          ? ALLOWED_SITES.map((i) => (
              <Grid.Col md={6} lg={4} key={`grid-${i}`}>
                <SiteCard
                  siteId={i}
                  siteState={states[i]}
                  account={address}
                  btcPrice={btcPrice}
                  period={csmPeriod}
                ></SiteCard>
              </Grid.Col>
            ))
          : // TODO: add message when no offers
            undefined}
      </Grid>
    </Flex>
  );
};

export const SiteGrid = memo(_SiteGrid);
