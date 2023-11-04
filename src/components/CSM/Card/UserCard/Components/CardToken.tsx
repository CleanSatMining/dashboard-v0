import { FC } from 'react';
import { Text, Group, Divider, Avatar } from '@mantine/core';

import { useMediaQuery } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { CardData } from './../Type';

import { CardTokenContent } from './CardTokenContent';

export type CardTokenProps = {
  data: CardData;
};

export const CardToken: FC<CardTokenProps> = ({ data }) => {
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });

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
          {t('my-tokens')}
        </Text>
        <Avatar
          src={'https://cleansatmining.com/data/files/logo_csm.png'}
          size={isMobile ? 'xs' : 'sm'}
        ></Avatar>
      </Group>
      <Divider my={'sm'} />

      <CardTokenContent data={data} padding={'0px 5px'}></CardTokenContent>
    </>
  );
};
