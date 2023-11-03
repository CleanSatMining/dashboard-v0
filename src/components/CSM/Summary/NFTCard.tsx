import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Card,
  Flex,
  Stack,
  Group,
  MantineTheme,
  Text,
  Title,
  createStyles,
  HoverCard,
  Image,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { TablerIcon, IconCards, IconCardboards } from '@tabler/icons';
import { InfoTitle } from 'src/components/InfoText/InfoText';
import { Carousel } from '@mantine/carousel';
import { Metadata } from 'src/abis/types/NFT';
import { truncateString } from 'src/components/CSM/Utils/string';
const useStyle = createStyles((theme: MantineTheme) => ({
  brand: {
    color: theme.colors.brand[0],
  },
}));

type NFTProps = {
  title?: string;
  toolTip?: string;
  Icon?: TablerIcon;
  data: Metadata[];
  warning?: boolean;
};

const _NFTCard: FC<NFTProps> = ({ title, toolTip, Icon = IconCards, data }) => {
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

          {data.length > 1 && (
            <Carousel
              slideSize={'60%'}
              height={160}
              slideGap={'xl'}
              loop={true}
            >
              {data.map((nft, index) => (
                <Carousel.Slide key={'Carousel ' + index} height={200}>
                  <Flex gap={10} w={250}>
                    <Image
                      width={100}
                      src={data[0].external_url}
                      alt={`Slide ${1}`}
                    />
                    <div>
                      <Text ta={'left'} weight={1000}>
                        {data[0].name}
                      </Text>
                      <Text ta={'left'} color={'dimmed'}>
                        {truncateString(data[0].description, 80)}
                      </Text>
                    </div>
                  </Flex>
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
          {data.length === 1 && (
            <Flex gap={10}>
              <Image
                width={100}
                src={data[0].external_url}
                alt={`Slide ${1}`}
              />
              <div>
                <Text ta={'left'} weight={1000}>
                  {data[0].name}
                </Text>
                <Text ta={'left'} color={'dimmed'}>
                  {truncateString(data[0].description, 112)}
                </Text>
              </div>
            </Flex>
          )}
        </Card>
        <HoverCard.Dropdown>
          <Text size={'sm'}>{toolTip}</Text>
        </HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

export const NFTCard = memo(_NFTCard);
