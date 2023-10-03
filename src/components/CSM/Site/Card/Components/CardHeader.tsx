import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Flex,
  Text,
  Title,
  BackgroundImage,
  createStyles,
  Group,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { MiningStatus } from '../../../../../types/mining/Site';

export const useStyle = createStyles(() => ({
  title: {
    textAlign: 'center',
  },
}));

export type HeaderProps = {
  image: string;
  title: string;
  subTitle?: string;
  miningState: MiningStatus;
  dataEnable?: boolean;
};

export const CardHeader: FC<HeaderProps> = ({
  image,
  title,
  subTitle,
  miningState,
  dataEnable = true,
}) => {
  const isMobile = useMediaQuery('(max-width: 36em)');

  return (
    <BackgroundImage src={image} h={isMobile ? 70 : 150}>
      {isMobile ? (
        <MobileHeaderContent
          title={title}
          subTitle={subTitle}
          miningState={miningState}
          dataEnable={dataEnable}
        ></MobileHeaderContent>
      ) : (
        <HeaderContent
          title={title}
          subTitle={subTitle}
          miningState={miningState}
          dataEnable={dataEnable}
        ></HeaderContent>
      )}
    </BackgroundImage>
  );
};

export type HeaderContentProps = {
  title: string;
  subTitle?: string;
  miningState: MiningStatus;
  dataEnable?: boolean;
};

const MobileHeaderContent: FC<HeaderContentProps> = ({
  title,
  subTitle,
  miningState,
  dataEnable = true,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { badgeColor, badgeState } = calculateSiteState(miningState);

  return (
    <Group position={'apart'} sx={{ padding: '10px' }}>
      <div>
        <Title order={3} color={'#fff'}>
          {title}
        </Title>
        {subTitle && (
          <Text weight={450} fz={'xs'} color={'#fff'}>
            {t(subTitle)}
          </Text>
        )}
      </div>

      <Flex gap={'xs'} justify={'center'} align={'center'} direction={'column'}>
        <Badge color={badgeColor} variant={'filled'}>
          <Text fz={'xs'}>{t(badgeState)}</Text>
        </Badge>
        {!dataEnable && miningState === MiningStatus.active && (
          <Badge color={'yellow.5'} variant={'filled'}>
            <Text fz={'xs'}>{t('no-data')}</Text>
          </Badge>
        )}
      </Flex>
    </Group>
  );
};

const HeaderContent: FC<HeaderContentProps> = ({
  title,
  subTitle,
  miningState,
  dataEnable = true,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { badgeColor, badgeState } = calculateSiteState(miningState);
  const { classes } = useStyle();
  return (
    <Flex
      gap={'md'}
      justify={'center'}
      align={'center'}
      direction={'column'}
      h={'100%'}
    >
      <div className={classes.title}>
        <Title order={2} color={'#fff'}>
          {title}
        </Title>
        {subTitle && (
          <Text weight={450} fz={'md'} color={'#fff'}>
            {t(subTitle)}
          </Text>
        )}
      </div>

      <Group position={'center'}>
        <Badge color={badgeColor} variant={'filled'}>
          <Text fz={'md'}>{t(badgeState)}</Text>
        </Badge>
        {!dataEnable && miningState === MiningStatus.active && (
          <Badge color={'yellow.5'} variant={'filled'}>
            <Text fz={'xs'}>{t('no-data')}</Text>
          </Badge>
        )}
      </Group>
    </Flex>
  );
};

/**
 *
 * @param miningState
 * @returns
 */
function calculateSiteState(miningState: MiningStatus) {
  let badgeColor = 'gray';
  let badgeState = 'inactive';

  switch (miningState) {
    case MiningStatus.active: {
      //statements;
      badgeState = 'active';
      badgeColor = 'green';
      break;
    }
    case MiningStatus.inactive: {
      //statements;
      badgeState = 'inactive';
      badgeColor = 'red';
      break;
    }
    case MiningStatus.stopped: {
      //statements;
      badgeState = 'stoped';
      badgeColor = 'orange';
      break;
    }
    default: {
      //statements;
      break;
    }
  }
  return { badgeColor, badgeState };
}
