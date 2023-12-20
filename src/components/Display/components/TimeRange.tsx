import React, { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Group, Paper, Text, useMantineTheme } from '@mantine/core';
import { formatTimestamp, formatDurationByDay } from 'src/utils/format/format';

interface TimeRangeProps {
  startTimestamp: number;
  endTimestamp: number;
}

export const TimeRange: FC<TimeRangeProps> = ({
  startTimestamp,
  endTimestamp,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('timeframe', { keyPrefix: 'time' });

  return (
    <Group position={'left'} align={'baseline'} spacing={10}>
      <Paper
        shadow={'xs'}
        //p={2}
        withBorder={theme.colorScheme === 'dark' ? true : false}
        sx={{
          padding: '3px 10px 3px 10px',
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : undefined,
        }}
      >
        <Text fw={600} size={'sm'}>
          {formatTimestampRange(startTimestamp, endTimestamp, t)}
        </Text>
      </Paper>
      <Paper
        shadow={'xs'}
        //p={2}
        withBorder={theme.colorScheme === 'dark' ? true : false}
        sx={{
          padding: '3px 10px 3px 10px',
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : undefined,
        }}
      >
        <Text fw={600} size={'sm'}>
          {formatRange(startTimestamp, endTimestamp, t)}
        </Text>
      </Paper>
    </Group>
  );
};

function formatTimestampRange(
  startTimestamp: number,
  endTimestamp: number,
  t: TFunction,
): string {
  return (
    t('from') +
    ' ' +
    formatTimestamp(startTimestamp) +
    ' ' +
    t('to') +
    ' ' +
    formatTimestamp(endTimestamp)
  );
}

function formatRange(
  startTimestamp: number,
  endTimestamp: number,
  t: TFunction,
): string {
  const duration = formatDurationByDay(endTimestamp - startTimestamp, t);

  //const duration = endTimestamp - startTimestamp;

  return duration.toString();
}
