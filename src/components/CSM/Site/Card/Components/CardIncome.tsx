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

import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from './../Type';
import { CardIncomeContent } from './CardIncomeContent';

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

      <CardIncomeContent data={data} padding={'0px 5px'}></CardIncomeContent>

      <HoverCard.Dropdown>
        <Text size={'sm'}>{t('fee-explained')}</Text>
      </HoverCard.Dropdown>
    </HoverCard>
  );
};
