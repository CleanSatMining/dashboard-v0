/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC, useState } from 'react';
import {
  Space,
  Text,
  Stack,
  Group,
  ActionIcon,
  Flex,
  HoverCard,
} from '@mantine/core';
import { IconPlus, IconMinus } from '@tabler/icons';

import {
  formatSimpleUsd,
  formatBTC,
  formatPeriod,
  formatParenthesis,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import { CardSiteAccounting } from './CardSiteAccounting';
import BitcoinBalanceChecker from 'src/components/BitcoinBalance/BitcoinBalance';
('src/components/BitcoinBalance/BitcoinBalance');
import { SITES, SiteID } from 'src/constants/csm';
import { useAtomValue } from 'jotai';
import { btcPriceAtom } from 'src/states';

export type CardSiteDataContentProps = {
  data: CardData;
  padding?: string;
};

export const CardSiteDataContent: FC<CardSiteDataContentProps> = ({
  data,
  padding = '0px',
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const [displayDetail, setDisplayDetail] = useState<boolean>(false);
  const btcPrice = useAtomValue(btcPriceAtom);
  const hasData = data.income.available;

  return (
    <div style={{ padding }}>
      <Group position={'apart'} mt={0} mb={0} align={'flex-start'}>
        <Stack spacing={0} justify={'flex-start'}>
          <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
            {t('treasury')}
          </Text>
        </Stack>
        <BitcoinBalanceChecker
          siteId={data.id}
          btcPrice={btcPrice ?? 0}
          isMobile={isMobile}
        ></BitcoinBalanceChecker>
      </Group>
      <Space h={10}></Space>
      <Group position={'apart'} mt={0} mb={0}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('bitcoin-mined')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatBTC(data.site.uptime.mined.btc, hasData)}
        </Text>
      </Group>
      <Group position={'apart'} mt={0} mb={0}>
        <Text fz={'xs'} color={'dimmed'}>
          {hasData
            ? formatParenthesis(
                t('over-start') + formatPeriod(data.site.uptime.onPeriod, t),
              )
            : ''}
        </Text>
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(data.site.uptime.mined.usd, hasData)}
        </Text>
      </Group>

      <Space h={'xs'} />
      <Group position={'apart'} mt={0} mb={0}>
        <HoverCard width={200} shadow={'md'} disabled={isMobile ? true : false}>
          <HoverCard.Target>
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
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Text size={'sm'}>{t('income-detail')}</Text>
          </HoverCard.Dropdown>
        </HoverCard>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatBTC(data.site.uptime.earned.btc, hasData)}
        </Text>
      </Group>
      <Group position={'apart'} mt={0} mb={0}>
        <Text fz={'xs'} color={'dimmed'}>
          {hasData
            ? formatParenthesis(
                t('over-start') + formatPeriod(data.site.uptime.onPeriod, t),
              )
            : ''}
        </Text>
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(data.site.uptime.earned.usd, hasData)}
        </Text>
      </Group>

      {displayDetail && <CardSiteAccounting data={data}></CardSiteAccounting>}

      <Group position={'apart'} mt={'xs'} mb={isMobile ? 0 : 'xs'}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('start-date')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {data.site.miningStart}
        </Text>
      </Group>
    </div>
  );
};
