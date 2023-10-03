/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC } from 'react';

import { Card, Avatar, Text, Accordion, Group } from '@mantine/core';

import { MiningStatus } from '../../../../types/mining/Site';
import {
  formatSimpleUsd,
  formatToken,
  formatHashrate,
  formatPeriod,
} from 'src/utils/format/format';

import { CardHeader } from './Components/CardHeader';
import { CardTokenContent } from './Components/CardTokenContent';
import { CardIncomeContent } from './Components/CardIncomeContent';
import { CardSiteDataContent } from './Components/CardSiteDataContent';
import { CardSiteHashrate } from './Components/CardSiteHashrate';
import { CardData } from './Type';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

type CardMobileProps = {
  title: string;
  subTitle?: string;
  image: string;
  status: MiningStatus;
  data: CardData;
};

export const UserSiteCardMobile: FC<CardMobileProps> = ({
  title,
  subTitle,
  image = 'https://cleansatmining.com/data/files/capturedecran2023-04-19.png',
  data,
  status,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
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
        ></CardHeader>
      </Card.Section>

      <Accordion
        styles={{
          //control: { padding: 0 },
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
              image={require(`../../../../images/mining-site.png`).default}
              value={formatHashrate(data.site.hashrate)}
              label={t('my-site')}
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
              value={formatSimpleUsd(data.income.net.balance.usd, hasData)}
              label={t('my-income-short')}
              description={
                t('over-start') + formatPeriod(data.site.uptime.onPeriod, t)
              }
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
  description?: string;
}

function AccordionLabel({
  label,
  image,
  value,
  description,
}: AccordionLabelProps) {
  return (
    <Group position={'apart'} mih={40}>
      <Avatar src={image} size={'sm'} sx={{ margin: '0px' }} />
      <div>
        <Text weight={500} color={'dimmed'}>
          {label}
        </Text>
        <Text size={'xs'} weight={400} align={'center'} color={'dimmed'}>
          {description}
        </Text>
      </div>
      <Text size={'sm'} weight={400}>
        {value}
      </Text>
    </Group>
  );
}

function AccordionLabelImage({ label, image, value }: AccordionLabelProps) {
  return (
    <Group position={'apart'} mih={40}>
      <Image src={image} alt={'img'} height={24}></Image>
      <Text weight={500} color={'dimmed'}>
        {label}
      </Text>
      <Text size={'sm'} weight={400}>
        {value}
      </Text>
    </Group>
  );
}
