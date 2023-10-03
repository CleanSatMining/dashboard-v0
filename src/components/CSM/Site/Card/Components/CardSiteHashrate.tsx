/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC } from 'react';
import { Progress, Text, Group } from '@mantine/core';

import {
  formatSmallPercent,
  formatHashrate,
  formatPeriod,
  formatParenthesis,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';

export type CardSiteHashrateProps = {
  data: CardData;
  padding?: string;
};

export const CardSiteHashrate: FC<CardSiteHashrateProps> = ({
  data,
  padding = '0px',
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });

  const hashrateColor = calculateProgressColor(data);

  const hasData = data.income.available;

  return (
    <div style={{ padding }}>
      <Group position={'apart'} mt={5} mb={isMobile ? 3 : 5}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('uptime-hashrate')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatHashrate(data.site.uptime.hashrate, hasData) +
            t('over') +
            formatHashrate(data.site.hashrate)}
        </Text>
      </Group>
      <Progress
        value={data.site.uptime.hashratePercent}
        color={hashrateColor}
      />
      <Group position={'apart'} mt={isMobile ? 0 : 5} mb={isMobile ? 0 : 5}>
        <Text fz={'xs'} color={'dimmed'}>
          {hasData
            ? formatParenthesis(
                t('over-start') + formatPeriod(data.site.uptime.days, t),
              )
            : ''}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatSmallPercent(
            data.site.uptime.hashratePercent / 100,
            undefined,
            undefined,
            undefined,
            hasData,
          )}
        </Text>
      </Group>
    </div>
  );
};

function calculateProgressColor(data: CardData) {
  let hashrateColor = 'violet';
  if (data.site.uptime.hashratePercent < 10) {
    hashrateColor = 'red';
  } else if (data.site.uptime.hashratePercent < 20) {
    hashrateColor = 'red';
  } else if (data.site.uptime.hashratePercent < 30) {
    hashrateColor = 'orange';
  } else if (data.site.uptime.hashratePercent < 40) {
    hashrateColor = 'yellow';
  } else if (data.site.uptime.hashratePercent < 50) {
    hashrateColor = 'indigo';
  } else if (data.site.uptime.hashratePercent < 60) {
    hashrateColor = 'blue';
  } else if (data.site.uptime.hashratePercent < 70) {
    hashrateColor = 'cyan';
  } else if (data.site.uptime.hashratePercent < 80) {
    hashrateColor = 'teal'; //yellow
  } else if (data.site.uptime.hashratePercent < 90) {
    hashrateColor = 'green'; //orange
  } else {
    hashrateColor = 'lime'; //red
  }
  return hashrateColor;
}
