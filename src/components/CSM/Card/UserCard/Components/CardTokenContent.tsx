import { FC } from 'react';
import {
  Flex,
  Text,
  Group,
  createStyles,
  MantineTheme,
  Tooltip,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons';
import {
  formatSmallPercent,
  formatToken,
  formatUsd,
} from 'src/utils/format/format';
import { openInNewTab } from 'src/utils/window';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import { InfoText } from 'src/components/InfoText/InfoText';
import { AddErc20ToWallet } from 'src/components/CSM/Wallet/AddTokenToWallet';

export const useStyle = createStyles((theme: MantineTheme) => ({
  tokenContainer: {
    display: 'flex',
    gap: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'start',
  },
  link: {
    '&:hover': {
      color: theme.colors.brand,
      cursor: 'pointer',
    },
  },
}));

export type CardTokenContentProps = {
  data: CardData;
  padding?: string;
};

export const CardTokenContent: FC<CardTokenContentProps> = ({
  data,
  padding = '0px',
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation('site', { keyPrefix: 'card' });

  const url: string = data.token.url;
  const balance: number = data.token.balance;
  const value: number = data.token.value;
  const percent: number = data.token.percent;
  const symbol: string = data.token.symbol;
  const supply: number = data.token.supply;
  const approx: string = balance === 0 ? '' : '~';

  return (
    <div style={{ padding }}>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {'Quantité'}
        </Text>

        <Flex className={classes.tokenContainer} gap={'5px'}>
          <Text weight={500} fz={'sm'} align={'center'}>
            {formatToken(balance)}
          </Text>
          <Text weight={500} fz={'sm'} sx={{ padding: '0', margin: '0' }}>
            {symbol}
          </Text>
          <Tooltip label={'See on gnosisscan'} position={'right'}>
            <div>
              <IconExternalLink
                size={16}
                className={classes.link}
                onClick={() => openInNewTab(url)}
              />
            </div>
          </Tooltip>
          <AddErc20ToWallet
            erc20TokenAddress={data.token.address}
            erc20TokenSymbol={data.token.symbol}
            erc20TokenDecimal={data.token.decimal}
          ></AddErc20ToWallet>
        </Flex>
      </Group>

      <Group position={'apart'} mt={'0'} mb={'0'}>
        <InfoText
          fz={'sm'}
          color={'dimmed'}
          text={t('token-value')}
          tooltipText={t('token-value-explained')}
        ></InfoText>

        <Text fz={'sm'} weight={500}>
          {formatUsd(value)}
        </Text>
      </Group>
      <Group position={'apart'} mt={'0'} mb={'0'}>
        <Text fz={'sm'} align={'center'} color={'dimmed'}>
          {'Ratio'}
        </Text>
        <Text fz={'sm'} weight={500}>
          {formatToken(balance) +
            '/' +
            formatToken(supply) +
            ' (' +
            approx +
            formatSmallPercent(percent) +
            ')'}
        </Text>
      </Group>
    </div>
  );
};
