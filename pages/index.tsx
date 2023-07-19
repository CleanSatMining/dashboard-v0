import { NextPage } from 'next';

import { Flex } from '@mantine/core';

import Display from 'src/components/Display/Display';
import 'src/components/Market';
import { MarketTableFilter } from 'src/components/Market/Filters';
import { ConnectedProvider } from 'src/providers/ConnectProvider';

const HomePage: NextPage = () => {
  return (
    <ConnectedProvider>
      <Flex my={'xl'} direction={'column'}>
        <Display />
      </Flex>
    </ConnectedProvider>
  );
};

export default HomePage;
