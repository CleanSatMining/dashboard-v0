import { FC, memo } from 'react';

import {
  Accordion,
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

const useStyle = createStyles((theme: MantineTheme) => ({
  brand: {
    color: theme.colors.brand[0],
  },
}));

export type Data = {
  label: string;
  value: string;
};

type SiteProps = {
  title?: string;
  Icon?: TablerIcon;
  value?: string;
  data: Data[];
  subValue?: string;
};

const _SummaryCard: FC<SiteProps> = ({
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
          wrap={'wrap'}
        >
          <Title order={isMobile ? 5 : 4} color={'brand'}>
            {value}
          </Title>
          {subValue !== undefined && (
            <Text color={'dimmed'} size={isMobile ? 12 : undefined}>
              {subValue}
            </Text>
          )}
        </Flex>

        {data.length > 0 && (
          <Accordion
            radius={'xl'}
            variant={'separated'}
            defaultValue={''}
            styles={{
              item: {
                // styles added to all items
                backgroundColor: 'transparent',
                border: '0',

                // styles added to expanded item
                '&[data-active]': {
                  backgroundColor: 'transparent',
                },
              },
            }}
          >
            <Accordion.Item value={'detail'}>
              <Accordion.Control>{'Detail'}</Accordion.Control>
              <Accordion.Panel>
                {data?.map((setting, i) => (
                  <Group
                    position={'apart'}
                    mt={'xs'}
                    mb={'xs'}
                    key={`group-${i}`}
                  >
                    <Text fz={'sm'}>{setting.label}</Text>
                    <Text fz={'sm'}>{setting.value}</Text>
                  </Group>
                ))}
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        )}
      </Card>
    </>
  );
};

export const SummaryCard = memo(_SummaryCard);
