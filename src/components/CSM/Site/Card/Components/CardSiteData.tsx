/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC, useState } from 'react';
import {
  Space,
  Progress,
  Text,
  Group,
  createStyles,
  MantineTheme,
  Divider,
  ActionIcon,
  Flex,
} from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons';
import Image from 'next/image';
import {
  formatSmallPercent,
  formatUsd,
  formatBTC,
  formatHashrate,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from './../Type';
import { CardSiteAccounting } from './CardSiteAccounting';

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

export type CardSiteDataProps = {
  data: CardData;
};

export const CardSiteData: FC<CardSiteDataProps> = ({ data }) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });

  const hashrateColor = calculateProgressColor(data);
  const [displayDetail, setDisplayDetail] = useState<boolean>(false);

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
          {'Le site'}
        </Text>
        {/* <IconBatteryEco size={32} color={'green'} /> */}
        {/* <Avatar src={img} size={isMobile ? 'xs' : 'sm'}></Avatar> */}
        <Image
          src={require(`../../../../../images/mining-site.png`).default}
          alt={'img'}
          height={isMobile ? 18 : 24}
        ></Image>
      </Group>

      <Divider my={'sm'} />

      <Group position={'apart'} mt={isMobile ? 0 : 0} mb={isMobile ? 0 : 0}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('bitcoin-mined')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatBTC(data.site.uptime.mined.btc)}
        </Text>
      </Group>
      <Text fz={'xs'} color={'dimmed'} ta={'right'}>
        {formatUsd(data.site.uptime.mined.usd)}
      </Text>

      <Space h={'xs'} />
      <Group position={'apart'} mt={isMobile ? 0 : 0} mb={isMobile ? 0 : 0}>
        <Flex gap={'xs'} align={'center'}>
          <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
            {t('site-net-income')}
          </Text>
          <ActionIcon
            size={'xs'}
            variant={'light'}
            radius={'sm'}
            onClick={() => setDisplayDetail(!displayDetail)}
          >
            {!displayDetail && <IconPlus size={'0.875rem'} />}
            {displayDetail && <IconMinus size={'0.875rem'} />}
          </ActionIcon>
        </Flex>

        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatBTC(data.site.uptime.earned.btc)}
        </Text>
      </Group>
      <Text fz={'xs'} color={'dimmed'} ta={'right'}>
        {formatUsd(data.site.uptime.earned.usd)}
      </Text>
      {displayDetail && <CardSiteAccounting data={data}></CardSiteAccounting>}

      <Group position={'apart'} mt={'xs'} mb={isMobile ? 0 : 'xs'}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('start-date')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {data.site.miningStart}
        </Text>
      </Group>
      <Space h={'xs'}></Space>
      <Group position={'apart'} mt={isMobile ? 5 : 5} mb={isMobile ? 3 : 5}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('uptime-hashrate')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatHashrate(data.site.uptime.hashrate) +
            t('over') +
            formatHashrate(data.site.hashrate)}
        </Text>
      </Group>
      <Progress value={data.site.uptime.percent} color={hashrateColor} />
      <Group position={'apart'} mt={isMobile ? 0 : 5} mb={isMobile ? 0 : 5}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}></Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatSmallPercent(data.site.uptime.percent / 100)}
        </Text>
      </Group>
    </>
  );
};
function calculateProgressColor(data: CardData) {
  let hashrateColor = 'violet';
  if (data.site.uptime.percent < 10) {
    hashrateColor = 'violet';
  } else if (data.site.uptime.percent < 20) {
    hashrateColor = 'indigo';
  } else if (data.site.uptime.percent < 30) {
    hashrateColor = 'blue';
  } else if (data.site.uptime.percent < 40) {
    hashrateColor = 'cyan';
  } else if (data.site.uptime.percent < 50) {
    hashrateColor = 'teal';
  } else if (data.site.uptime.percent < 60) {
    hashrateColor = 'green';
  } else if (data.site.uptime.percent < 70) {
    hashrateColor = 'lime';
  } else if (data.site.uptime.percent < 80) {
    hashrateColor = 'yellow';
  } else if (data.site.uptime.percent < 90) {
    hashrateColor = 'orange';
  } else {
    hashrateColor = 'red';
  }
  return hashrateColor;
}