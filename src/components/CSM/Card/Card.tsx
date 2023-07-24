import { FC, useEffect, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  Card,
  Flex,
  Group,
  Image,
  MantineTheme,
  SegmentedControl,
  SimpleGrid,
  Text,
  Title,
  createStyles,
} from '@mantine/core';
import { Progress } from '@mantine/core';

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
};

type TableProps = {
  title: string;
  image: string;
  apr: number;
  csm: number;
  csmUsd: number;
  csmPercent: number;
  csmSymbol: string;
  csmSupply: number;
  miningState: MiningState;
  tokenUrl: string;
  data: SiteData;
};

export const UserSiteCard: FC<TableProps> = ({
  title = 'NA',
  image = 'https://cleansatmining.com/data/files/capturedecran2023-04-19.png',
  apr = 0,
  csm = 0,
  csmUsd = 0,
  csmPercent = 0,
  csmSymbol = '',
  csmSupply = 0,
  data,
  tokenUrl,
  miningState,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { classes } = useStyle();

  const { badgeColor, badgeState } = calculateSiteState(t, miningState);

  // const siteDataDefault: SiteData = defaultSiteData(apr);

  // const id = siteData.length > 0 ? siteData[0].id : 'default';
  // const [dataId, setDataId] = useState(id);
  // const [data, setData] = useState<SiteData>(siteDataDefault);

  // useEffect(() => {
  //   const siteDataDefault: SiteData = defaultSiteData(apr);
  //   const selectedData: SiteData | undefined = siteData.find(
  //     (v) => v.id === dataId
  //   );
  //   setData(selectedData === undefined ? siteDataDefault : selectedData);
  //   if (dataId === 'default' && siteData !== undefined && siteData.length > 0)
  //     setDataId(siteData[0].id);
  // }, [dataId, siteData, apr]);

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
              <Text fz={'lg'} fw={700}>
                {formatBTC(data.income.user.btc)}
              </Text>
              <Text fz={'xs'} color={'dimmed'}>
                {formatUsd(data.income.user.usd)}
              </Text>
            </Flex>
          </Flex>
        </div>
      </SimpleGrid>

      <Progress
        color={'green'}
        value={csmPercent * 100}
        size={'xl'}
        radius={'xl'}
        sx={{ marginTop: '10px' }}
      />
      <Group position={'apart'} sx={{ margin: '0px' }}>
        <Text weight={500} fz={'md'}>
          {'Tokens'}
        </Text>

        <Text weight={500} fz={'md'} align={'center'}>
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
