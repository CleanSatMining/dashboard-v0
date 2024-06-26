import React from 'react';
import { Text, Group, Tooltip } from '@mantine/core';
import {
  formatPeriod,
  formatTimestampDay,
  formatParenthesis,
} from 'src/utils/format/format';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { TFunction } from 'i18next';

interface MyComponentProps {
  period: {
    real: {
      days: number;
      start: number;
      end: number;
    };
    instruction: {
      days: number;
      start: number;
      end: number;
    };
  };
  dataMissing: boolean;
  isMobile?: boolean;
}

const PeriodDisplay: React.FC<MyComponentProps> = ({
  period,
  dataMissing,
  isMobile = false,
}) => {
  const { t: t_time } = useTranslation('timeframe', { keyPrefix: 'time' });
  const isInstructionReal = period.real.start === period.instruction.start;
  const isEmpty =
    period.real.days === 0 || period.real.start >= period.real.end;
  return (
    <Group spacing={5}>
      {dataMissing && (
        <Tooltip
          label={
            period.real.days === 0
              ? t_time('warning-no-data')
              : t_time('warning')
          }
          multiline={true}
          position={'right'}
          //color={'red'}
          withArrow={true}
          offset={10}
        >
          <Image
            src={'/icons/warning.png'}
            alt={`Warning icon`}
            width={isMobile ? 12 : 16}
            height={isMobile ? 12 : 16}
          />
        </Tooltip>
      )}
      <Text
        fz={'xs'}
        color={
          isInstructionReal || (isEmpty && !dataMissing) ? 'dimmed' : 'yellow'
        }
      >
        {periodText(period, t_time, dataMissing)}
      </Text>
    </Group>
  );
};

export default PeriodDisplay;

interface PeriodWarningDisplayProps {
  dataMissing: boolean;
  iconSize: number;
}

export const PeriodIncomeWarningDisplay: React.FC<
  PeriodWarningDisplayProps
> = ({ dataMissing, iconSize = 16 }) => {
  const { t: t_time } = useTranslation('timeframe', { keyPrefix: 'time' });

  return (
    <>
      {dataMissing && (
        <Tooltip
          label={t_time('warning-income')}
          multiline={true}
          position={'right'}
          //color={'red'}
          withArrow={true}
          offset={10}
        >
          <Image
            src={'/icons/warning.png'}
            alt={`Warning icon`}
            width={iconSize}
            height={iconSize}
          />
        </Tooltip>
      )}
    </>
  );
};

export function periodText(
  period: {
    real: {
      days: number;
      start: number;
      end: number;
    };
    instruction: {
      days: number;
      start: number;
      end: number;
    };
  },
  t_time: TFunction,
  dataMissing: boolean,
  simple: boolean = false,
): string {
  let text = '';
  const isInstructionReal = period.real.start === period.instruction.start;
  const isEmpty =
    period.real.days === 0 || period.real.start >= period.real.end;
  if (!isInstructionReal && !simple && !isEmpty) {
    text =
      formatTimestampDay(period.real.start) +
      ' ' +
      t_time('to') +
      ' ' +
      formatTimestampDay(period.real.end) +
      ' ' +
      formatParenthesis(formatPeriod(period.real.days, t_time));
  } else if (dataMissing) {
    text = t_time('empty');
  } else if (isEmpty) {
    text = t_time('not-started');
  } else {
    //text = t_time('over-start') + formatPeriod(period.real.days, t_time);
    text =
      formatTimestampDay(period.real.start) +
      ' ' +
      t_time('to') +
      ' ' +
      formatTimestampDay(period.real.end) +
      ' ' +
      formatParenthesis(formatPeriod(period.real.days, t_time));
  }
  return text;
}
