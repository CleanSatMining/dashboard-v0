import { FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  HoverCard,
  Image,
  MantineTheme,
  SimpleGrid,
  Text,
  Title,
  createStyles,
} from '@mantine/core';

import { Income } from '../../../types/Site';
import { MiningState } from '../../../types/Site';
import {
  formatBTC,
  formatBigNumber,
  formatPercent,
  formatSmallPercent,
  formatToken,
  formatUsd,
} from '../../../utils/format/format';

const useStyle = createStyles((theme: MantineTheme) => ({
  href: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : 'black',
    marginLeft: '5px',
    fontWeight: 700,
    fontSize: '18px',
    textDecoration: 'none',
  },
}));

export type SiteData = {
  id: string;
  label: string;
  apr: number;
  mined: Income;
  income: {
    user: Income;
    site: Income;
  };
  uptime: {
    days: string;
    machine: string;
  };
};

type TableProps = {
  title: string;
  image: string;
  csm: number;
  csmUsd: number;
  csmPercent: number;
  csmSymbol: string;
  csmSupply: number;
  miningState: MiningState;
  tokenUrl: string;
  data: SiteData;
  startingDate: string;
};

export const UserSiteCard: FC<TableProps> = ({
  title = 'NA',
  image = 'https://cleansatmining.com/data/files/capturedecran2023-04-19.png',
  csm = 0,
  csmUsd = 0,
  csmPercent = 0,
  csmSymbol = '',
  csmSupply = 0,
  data,
  tokenUrl,
  miningState,
  startingDate,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { classes } = useStyle();

  const { badgeColor, badgeState } = calculateSiteState(t, miningState);

  return (
    <Card shadow={'sm'} padding={'lg'} radius={'md'} withBorder={true}>
      <Card.Section>
        <Image src={image} height={160} alt={title} />
      </Card.Section>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Title order={1}>{title}</Title>

        <Badge color={badgeColor} variant={'light'}>
          <Text fz={'md'}>{badgeState}</Text>
        </Badge>
      </Group>

      <Flex
        gap={'0'}
        justify={'flex-start'}
        align={'center'}
        direction={'column'}
        wrap={'wrap'}
        sx={{ marginBottom: '10px' }}
      >
        <Text fz={'28px'} weight={1000} color={'#63b75f'}>
          {formatPercent(data.apr)}
        </Text>
        <Text fz={'14px'} weight={1000} color={'dimmed'}>
          {'APY'}
        </Text>
      </Flex>

      <SimpleGrid
        cols={2}
        spacing={'xs'}
        verticalSpacing={'xs'}
        sx={{ marginBottom: '20px' }}
      >
        <div>
          <Flex
            gap={'0'}
            justify={'center'}
            align={'center'}
            direction={'row'}
            wrap={'wrap'}
          >
            <Text weight={500} fz={'lg'} align={'center'}>
              {t('my-tokens')}
            </Text>
            <Avatar
              src={'https://cleansatmining.com/data/files/logo_csm.png'}
              size={'sm'}
              sx={{ margin: '10px' }}
            ></Avatar>
          </Flex>

          <Flex
            mih={50}
            gap={'0'}
            justify={'center'}
            align={'center'}
            direction={'row'}
            wrap={'wrap'}
          >
            <Flex
              gap={'0'}
              justify={'flex-end'}
              align={'flex-end'}
              direction={'column'}
              wrap={'wrap'}
            >
              <Text
                fz={'lg'}
                fw={700}
                sx={{
                  marginTop: '0px',
                  marginLeft: '0px',
                  marginRight: '0px',
                  marginBottom: '5px',
                  lineHeight: 'normal',
                }}
              >
                {formatToken(csm)}
                <a
                  href={tokenUrl}
                  target={'_blank'}
                  rel={'noreferrer'}
                  className={classes.href}
                >
                  {csmSymbol}
                </a>
              </Text>

              <Text fz={'xs'} color={'dimmed'}>
                {formatUsd(csmUsd)}
              </Text>
            </Flex>
          </Flex>
        </div>
        <div>
          <Flex
            gap={'0'}
            justify={'center'}
            align={'center'}
            direction={'row'}
            wrap={'wrap'}
          >
            <Text weight={500} fz={'lg'} align={'center'}>
              {t('my-income')}
            </Text>
            <Avatar
              src={'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025'}
              size={'sm'}
              sx={{ margin: '10px' }}
            ></Avatar>
          </Flex>
          <Flex
            mih={50}
            gap={'0'}
            justify={'center'}
            align={'center'}
            direction={'row'}
            wrap={'wrap'}
          >
            <Flex
              gap={'0'}
              justify={'flex-end'}
              align={'flex-end'}
              direction={'column'}
              wrap={'wrap'}
            >
              <HoverCard width={280} shadow={'md'}>
                <HoverCard.Target>
                  <Text fz={'lg'} fw={700}>
                    {formatBTC(data.income.user.btc)}
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text size={'sm'}>{t('fee-explained')}</Text>
                </HoverCard.Dropdown>
              </HoverCard>

              <Text fz={'xs'} color={'dimmed'}>
                {formatUsd(data.income.user.usd)}
              </Text>
            </Flex>
          </Flex>
        </div>
      </SimpleGrid>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {'Tokens'}
        </Text>
        <Text fz={'md'}>
          {formatBigNumber(csm) +
            '/' +
            formatBigNumber(csmSupply) +
            ' (' +
            formatSmallPercent(csmPercent) +
            ')'}
        </Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {t('start-date')}
        </Text>
        <Text fz={'md'}>{startingDate}</Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {t('active-days')}
        </Text>
        <Text fz={'md'}>{data.uptime.days}</Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {t('active-machines')}
        </Text>
        <Text fz={'md'}>{data.uptime.machine}</Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {t('bitcoin-mined')}
        </Text>
        <Text fz={'md'}>{formatBTC(data.mined.btc)}</Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {t('site-net-income')}
        </Text>
        <Text fz={'md'}>{formatBTC(data.income.site.btc)}</Text>
      </Group>

      <Group position={'apart'} mt={'md'} mb={'xs'}>
        <Text weight={500} fz={'md'}>
          {''}
        </Text>
        <Text fz={'md'}>{formatUsd(data.income.site.usd)}</Text>
      </Group>
    </Card>
  );
};

function calculateSiteState(
  t: TFunction<'site', 'card'>,
  miningState: MiningState
) {
  let badgeColor = 'gray';
  let badgeState = t('inactive');

  switch (miningState) {
    case MiningState.active: {
      //statements;
      badgeState = t('active');
      badgeColor = 'green';
      break;
    }
    case MiningState.inactive: {
      //statements;
      badgeState = t('inactive');
      badgeColor = 'dark';
      break;
    }
    case MiningState.stopped: {
      //statements;
      badgeState = t('stoped');
      badgeColor = 'red';
      break;
    }
    default: {
      //statements;
      break;
    }
  }
  return { badgeColor, badgeState };
}
