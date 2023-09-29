import { FC, memo } from 'react';

import {
  ActionIcon,
  Card,
  Flex,
  Group,
  MantineTheme,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { TablerIcon } from '@tabler/icons';
import { Data } from './SummaryType';
import { SummaryDetailCard } from './SummaryDetail';

const useStyle = createStyles((theme: MantineTheme) => ({
  brand: {
    color: theme.colors.brand[0],
  },
}));

type SummaryProps = {
  title?: string;
  Icon?: TablerIcon;
  value?: string;
  data: Data[];
  subValue?: string;
};

const _SummaryCard: FC<SummaryProps> = ({
  title,
  Icon,
  value,
  data,
  subValue,
}) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  return (
    <>
      <Card
        shadow={'sm'}
        padding={isMobile ? 'xs' : 'lg'}
        radius={'md'}
        withBorder={true}
      >
        <Flex direction={'column'} h={'100%'}>
          <Group position={'apart'} mt={'0'} mb={isMobile ? 0 : 'xs'}>
            <Title order={isMobile ? 6 : 3}>{title}</Title>
            {Icon && (
              <ActionIcon variant={'transparent'}>
                <Icon className={classes.brand}></Icon>
              </ActionIcon>
            )}
          </Group>

          <Flex
            mih={isMobile ? 30 : 50}
            //gap={'md'}
            justify={'flex-start'}
            align={'flex-start'}
            direction={'column'}
          >
            <Title order={isMobile ? 5 : 4} color={'brand'}>
              {value}
            </Title>
            {subValue !== undefined && (
              <Text
                color={'dimmed'}
                size={isMobile ? 12 : undefined}
                sx={{ marginBottom: '10px' }}
              >
                {subValue}
              </Text>
            )}
          </Flex>
          <Flex
            //mih={100}
            //bg='rgba(0, 0, 0, .3)'
            //gap='md'
            justify={'flex-end'}
            align={'flex-start'}
            direction={'column'}
            wrap={'wrap'}
            h={'100%'}
            w={'100%'}
          >
            {data.length > 0 && !isMobile && (
              <SummaryDetailCard data={data}></SummaryDetailCard>
            )}
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export const SummaryCard = memo(_SummaryCard);
