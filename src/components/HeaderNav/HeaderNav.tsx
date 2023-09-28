import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/router';

import { Flex, Text } from '@mantine/core';
import Link from 'next/link';

import { useRole } from 'src/hooks/useRole';
import { USER_ROLE, isRole } from 'src/types/admin';

import { styles } from './Header.styles';

export const HeaderNav: FC = () => {
  const { t } = useTranslation('header');
  const router = useRouter();
  const colorSelected = '#cfaa70';

  const { role } = useRole();

  return (
    <Flex sx={styles.container} gap={100}>
      {isRole(role, [USER_ROLE.MODERATOR, USER_ROLE.ADMIN]) ? (
        <Text
          size={'xl'}
          weight={700}
          component={Link}
          href={'/admin'}
          color={router.pathname === '/admin' ? colorSelected : ''}
        >
          {t('titleAdmin')}
        </Text>
      ) : undefined}
    </Flex>
  );
};
