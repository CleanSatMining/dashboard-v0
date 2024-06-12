/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC, useState } from 'react';
import { Progress, Text, Group, Card, HoverCard } from '@mantine/core';
import { calculateDaysBetweenDates } from 'src/utils/date';
import {
  formatSmallPercent,
  formatHashrate,
  formatPeriod,
  formatParenthesis,
  formatTimestampDay,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import BigNumber from 'bignumber.js';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { HashratePeriod } from 'src/types/mining/Mining';
import { TFunction } from 'i18next';
import PeriodDisplay from 'src/components/CSM/Card/components/PeriodDisplay';

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
  const [openDetails, setOpenDetails] = useState<boolean>(false);

  const hashrateColor = calculateProgressColor(
    data.site.uptime.hashratePercent,
  );

  const hasData = data.income.available;

  return (
    <div style={{ padding }}>
      <HoverCard width={280} shadow={'md'}>
        <HoverCard.Target>
          <Group
            position={'apart'}
            mt={5}
            mb={isMobile ? 3 : 5}
            onClick={() =>
              setOpenDetails(
                !openDetails && data.site.uptime.hashratePeriods.length > 1,
              )
            }
            style={{
              cursor:
                data.site.uptime.hashratePeriods.length > 1
                  ? 'pointer'
                  : 'default',
            }}
          >
            <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
              {t('uptime-hashrate')}
            </Text>
            <Group spacing={5}>
              <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
                {formatHashrate(data.site.uptime.hashrate, hasData) +
                  t('over') +
                  formatHashrate(data.site.hashrate)}
              </Text>
              {data.site.uptime.hashratePeriods.length > 1 && (
                <>
                  {openDetails ? (
                    <IconChevronUp></IconChevronUp>
                  ) : (
                    <IconChevronDown></IconChevronDown>
                  )}
                </>
              )}
            </Group>
          </Group>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {data.site.uptime.hashratePeriods.map((period, index) => {
            return (
              <Text key={index} size={isMobile ? 'xs' : 'sm'}>
                {getInstallationInformation(period, t)}
              </Text>
            );
          })}
        </HoverCard.Dropdown>
      </HoverCard>
      <Progress
        value={data.site.uptime.hashratePercent}
        color={hashrateColor}
      />

      <Group position={'apart'} mt={isMobile ? 0 : 5} mb={isMobile ? 0 : 5}>
        {hasData && (
          <PeriodDisplay
            period={data.site.uptime.period}
            dataMissing={data.dataMissing}
          ></PeriodDisplay>
        )}
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
      {openDetails && data.site.uptime.hashratePeriods.length > 1 && (
        <Card withBorder={true}>
          {data.site.uptime.hashratePeriods.map((period, index) => {
            return (
              <div key={index}>
                <Group position={'apart'} mt={5} mb={isMobile ? 3 : 5}>
                  <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
                    {`Du ${formatTimestampDay(period.start.getTime())} au ${formatTimestampDay(period.end.getTime())}`}
                  </Text>
                  <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
                    {formatHashrate(
                      Math.min(period.hashrateHs, period.hashrateMax),
                      hasData,
                    ) +
                      t('over') +
                      formatHashrate(period.hashrateMax)}
                  </Text>
                </Group>
                <Progress
                  sections={[
                    {
                      value: new BigNumber(
                        Math.min(period.hashrateHs, period.hashrateMax),
                      )
                        .dividedBy(period.hashrateMax)
                        .times(100)
                        .toNumber(),
                      color: calculateProgressColor(
                        new BigNumber(period.hashrateHs)
                          .dividedBy(period.hashrateMax)
                          .times(100)
                          .toNumber(),
                      ),

                      tooltip: getInstallationInformation(period, t),
                    },
                  ]}
                />
                <Group
                  position={'apart'}
                  mt={isMobile ? 0 : 5}
                  mb={isMobile ? 0 : 5}
                >
                  <Text fz={'xs'} color={'dimmed'}>
                    {hasData
                      ? formatParenthesis(
                          t('over-start') +
                            formatPeriod(
                              calculateDaysBetweenDates(
                                period.start.getTime(),
                                period.end.getTime(),
                              ),
                              t,
                            ),
                        )
                      : ''}
                  </Text>
                  <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
                    {formatSmallPercent(
                      new BigNumber(period.hashrateHs)
                        .dividedBy(period.hashrateMax)
                        .toNumber(),
                      undefined,
                      undefined,
                      undefined,
                      hasData,
                    )}
                  </Text>
                </Group>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};

function getInstallationInformation(period: HashratePeriod, t: TFunction) {
  return period.equipmentInstalled
    ? `${formatTimestampDay(period.equipmentInstalled.date.getTime())} : ${t('Adding')} ${period.equipmentInstalled.units} ${period.equipmentInstalled.model} (${period.equipmentInstalled.powerW}W / ${formatHashrate(period.equipmentInstalled.hashrateHs)})`
    : period.equipmentUninstalled
      ? `${formatTimestampDay(period.equipmentUninstalled.date.getTime())} : ${t('Withrawing')} ${period.equipmentUninstalled.units} ${period.equipmentUninstalled.model} (${period.equipmentUninstalled.powerW}W / ${formatHashrate(period.equipmentUninstalled.hashrateHs)})`
      : '';
}

export function calculateProgressColor(hashratePercent: number): string {
  let hashrateColor = 'violet';
  if (hashratePercent < 10) {
    hashrateColor = 'red';
  } else if (hashratePercent < 20) {
    hashrateColor = 'red';
  } else if (hashratePercent < 30) {
    hashrateColor = 'orange';
  } else if (hashratePercent < 40) {
    hashrateColor = 'yellow';
  } else if (hashratePercent < 50) {
    hashrateColor = 'indigo';
  } else if (hashratePercent < 60) {
    hashrateColor = 'blue';
  } else if (hashratePercent < 70) {
    hashrateColor = 'cyan';
  } else if (hashratePercent < 80) {
    hashrateColor = 'teal'; //yellow
  } else if (hashratePercent < 90) {
    hashrateColor = 'green'; //orange
  } else {
    hashrateColor = 'lime'; //red
  }
  return hashrateColor;
}
