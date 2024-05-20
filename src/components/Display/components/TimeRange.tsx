import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Group, Paper, Text, useMantineTheme } from '@mantine/core';
import { formatTimestamp, formatDurationByDay } from 'src/utils/format/format';

interface TimeRangeProps {
  startTimestamp: number;
  endTimestamp: number;
  isMobile?: boolean;
}

export const TimeRange: FC<TimeRangeProps> = ({
  startTimestamp,
  endTimestamp,
  isMobile = false,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('timeframe', { keyPrefix: 'time' });

  return (
    <Group position={'left'} align={'baseline'} spacing={isMobile ? 4 : 10}>
      {
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
          <Text fw={600} size={isMobile ? 'xs' : 'sm'}>
            {formatTimestampRange(startTimestamp, endTimestamp, t)}
          </Text>
        </Paper>
      }
      <TimeRangeDuration
        endTimestamp={endTimestamp}
        startTimestamp={startTimestamp}
        isMobile={isMobile}
      ></TimeRangeDuration>
    </Group>
  );
};

export const TimeRangeDuration: FC<TimeRangeProps> = ({
  startTimestamp,
  endTimestamp,
  isMobile = false,
}) => {
  const theme = useMantineTheme();
  const { t } = useTranslation('timeframe', { keyPrefix: 'time' });

  return (
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
      <Text fw={600} size={isMobile ? 'xs' : 'sm'}>
        {formatRange(startTimestamp, endTimestamp, t)}
      </Text>
    </Paper>
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
