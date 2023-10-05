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
  Image as ImgMantine,
} from '@mantine/core';

import { MiningStatus } from '../../../../../types/mining/Site';

export const useStyle = createStyles((theme) => ({
  title: {
    textAlign: 'center',
    marginTop: '-50px',
  },
  flagContainer: {
    transform: 'rotate(45deg)',
  },
  flag: {
    transform: 'perspective(15px) rotate3d(1, 0, 0, 30deg);',
    marginRight: '-16px',
    marginTop: '-8px',
  },
  flagMobile: {
    transform: 'perspective(15px) rotate3d(1, 0, 0, 30deg);',
    marginRight: '-15px',
    marginTop: '-5px',
  },
  background: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[5]
        : theme.colors.gray[1],
  },
}));

export type HeaderProps = {
  image: string;
  title: string;
  countryCode: string;
  subTitle?: string;
  miningState: MiningStatus;
  dataEnable?: boolean;
  isMobile: boolean;
};

export const CardHeader: FC<HeaderProps> = ({
  image,
  title,
  subTitle,
  miningState,
  countryCode,
  dataEnable = true,
  isMobile,
}) => {
  //const isMobile = useMediaQuery('(max-width: 36em)');

  return (
    <>
      {isMobile ? (
        <MobileHeaderContent
          title={title}
          subTitle={subTitle}
          miningState={miningState}
          dataEnable={dataEnable}
          image={image}
          countryCode={countryCode}
        ></MobileHeaderContent>
      ) : (
        <HeaderContent
          title={title}
          subTitle={subTitle}
          miningState={miningState}
          dataEnable={dataEnable}
          image={image}
          countryCode={countryCode}
        ></HeaderContent>
      )}
    </>
  );
};

export type HeaderContentProps = {
  title: string;
  subTitle?: string;
  countryCode: string;
  miningState: MiningStatus;
  dataEnable?: boolean;
  image: string;
};

const MobileHeaderContent: FC<HeaderContentProps> = ({
  title,
  subTitle,
  miningState,
  dataEnable = true,
  countryCode,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { badgeColor, badgeState } = calculateSiteState(miningState);
  const { classes } = useStyle();
  return (
    <BackgroundImage src={''} h={70} className={classes.background}>
      <Group position={'right'}>
        <div className={classes.flagContainer}>
          <ImgMantine
            width={35}
            height={18}
            src={
              'http://purecatamphetamine.github.io/country-flag-icons/3x2/' +
              countryCode +
              '.svg'
            }
            fit={'cover'}
            className={classes.flagMobile}
          ></ImgMantine>
        </div>
      </Group>
      <Group position={'apart'} sx={{ padding: '10px' }}>
        <div style={{ marginTop: '-18px' }}>
          <Title order={3} color={'#fff'}>
            {title}
          </Title>
          {subTitle && (
            <Text weight={450} fz={'xs'} color={'#fff'}>
              {t(subTitle)}
            </Text>
          )}
        </div>

        <Flex
          gap={'xs'}
          justify={'center'}
          align={'center'}
          direction={'column'}
        >
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
    </BackgroundImage>
  );
};

const HeaderContent: FC<HeaderContentProps> = ({
  title,
  subTitle,
  miningState,
  dataEnable = true,
  countryCode,
}) => {
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { badgeColor, badgeState } = calculateSiteState(miningState);
  const { classes } = useStyle();
  return (
    <BackgroundImage src={''} h={150} className={classes.background}>
      <Group position={'right'}>
        <div className={classes.flagContainer}>
          <ImgMantine
            width={40}
            height={25}
            src={
              'http://purecatamphetamine.github.io/country-flag-icons/3x2/' +
              countryCode +
              '.svg'
            }
            fit={'cover'}
            className={classes.flag}
          ></ImgMantine>
        </div>
      </Group>
      <Flex
        gap={'md'}
        justify={'center'}
        align={'center'}
        direction={'column'}
        h={'100%'}
      >
        <div className={classes.title}>
          <Title order={2}>{title}</Title>
          {subTitle && (
            <Text weight={450} fz={'md'}>
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
    </BackgroundImage>
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
