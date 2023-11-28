import { FC } from 'react';
import { Text, Group, createStyles, MantineTheme, Space } from '@mantine/core';

import {
  formatBTC,
  formatSimpleUsd,
  formatPeriod,
  formatParenthesis,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import { InfoText } from 'src/components/InfoText/InfoText';

export const useStyle = createStyles((theme: MantineTheme) => ({
  urlContainer: {
    display: 'flex',
    gap: theme.spacing.sm,
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
    borderBottomColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'start',
    '&:hover': {
      borderBottomColor: theme.colors.brand,
      cursor: 'pointer',
    },
  },
}));

export type CardIncomeContentProps = {
  data: CardData;
  padding?: string;
};

export const CardIncomeContent: FC<CardIncomeContentProps> = ({
  data,
  padding = '0px',
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const lost = data.income.net.balance.btc < 0;

  const hasData = data.income.available;

  return (
    <div style={{ padding }}>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          text={t('income-gross')}
          color={'dimmed'}
          fz={'sm'}
          tooltipText={t('income-gross-explained')}
          width={isMobile ? 300 : 400}
        ></InfoText>
        <Text weight={500} fz={'sm'} align={'center'}>
          {formatBTC(data.income.gross.balance.btc, hasData)}
        </Text>
      </Group>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'xs'} color={'dimmed'}>
          {hasData
            ? formatParenthesis(
                t('over-start') + formatPeriod(data.site.uptime.onPeriod, t),
              )
            : ''}
        </Text>
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(data.income.gross.balance.usd, hasData)}
        </Text>
      </Group>
      <Space h={'5px'}></Space>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          text={t('income-net')}
          color={'dimmed'}
          fz={'sm'}
          tooltipText={t('income-net-explained')}
          width={isMobile ? 300 : 400}
        ></InfoText>

        {!lost && (
          <Text weight={500} fz={'sm'} align={'center'}>
            {formatBTC(data.income.net.balance.btc, hasData)}
          </Text>
        )}
        {lost && (
          <InfoText
            text={formatBTC(data.income.net.balance.btc)}
            color={'yellow'}
            fz={'sm'}
            tooltipText={t('lost-explained')}
            weight={500}
            width={isMobile ? 300 : 400}
          ></InfoText>
        )}
      </Group>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'xs'} color={'dimmed'}>
          {hasData
            ? formatParenthesis(
                t('over-start') + formatPeriod(data.site.uptime.onPeriod, t),
              )
            : ''}
        </Text>
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(data.income.net.balance.usd, hasData)}
        </Text>
      </Group>
    </div>
  );
};
