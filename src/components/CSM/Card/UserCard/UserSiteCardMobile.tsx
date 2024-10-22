/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC } from 'react';

import {
  Card,
  Avatar,
  Text,
  Accordion,
  Group,
  Progress,
  HoverCard,
} from '@mantine/core';

import { MiningStatus } from '../../../../types/mining/Site';
import {
  formatSimpleUsd,
  formatToken,
  formatHashrate,
} from 'src/utils/format/format';

import { CardHeader } from './Components/CardHeader';
import { CardTokenContent } from './Components/CardTokenContent';
import { CardIncomeContent } from './Components/CardIncomeContent';
import { CardSiteDataContent } from './Components/CardSiteDataContent';
import {
  CardSiteHashrate,
  calculateProgressColor,
} from './Components/CardSiteHashrate';
import { CardData } from './Type';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { periodText } from 'src/components/CSM/Card/components/PeriodDisplay';

type CardMobileProps = {
  title: string;
  subTitle?: string;
  image: string;
  countryCode: string;
  status: MiningStatus;
  data: CardData;
};

export const UserSiteCardMobile: FC<CardMobileProps> = ({
  title,
  subTitle,
  image = 'https://cleansatmining.com/data/files/capturedecran2023-04-19.png',
  data,
  status,
  countryCode,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { t: t_time } = useTranslation('timeframe', { keyPrefix: 'time' });
  //console.log('MOUNT UserSiteCard', title, data.apr);
  const hasData = data.income.available;

  return (
    <Card
      shadow={'sm'}
      padding={'0'}
      radius={'md'}
      withBorder={true}
      sx={{
        marginBottom: '10px',
        marginLeft: '5px',
        marginRight: '5px',
      }}
    >
      <Card.Section>
        <CardHeader
          image={image}
          miningState={status}
          title={title}
          subTitle={subTitle}
          dataEnable={data.income.available && status !== MiningStatus.inactive}
          isMobile={true}
          countryCode={countryCode}
        ></CardHeader>
      </Card.Section>

      <Accordion
        styles={{
          label: { paddingTop: '3px', paddingBottom: '3px' },
        }}
      >
        <Accordion.Item value={'token'}>
          <Accordion.Control>
            <AccordionLabel
              image={'https://cleansatmining.com/data/files/logo_csm.png'}
              value={formatToken(data.token.balance, 'CSM')}
              label={t('my-tokens')}
            ></AccordionLabel>
          </Accordion.Control>
          <Accordion.Panel>
            <CardTokenContent data={data}></CardTokenContent>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={'site'}>
          <Accordion.Control>
            <AccordionLabelImage
              image={
                require(`../../../../assets/icons/mining-site.png`).default
              }
              value={formatHashrate(
                hasData ? data.site.uptime.hashrate : data.site.hashrate,
              )}
              label={t('my-site')}
              valuePercent={hasData ? data.site.uptime.hashratePercent : -1}
            ></AccordionLabelImage>
          </Accordion.Control>
          <Accordion.Panel>
            <CardSiteDataContent data={data}></CardSiteDataContent>
            <CardSiteHashrate data={data}></CardSiteHashrate>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value={'income'}>
          <Accordion.Control>
            <AccordionLabel
              image={'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025'}
              value={formatSimpleUsd(
                data.income.grossDepreciationFree.balance.usd,
                hasData,
              )}
              label={t('my-income-short')}
              description={periodText(
                data.site.uptime.period,
                t_time,
                data.dataMissing,
                true,
              )}
              descriptionColor={
                data.site.uptime.period.real.days !==
                data.site.uptime.period.instruction.days
                  ? 'yellow'
                  : 'dimmed'
              }
              warning={data.dataMissing}
              warningMessage={t_time('warning')}
            ></AccordionLabel>
          </Accordion.Control>
          <Accordion.Panel>
            <CardIncomeContent data={data}></CardIncomeContent>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Card>
  );
};

interface AccordionLabelProps {
  label: string;
  image: string;
  value: string;
  valuePercent?: number;
  description?: string;
  descriptionColor?: string;
  warning?: boolean;
  warningMessage?: string;
}

function AccordionLabel({
  label,
  image,
  value,
  description,
  descriptionColor,
  warning,
  warningMessage,
}: AccordionLabelProps) {
  return (
    <Group position={'apart'} mih={40}>
      <Avatar src={image} size={'sm'} sx={{ margin: '0px' }} />
      <div>
        <Text weight={500} color={'dimmed'}>
          {label}
        </Text>
        <Group position={'center'} spacing={5}>
          {warning && (
            <HoverCard width={280} shadow={'md'}>
              <HoverCard.Target>
                <Image
                  src={'/icons/warning.png'}
                  alt={`Warning icon`}
                  width={14}
                  height={14}
                ></Image>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Text size='sm'>{warningMessage}</Text>
              </HoverCard.Dropdown>
            </HoverCard>
          )}
          <Text
            size={'xs'}
            weight={400}
            align={'center'}
            color={descriptionColor ? descriptionColor : 'dimmed'}
          >
            {description}
          </Text>
        </Group>
      </div>
      <Text size={'sm'} weight={400}>
        {value}
      </Text>
    </Group>
  );
}

function AccordionLabelImage({
  label,
  image,
  value,
  valuePercent = -1,
}: AccordionLabelProps) {
  return (
    <Group position={'apart'} mih={40}>
      <Image src={image} alt={'img'} height={24}></Image>
      <Text weight={500} color={'dimmed'}>
        {label}
      </Text>
      <div>
        <Text size={'sm'} weight={400}>
          {value}
        </Text>
        {valuePercent >= 0 && (
          <Progress
            size={'xs'}
            value={valuePercent}
            color={calculateProgressColor(valuePercent)}
          ></Progress>
        )}
      </div>
    </Group>
  );
}
