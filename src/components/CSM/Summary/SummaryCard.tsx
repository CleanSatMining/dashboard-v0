import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Card,
  Flex,
  Group,
  MantineTheme,
  Text,
  Title,
  createStyles,
  HoverCard,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { TablerIcon } from '@tabler/icons';
import { Data } from './SummaryType';
import { SummaryDetailCard } from './SummaryDetail';
import { InfoTitle } from 'src/components/InfoText/InfoText';

const useStyle = createStyles((theme: MantineTheme) => ({
  brand: {
    color: theme.colors.brand[0],
  },
}));

type SummaryProps = {
  title?: string;
  toolTip?: string;
  Icon?: TablerIcon;
  value?: string;
  data: Data[];
  subValue?: string;
  warning?: boolean;
};

const _SummaryCard: FC<SummaryProps> = ({
  title,
  toolTip,
  Icon,
  value,
  data,
  subValue,
  warning,
}) => {
  const { classes } = useStyle();
  const isMobile = useMediaQuery('(max-width: 40em)');
  const up4 = useMediaQuery('(max-width: 1520px)');
  const down4 = useMediaQuery('(min-width: 1199px)');
  const up3 = useMediaQuery('(max-width: 1095px)');
  const down3 = useMediaQuery('(min-width: 992px)');
  const up2 = useMediaQuery('(max-width: 784px)');
  const isTooShort = (up4 && down4) || (up3 && down3) || up2;
  const titleSize = isTooShort ? 4 : 3;

  const { t } = useTranslation('site', { keyPrefix: 'card' });
  return (
    <>
      <HoverCard width={350} shadow={'md'} disabled={toolTip ? false : true}>
        <Card
          shadow={'sm'}
          padding={isMobile ? 'xs' : 'lg'}
          radius={'md'}
          withBorder={true}
        >
          <Flex direction={'column'} h={'100%'}>
            <HoverCard.Target>
              <Group
                position={'apart'}
                mt={'0'}
                mb={isMobile ? 0 : 'xs'}
                spacing={0}
              >
                {!toolTip && (
                  <Title order={isMobile ? 6 : titleSize}>{title}</Title>
                )}
                {toolTip && (
                  <InfoTitle
                    title={title}
                    order={isMobile ? 6 : titleSize}
                    icon={!isMobile}
                  ></InfoTitle>
                )}
                {Icon && (
                  <ActionIcon variant={'transparent'}>
                    <Icon className={classes.brand}></Icon>
                  </ActionIcon>
                )}
              </Group>
            </HoverCard.Target>

            <Flex
              mih={isMobile ? 30 : 50}
              //gap={'md'}
              justify={'flex-start'}
              align={'flex-start'}
              direction={'column'}
            >
              {warning && (
                <InfoTitle
                  title={value}
                  order={isMobile ? 5 : 4}
                  color={'yellow'}
                  tooltipText={t('lost-explained')}
                  width={300}
                ></InfoTitle>
              )}
              {!warning && (
                <Title order={isMobile ? 5 : 4} color={'brand'}>
                  {value}
                </Title>
              )}
              {subValue !== undefined && (
                <Text
                  color={'dimmed'}
                  size={isMobile ? 12 : undefined}
                  sx={{ marginBottom: '10px' }}
                >
                  {subValue}
                </Text>
              )}
            </Flex>
            <Flex
              //mih={100}
              //bg='rgba(0, 0, 0, .3)'
              //gap='md'
              justify={'flex-end'}
              align={'flex-start'}
              direction={'column'}
              wrap={'wrap'}
              h={'100%'}
              w={'100%'}
            >
              {data.length > 0 && !isMobile && (
                <SummaryDetailCard data={data}></SummaryDetailCard>
              )}
            </Flex>
          </Flex>
        </Card>
        <HoverCard.Dropdown>
          <Text size={'sm'}>{toolTip}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export const SummaryCard = memo(_SummaryCard);
