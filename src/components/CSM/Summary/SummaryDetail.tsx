import { FC, memo } from 'react';

import { Accordion, Group, Text } from '@mantine/core';

import { Data } from './SummaryType';

type SummaryDetailProps = {
  data: Data[];
};

const _SummaryDetailCard: FC<SummaryDetailProps> = ({ data }) => {
  return (
    <Accordion
      radius={'xl'}
      variant={'separated'}
      defaultValue={''}
      w={'100%'}
      styles={{
        label: {
          padding: '0',
          marginBottom: '5px',
        },
        content: {
          paddingBottom: '0',
          paddingLeft: '0',
          paddingRight: '0',
        },
        item: {
          // styles added to all items
          backgroundColor: 'transparent',
          border: '0',
          padding: '0',
          margin: '0',

          // styles added to expanded item
          '&[data-active]': {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <Accordion.Item value={'detail'} sx={{ padding: 0, margin: 0 }}>
        <Accordion.Control sx={{ padding: 0, margin: 0 }}>
          {'Detail'}
        </Accordion.Control>
        <Accordion.Panel sx={{ padding: 0, margin: 0 }}>
          {data?.map((setting, i) => (
            <Group
              position={'apart'}
              mt={'0'}
              mb={'0'}
              key={`group-${i}`}
              grow={false}
            >
              <Text fz={'sm'} color={'dimmed'}>
                {setting.label}
              </Text>
              <Text truncate={true} fz={'sm'}>
                {setting.value}
              </Text>
            </Group>
          ))}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export const SummaryDetailCard = memo(_SummaryDetailCard);
