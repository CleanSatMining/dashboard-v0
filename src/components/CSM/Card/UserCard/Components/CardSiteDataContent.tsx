/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Space,
  Text,
  Stack,
  Group,
  ActionIcon,
  Flex,
  HoverCard,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { IconPlus, IconMinus, IconEye } from '@tabler/icons';
import Image from 'next/image';
import {
  formatSimpleUsd,
  formatBTC,
  formatTimestampDay,
} from 'src/utils/format/format';
import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from '../Type';
import { CardSiteAccounting } from './CardSiteAccounting';
import BitcoinBalanceChecker from 'src/components/BitcoinBalance/BitcoinBalance';
('src/components/BitcoinBalance/BitcoinBalance');
import { useAtomValue } from 'jotai';
import { btcPriceAtom } from 'src/states';
import { API_SITE } from 'src/constants/apis';
import { CleanSatMiningSite } from 'src/types/mining/Site';
import { LINK_BLOCKCHAIN_EXPLORER_BTC } from 'src/constants/apis';
import { TAXE_FREE_MODE } from 'src/constants/csm';
import PeriodDisplay from 'src/components/CSM/Card/components/PeriodDisplay';

export type CardSiteDataContentProps = {
  data: CardData;
  padding?: string;
};

export const CardSiteDataContent: FC<CardSiteDataContentProps> = ({
  data,
  padding = '0px',
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const theme = useMantineTheme();
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const [displayDetail, setDisplayDetail] = useState<boolean>(false);
  const btcPrice = useAtomValue(btcPriceAtom);
  const hasData = data.income.available;
  const [siteData, setSiteData] = useState<CleanSatMiningSite | undefined>(
    undefined,
  );
  const earned = TAXE_FREE_MODE
    ? data.site.uptime.earnedTaxFree
    : data.site.uptime.earned;

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const response = await fetch(API_SITE.url(data.id), {
          method: API_SITE.method,
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données du site');
        }

        const d: CleanSatMiningSite = await response.json();

        setSiteData(d);
        return data;
      } catch (error) {
        console.error(error);
      }
    };

    fetchSiteData();
  }, []);

  return (
    <div style={{ padding }}>
      <Group position={'apart'} mt={0} mb={0} align={'flex-start'}>
        <Stack spacing={0} justify={'flex-start'}>
          <Group spacing={3}>
            <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
              {t('treasury')}
            </Text>
            {siteData && siteData?.data.vault.xpub !== '' && (
              <HoverCard
                width={200}
                shadow={'md'}
                disabled={isMobile ? true : false}
              >
                <HoverCard.Target>
                  <Link
                    href={LINK_BLOCKCHAIN_EXPLORER_BTC.url(
                      siteData?.data.vault.xpub,
                    )}
                    target={'_blank'}
                  >
                    <ActionIcon
                      size={'sm'}
                      variant={'transparent'}
                      radius={'sm'}
                      color={theme.colorScheme === 'dark' ? 'dark' : 'gray'}
                    >
                      <IconEye size={'0.875rem'} />
                    </ActionIcon>
                  </Link>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size={'sm'}>{t('treasury-detail')}</Text>
                </HoverCard.Dropdown>
              </HoverCard>
            )}
          </Group>
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
        {hasData && (
          <PeriodDisplay
            period={data.site.uptime.period}
            dataMissing={data.dataMissing}
          ></PeriodDisplay>
        )}
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
                {TAXE_FREE_MODE
                  ? t('site-taxe-free-income')
                  : t('site-net-income')}
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
          {formatBTC(earned.btc, hasData)}
        </Text>
      </Group>
      <Group position={'apart'} mt={0} mb={0}>
        {hasData && (
          <PeriodDisplay
            period={data.site.uptime.period}
            dataMissing={data.dataMissing}
          ></PeriodDisplay>
        )}
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(earned.usd, hasData)}
        </Text>
      </Group>

      {displayDetail && <CardSiteAccounting data={data}></CardSiteAccounting>}

      <Group position={'apart'} mt={'xs'} mb={isMobile ? 0 : 'xs'}>
        <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
          {t('start-date')}
        </Text>
        <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
          {formatTimestampDay(new Date(data.site.miningStart).getTime())}
        </Text>
      </Group>
      {siteData && (
        <Group position={'apart'} mt={'xs'} mb={isMobile ? 0 : 'xs'}>
          <Text fz={isMobile ? 'xs' : 'sm'} color={'dimmed'}>
            {t('operator')}
          </Text>
          <Group
            position={'right'}
            style={{
              width: isMobile ? '40px' : '60px',
              height: isMobile ? '40px' : '60px',
              overflow: 'hidden',
            }}
          >
            <a
              href={siteData.operator?.website}
              target={'_blank'}
              rel={'noopener noreferrer'}
              style={{
                width: isMobile ? '40px' : '60px',
                height: isMobile ? '40px' : '60px',
                overflow: 'hidden',
              }}
            >
              <Tooltip label={siteData.operator?.name}>
                <Image
                  src={siteData.operator?.logo ?? ''}
                  alt={`Site ${data.id}`}
                  width={isMobile ? 40 : 60}
                  height={isMobile ? 40 : 60}
                  style={{
                    float: 'right',
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                    borderRadius: '10%',
                  }}
                />
              </Tooltip>
            </a>
          </Group>
        </Group>
      )}
    </div>
  );
};
