/* eslint @typescript-eslint/no-var-requires: "off" */
import { FC } from 'react';
import { Text, Group, Divider, Space } from '@mantine/core';

import Image from 'next/image';

import { useMediaQuery } from '@mantine/hooks';
import { CardSiteHashrate } from './CardSiteHashrate';
import { CardData } from './../Type';

import { CardSiteDataContent } from './CardSiteDataContent';

export type CardSiteDataProps = {
  data: CardData;
};

export const CardSiteData: FC<CardSiteDataProps> = ({ data }) => {
  const isMobile = useMediaQuery('(max-width: 36em)');

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

        <Image
          src={require(`../../../../../images/mining-site.png`).default}
          alt={'img'}
          height={isMobile ? 18 : 24}
        ></Image>
      </Group>

      <Divider my={'sm'} />
      <CardSiteDataContent
        data={data}
        padding={'0px 5px'}
      ></CardSiteDataContent>
      <Space h={'0'}></Space>
      <CardSiteHashrate data={data} padding={'0px 5px'}></CardSiteHashrate>
    </>
  );
};
