import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Flex,
  Text,
  Title,
  BackgroundImage,
  createStyles,
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
};

export const CardHeader: FC<HeaderProps> = ({
  image,
  title,
  subTitle,
  miningState,
}) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 36em)');
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const { badgeColor, badgeState } = calculateSiteState(miningState);

  return (
    <BackgroundImage src={image} h={isMobile ? 100 : 150}>
      <Flex
        gap={'md'}
        justify={'center'}
        align={'center'}
        direction={'column'}
        h={'100%'}
      >
        <div className={classes.title}>
          <Title order={isMobile ? 3 : 2} color={'#fff'}>
            {title}
          </Title>
          {subTitle && (
            <Text weight={450} fz={isMobile ? 'xs' : 'md'} color={'#fff'}>
              {t(subTitle)}
            </Text>
          )}
        </div>

        <Badge color={badgeColor} variant={'filled'}>
          <Text fz={isMobile ? 'xs' : 'md'}>{t(badgeState)}</Text>
        </Badge>
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
