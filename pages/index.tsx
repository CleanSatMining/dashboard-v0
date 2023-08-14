import { NextPage } from 'next';

import { Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import Display from 'src/components/Display/Display';
import 'src/components/Market';
import { useProvider } from 'src/hooks/useProvider';
import { ConnectedProvider } from 'src/providers/ConnectProvider';

const HomePage: NextPage = () => {
  const { isLoaded } = useProvider();
  const isMobile = useMediaQuery('(max-width: 36em)');
  return (
    <ConnectedProvider>
      <Flex
        my={isMobile ? 0 : 'lg'}
        direction={'column'}
        sx={{
          marginLeft: isMobile ? '-20px' : undefined,
          marginRight: isMobile ? '-20px' : undefined,
        }}
      >
        {isLoaded && <Display />}
      </Flex>
    </ConnectedProvider>
  );
};

export default HomePage;
