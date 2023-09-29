import { FC } from 'react';
import {
  Flex,
  Text,
  Group,
  createStyles,
  MantineTheme,
  Divider,
  Avatar,
  HoverCard,
} from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons';
import { formatBTC, formatUsd } from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from './../Type';
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

export type CardIncomeProps = {
  data: CardData;
};

export const CardIncome: FC<CardIncomeProps> = ({ data }) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const lost = data.income.net.balance.btc < 0;

  return (
    <HoverCard width={280} shadow={'md'}>
      <Group position={'apart'}>
        <HoverCard.Target>
          <Flex
            justify={'center'}
            align={'center'}
            gap={'3px'}
            sx={{ cursor: 'pointer' }}
          >
            <Text
              weight={500}
              fz={isMobile ? 'md' : 'lg'}
              align={'center'}
              color={'dimmed'}
              sx={{ marginRight: '2px' }}
            >
              {t('my-income')}
            </Text>
            <IconInfoCircle size={16} color={'gray'} />
          </Flex>
        </HoverCard.Target>

        <Avatar
          src={'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025'}
          size={isMobile ? 'xs' : 'sm'}
          sx={{ margin: '0px' }}
        ></Avatar>
      </Group>
      <Divider my={'sm'} />

      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          text={t('income-gross')}
          color={'dimmed'}
          fz={'sm'}
          tooltipText={t('income-gross-explained')}
        ></InfoText>
        {/* <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {t('income-gross')}
        </Text> */}
        <Text weight={500} fz={'sm'} align={'center'}>
          {formatBTC(data.income.gross.balance.btc)}
        </Text>
      </Group>
      <Text fz={'xs'} color={'dimmed'} ta={'right'}>
        {formatUsd(data.income.gross.balance.usd)}
      </Text>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          text={t('income-net')}
          color={'dimmed'}
          fz={'sm'}
          tooltipText={t('income-net-explained')}
        ></InfoText>
        {/* <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {t('income-net')}
        </Text> */}
        {!lost && (
          <Text weight={500} fz={'sm'} align={'center'}>
            {formatBTC(data.income.net.balance.btc)}
          </Text>
        )}
        {lost && (
          <InfoText
            text={formatBTC(data.income.net.balance.btc)}
            color={'yellow'}
            fz={'sm'}
            tooltipText={t('lost-explained')}
            weight={500}
          ></InfoText>
        )}
      </Group>
      <Text fz={'xs'} color={'dimmed'} ta={'right'}>
        {formatUsd(data.income.net.balance.usd)}
      </Text>

      <HoverCard.Dropdown>
        <Text size={'sm'}>{t('fee-explained')}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
