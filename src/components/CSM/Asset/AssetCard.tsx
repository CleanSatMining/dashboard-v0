import { FC, memo, useEffect, useState } from 'react';

import { ActionIcon, Card, Center, Group, Text, Title } from '@mantine/core';
import { TablerIcon } from '@tabler/icons';

export type Data = {
  label: string;
  value: string;
};

type SiteProps = {
  title?: string;
  Icon?: TablerIcon;
  value?: string;
  data?: Data[];
};

const _AssetCard: FC<SiteProps> = ({ title, Icon, value, data }) => {
  return (
    <>
      <Card shadow={'sm'} padding={'lg'} radius={'md'} withBorder={true}>
        <Group position={'apart'} mt={'0'} mb={'xs'}>
          <Title order={2}>{title}</Title>
          {Icon && (
            <ActionIcon variant={'transparent'}>
              <Icon></Icon>
            </ActionIcon>
          )}
        </Group>
        <Center>
          <Title order={3} color={'dimmed'}>
            {value}
          </Title>
        </Center>

        {data?.map((i) => (
          <Group position={'apart'} mt={'xs'} mb={'xs'} key={`group-${i}`}>
            <Text fz={'sm'}>{'CSM-xxx'}</Text>
            <Text fz={'sm'}>{'1000'}</Text>
          </Group>
        ))}

        <Group position={'apart'} mt={'xs'} mb={'xs'}>
          <Text fz={'sm'}>{'CSM-alpha'}</Text>
          <Text fz={'sm'}>{'1000'}</Text>
        </Group>
        <Group position={'apart'} mt={'xs'} mb={'xs'}>
          <Text fz={'sm'}>{'CSM-beta'}</Text>
          <Text fz={'sm'}>{'1000'}</Text>
        </Group>
        <Group position={'apart'} mt={'xs'} mb={'xs'}>
          <Text fz={'sm'}>{'CSM-gamma'}</Text>
          <Text fz={'sm'}>{'1000'}</Text>
        </Group>
      </Card>
    </>
  );
};

export const AssetCard = memo(_AssetCard);
