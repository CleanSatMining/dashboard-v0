import { NextPage } from 'next';

import { Flex } from '@mantine/core';

import Display from 'src/components/Display/Display';
import 'src/components/Market';
import { useProvider } from 'src/hooks/useProvider';
import { ConnectedProvider } from 'src/providers/ConnectProvider';

const HomePage: NextPage = () => {
  const { isLoaded } = useProvider();
  return (
    <ConnectedProvider>
      <Flex my={'xl'} direction={'column'}>
        {isLoaded && <Display />}
      </Flex>
    </ConnectedProvider>
  );
};

export default HomePage;
