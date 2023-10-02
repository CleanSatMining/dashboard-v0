import { FC } from 'react';
import {
  Flex,
  Text,
  Group,
  createStyles,
  MantineTheme,
  Divider,
  Avatar,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import {
  formatBigNumber,
  formatSmallPercent,
  formatToken,
  formatUsd,
} from 'src/utils/format/format';
import { openInNewTab } from 'src/utils/window';
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

export type CardTokenProps = {
  data: CardData;
};

export const CardToken: FC<CardTokenProps> = ({ data }) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });

  const url: string = data.token.url;
  const balance: number = data.token.balance;
  const value: number = data.token.value;
  const percent: number = data.token.percent;
  const symbol: string = data.token.symbol;
  const supply: number = data.token.supply;

  return (
    <>
      <Group
        position={'apart'}
        sx={{ marginTop: '10px', marginBottom: '10px' }}
      >
        <Text
          weight={500}
          fz={isMobile ? 'md' : 'lg'}
          align={'center'}
          color={'dimmed'}
        >
          {t('my-tokens')}
        </Text>
        <Avatar
          src={'https://cleansatmining.com/data/files/logo_csm.png'}
          size={isMobile ? 'xs' : 'sm'}
        ></Avatar>
      </Group>

      <Divider my={'sm'} />
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {'Quantité'}
        </Text>

        <Flex
          className={classes.urlContainer}
          onClick={() => openInNewTab(url)}
          gap={'5px'}
        >
          <Text weight={500} fz={'sm'} align={'center'}>
            {formatToken(balance)}
          </Text>
          <Text weight={500} fz={'sm'} sx={{ padding: '0', margin: '0' }}>
            {symbol}
          </Text>
          <IconExternalLink size={16} />
        </Flex>
      </Group>

      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          fz={'sm'}
          color={'dimmed'}
          text={t('token-value')}
          tooltipText={t('token-value-explained')}
        ></InfoText>
        {/* <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {'Valeur'}
        </Text> */}
        <Text fz={'sm'} weight={500}>
          {formatUsd(value)}
        </Text>
      </Group>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {'Ratio'}
        </Text>
        <Text fz={'sm'} weight={500}>
          {formatBigNumber(balance) +
            '/' +
            formatBigNumber(supply) +
            ' (~' +
            formatSmallPercent(percent) +
            ')'}
        </Text>
      </Group>
    </>
  );
};
