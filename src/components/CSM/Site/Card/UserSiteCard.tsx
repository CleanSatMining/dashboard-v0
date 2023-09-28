import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  Flex,
  Group,
  MantineTheme,
  Space,
  Text,
  createStyles,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

import { MiningStatus } from '../../../../types/mining/Site';
import {
  formatBTC,
  formatBigNumber,
  formatPercent,
  formatSmallPercent,
  formatUsd,
} from 'src/utils/format/format';
import { ACTIVATE_DISPLAY_APY } from 'src/constants/csm';
import { CardHeader } from './Components/CardHeader';
import { CardToken } from './Components/CardToken';
import { CardIncome } from './Components/CardIncome';
import { CardSiteData } from './Components/CardSiteData';
import { CardData } from './Type';

export const useStyle = createStyles((theme: MantineTheme) => ({
  title: {
    textAlign: 'center',
  },

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
  href: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : 'black',
    marginLeft: '5px',
    fontWeight: 700,
    fontSize: '18px',
    textDecoration: 'none',
  },

  border: {
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]
    }`,
    borderRadius: '20px',
    margin: '5px',
  },

  db: {
    backgroundColor: 'red',
  },

  separator: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]
    }`,
    borderRadius: '20px',
    borderImage: `
    linear-gradient(
      rgba(0, 0, 0, 0), 
      ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[3]
      }, 
      rgba(0, 0, 0, 0)
    ) 1 100%`,
  },
  separator2: {
    //paddingBottom: '10px',
    marginBottom: '20px',
    marginTop: '10px',
  },

  icon: {
    height: '16px',
    width: '16px',
  },
}));

type CardProps = {
  title: string;
  subTitle?: string;
  image: string;
  status: MiningStatus;
  data: CardData;
};

export const UserSiteCard: FC<CardProps> = ({
  title,
  subTitle,
  image = 'https://cleansatmining.com/data/files/capturedecran2023-04-19.png',
  data,
  status,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const isMobile = useMediaQuery('(max-width: 36em)');

  //console.log('MOUNT UserSiteCard', title, data.apr);

  return (
    <Card
      shadow={'sm'}
      padding={'lg'}
      radius={'md'}
      withBorder={true}
      sx={{ marginBottom: isMobile ? '10px' : 0 }}
    >
      <Card.Section>
        <CardHeader
          image={image}
          miningState={status}
          title={title}
          subTitle={subTitle}
        ></CardHeader>
      </Card.Section>

      {ACTIVATE_DISPLAY_APY && (
        <Flex
          gap={'0'}
          justify={'flex-start'}
          align={'center'}
          direction={'column'}
          wrap={'wrap'}
          sx={{ marginBottom: isMobile ? '0px' : '10px' }}
        >
          <Text fz={isMobile ? '20px' : '28px'} weight={1000} color={'brand'}>
            {formatPercent(data.income.net.apy)}
          </Text>
          <Text fz={isMobile ? '12px' : '14px'} weight={1000} color={'dimmed'}>
            {'APY'}
          </Text>
        </Flex>
      )}

      <CardToken data={data}></CardToken>
      <Space h={'sm'}></Space>
      <CardIncome data={data}></CardIncome>
      <Space h={'5px'}></Space>
      <CardSiteData data={data}></CardSiteData>

      {/*      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'md'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {'Tokens'}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>
          {formatBigNumber(csm) +
            '/' +
            formatBigNumber(csmSupply) +
            ' (~' +
            formatSmallPercent(csmPercent) +
            ')'}
        </Text>
      </Group>

      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'xs'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {t('start-date')}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>{startingDate}</Text>
      </Group>

      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'xs'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {t('uptime-days')}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>{data.uptime.days}</Text>
      </Group>

      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'xs'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {t('uptime-machines')}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>{data.uptime.machine}</Text>
      </Group>

      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'xs'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {t('bitcoin-mined')}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>{formatBTC(data.mined.btc)}</Text>
      </Group>

      <Group
        position={'apart'}
        mt={isMobile ? 0 : 'xs'}
        mb={isMobile ? 0 : 'xs'}
      >
        <Text weight={500} fz={isMobile ? 'xs' : 'md'} color={'dimmed'}>
          {t('site-net-income')}
        </Text>
        <Text fz={isMobile ? 'xs' : 'md'}>
          {formatBTC(data.site.uptime.mined.btc)}
        </Text>
      </Group>

      <Text fz={isMobile ? 'xs' : 'md'} ta={'right'}>
        {formatUsd(data.site.uptime.mined.usd)}
      </Text> */}
    </Card>
  );
};
