import { NextPage } from 'next';

import { Flex, Card } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import Display from 'src/components/Display/Display';
import 'src/components/Market';
import { useProvider } from 'src/hooks/useProvider';
import { ConnectedProvider } from 'src/providers/ConnectProvider';
import { Indicators } from 'src/components/CSM/Indicators/Indicators';

import Marquee from 'react-fast-marquee';

const HomePage: NextPage = () => {
  const { isLoaded } = useProvider();
  const isMobile = useMediaQuery('(max-width: 36em)');
  return (
    <ConnectedProvider>
      <Card
        radius={0}
        padding={'26px'}
        sx={{
          marginLeft: '-25px',
          marginRight: '-25px',
          overflowX: 'hidden',
        }}
        withBorder={true}
      >
        <Card.Section>
          <Marquee speed={30}>
            <Indicators withLabel={true}></Indicators>
          </Marquee>
        </Card.Section>
      </Card>

      <Flex
        my={0}
        direction={'column'}
        sx={{
          marginLeft: isMobile ? '-20px' : undefined,
          marginRight: isMobile ? '-20px' : undefined,
          overflowX: 'hidden',
        }}
      >
        {isLoaded && <Display />}
      </Flex>
    </ConnectedProvider>
  );
};

export default HomePage;
