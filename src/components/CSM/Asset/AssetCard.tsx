import { FC, memo, useEffect, useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Card,
  Flex,
  Group,
  Text,
  Title,
} from '@mantine/core';
import { TablerIcon } from '@tabler/icons';

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

const _AssetCard: FC<SiteProps> = ({ title, Icon, value, data, subValue }) => {
  return (
    <>
      <Card shadow={'sm'} padding={'lg'} radius={'md'} withBorder={true}>
        <Group position={'apart'} mt={'0'} mb={'xs'}>
          <Title order={2}>{title}</Title>
          {Icon && (
            <ActionIcon variant={'transparent'}>
              <Icon color={'green'}></Icon>
            </ActionIcon>
          )}
        </Group>

        <Flex
          mih={50}
          //gap={'md'}
          justify={'flex-start'}
          align={'flex-start'}
          direction={'column'}
          wrap={'wrap'}
        >
          <Title order={3} color={'green'}>
            {value}
          </Title>
          {subValue !== undefined && <Text color={'dimmed'}>{subValue}</Text>}
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

export const AssetCard = memo(_AssetCard);
