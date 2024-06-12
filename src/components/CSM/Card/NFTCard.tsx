import { FC, memo, useState } from 'react';
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
  Image,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { TablerIcon, IconDiscountCheck } from '@tabler/icons-react';
import { InfoTitle } from 'src/components/InfoText/InfoText';
import { Carousel } from '@mantine/carousel';
import { Metadata, Attribute } from 'src/abis/types/NFT';
import { truncateString } from 'src/components/CSM/Utils/string';
import { NftModal } from 'src/components/CSM/Modal/NftModal';
import { useDisclosure } from '@mantine/hooks';
import { ULTRA_RARE } from 'src/constants/csm';

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

const _NFTCard: FC<NFTProps> = ({
  title,
  toolTip,
  Icon = IconDiscountCheck,
  data,
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
  const [nftId, setNftId] = useState('');
  const [nftUrl, setNftUrl] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftImage, setNftImage] = useState('');
  const [nftAttributes, setNftAttributes] = useState<Attribute[]>([]);
  const [nftDescription, setNftDescription] = useState('');
  const [opened, { open, close }] = useDisclosure(false);
  //console.log('NFTCard', JSON.stringify(data, null, 4));

  const { t } = useTranslation('site', { keyPrefix: 'card' });
  function handleOpenModal(index: number) {
    return () => {
      setNftId(data[index].id);
      setNftImage(data[index].image);
      setNftDescription(data[index].description);
      setNftName(data[index].name);
      setNftUrl(data[index].url);
      setNftAttributes(data[index].attributes);
      open();
    };
  }
  return (
    <>
      <NftModal
        contract={ULTRA_RARE.contract}
        collectionName={ULTRA_RARE.collection}
        contractLink={ULTRA_RARE.contractLink}
        name={nftName}
        image={nftImage}
        description={nftDescription}
        id={nftId}
        tokenUrl={nftUrl}
        attributes={nftAttributes}
        open={open}
        close={close}
        opened={opened}
      ></NftModal>
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
                <Carousel.Slide key={'Carousel ' + index}>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={handleOpenModal(index)}
                    key={index}
                  >
                    <Flex gap={10} w={250}>
                      <Image
                        width={100}
                        src={data[index].external_url}
                        alt={`Slide ${1}`}
                      />
                      <div>
                        <Text ta={'left'} weight={1000}>
                          {data[index].name + ' #' + data[index].id}
                        </Text>
                        <Text ta={'left'} color={'dimmed'} fz={14}>
                          {truncateString(data[index].description, 90)}
                        </Text>
                      </div>
                    </Flex>
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          )}
          {data.length === 1 && (
            <div
              style={{ cursor: 'pointer' }}
              onClick={handleOpenModal(0)}
              key={0}
            >
              <Flex gap={10}>
                <Image
                  width={100}
                  src={data[0].external_url}
                  alt={`Slide ${1}`}
                />
                <div>
                  <Text ta={'left'} weight={1000}>
                    {data[0].name + ' #' + data[0].id}
                  </Text>
                  <Text ta={'left'} color={'dimmed'} fz={14}>
                    {truncateString(data[0].description, 112)}
                  </Text>
                </div>
              </Flex>
            </div>
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
