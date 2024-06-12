import { FC } from 'react';

import {
  Space,
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
import { TablerIcon } from '@tabler/icons-react';
import { Data } from './SummaryType';
import { SummaryDetailCard } from './SummaryDetail';

const useStyle = createStyles((theme: MantineTheme) => ({
  brand: {
    color: theme.colors.brand[0],
  },
}));

type SummariesProps = {
  title?: string;
  Icon?: TablerIcon;
  valueTitle1?: string;
  value1?: string;
  subValue1?: string;
  valueTitle2?: string;
  value2?: string;
  subValue2?: string;
  data: Data[];
};

const _SummariesCard: FC<SummariesProps> = ({
  title,
  Icon,
  valueTitle1,
  value1,
  subValue1,
  valueTitle2,
  value2,
  subValue2,
  data,
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
        <Group position={'apart'} noWrap={false} spacing={0}>
          <Title order={isMobile ? 6 : 3}>{title}</Title>
          {Icon && (
            <ActionIcon variant={'transparent'}>
              <Icon className={classes.brand}></Icon>
            </ActionIcon>
          )}
        </Group>
        <Group position={'apart'} mt={'0'} mb={0}>
          <Flex
            mih={isMobile ? 30 : 50}
            //gap={'md'}
            justify={'flex-start'}
            align={'flex-start'}
            direction={'column'}
            wrap={'wrap'}
          >
            <Text color={'dimmed'} size={isMobile ? 12 : undefined}>
              {valueTitle1}
            </Text>
            <Title order={isMobile ? 5 : 4} color={'brand'}>
              {value1}
            </Title>
            {subValue1 !== undefined && (
              <Text color={'dimmed'} size={isMobile ? 12 : undefined}>
                {subValue1}
              </Text>
            )}
          </Flex>
          <Flex
            mih={isMobile ? 30 : 50}
            //gap={'md'}
            justify={'flex-end'}
            align={'flex-end'}
            direction={'column'}
            wrap={'wrap'}
          >
            <Text color={'dimmed'} size={isMobile ? 12 : undefined}>
              {valueTitle2}
            </Text>
            <Title order={isMobile ? 5 : 4} color={'brand'}>
              {value2}
            </Title>
            {subValue2 !== undefined && (
              <Text color={'dimmed'} size={isMobile ? 12 : undefined}>
                {subValue2}
              </Text>
            )}
          </Flex>
        </Group>

        {data.length > 0 && (
          <>
            <Space h={'20px'}></Space>{' '}
            <SummaryDetailCard data={data}></SummaryDetailCard>
          </>
        )}
      </Card>
    </>
  );
};

export const SummariesCard = _SummariesCard;
