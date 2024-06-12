/* eslint @typescript-eslint/no-var-requires: "off" */
import React, { FC } from 'react';
import {
  Card,
  Text,
  Group,
  createStyles,
  MantineTheme,
  Tooltip,
  Modal,
  SimpleGrid,
  Title,
  rem,
  useMantineTheme,
  Image as MantineImage,
  Space,
  Paper,
} from '@mantine/core';
import { GnosisSvg } from 'src/assets/chains/Gnosis';
import {
  IconDiscountCheck,
  IconAlignJustified,
  IconListDetails,
  IconChartRadar,
} from '@tabler/icons-react';
import { openInNewTab } from 'src/utils/window';
import { useTranslation } from 'react-i18next';
import { IconLink } from 'src/components/Link/Link';
import { useViewportSize } from '@mantine/hooks';
import { useMediaQuery } from '@mantine/hooks';
import { AddNftToWalletWidget } from '../Wallet/AddTokenToWallet';
import { Attribute } from 'src/abis/types/NFT';

export const useStyle = createStyles((theme: MantineTheme) => ({
  customArticle: {
    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
    }`,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginLeft: 0,
    marginRight: 20,
    margin: 20,
    position: 'relative',
  },
  customItemFrame: {
    margin: 20,
  },
  customItemMediaFrame: {
    margin: '20px 0',
    position: 'relative',
  },
}));

export type NftModalProps = {
  opened: boolean;
  open: () => void;
  close: () => void;
  contract: string;
  contractLink: string;
  collectionName: string;
  id: string;
  name: string;
  image: string;
  description: string;
  tokenUrl: string;
  attributes: Attribute[];
};

export const NftModal: FC<NftModalProps> = ({
  opened,
  close,
  collectionName,
  contract,
  contractLink,
  id,
  name,
  image,
  description,
  tokenUrl,
  attributes,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation('site', { keyPrefix: 'card' });
  const isMobile = useMediaQuery('(max-width: 40em)');
  const theme = useMantineTheme();
  const { height } = useViewportSize();
  const maxWidth = height / 0.75;

  return (
    <Modal fullScreen={true} opened={opened} onClose={close}>
      <Group position={'center'}>
        <div
          accessKey={'modal'}
          style={{ maxWidth: isMobile ? 'auto' : `${maxWidth}px` }}
        >
          <SimpleGrid cols={isMobile ? 1 : 2}>
            <div>
              <Card withBorder={true} shadow={'sm'} radius={'md'}>
                <Card.Section withBorder={true} inheritPadding={true} py={5}>
                  <Group position={'apart'}>
                    <Tooltip label={'Chain: Gnosis'}>
                      <div style={{ height: '20px', cursor: 'pointer' }}>
                        <GnosisSvg width={20}></GnosisSvg>
                      </div>
                    </Tooltip>
                    <Tooltip label={`Voir l'image original`}>
                      <div style={{ height: '20px' }}>
                        <IconLink url={image} size={16}></IconLink>
                      </div>
                    </Tooltip>
                  </Group>
                </Card.Section>

                <Card.Section mt={0}>
                  <MantineImage
                    src={image}
                    alt={image}
                    fit={'contain'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => openInNewTab(image)}
                  />
                </Card.Section>
              </Card>
            </div>
            <div>
              <Tooltip label={'Voir le contract'} position={'bottom-start'}>
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => openInNewTab(contractLink)}
                >
                  <Group spacing={5}>
                    <Title order={5} fw={450} color={theme.colors.brand[5]}>
                      {collectionName}
                    </Title>
                    <IconDiscountCheck
                      size={rem(20)}
                      color={theme.colors.brand[5]}
                    />
                  </Group>
                </div>
              </Tooltip>

              <Space h={'xs'}></Space>
              <Title order={4}>{name + ' #' + id}</Title>
              <Text fz={12} color={'dimmed'}>
                {'Owned by you'}
              </Text>
              <Space h={30}></Space>
              <Card withBorder={true} shadow={'sm'} radius={'md'}>
                <Card.Section withBorder={true} inheritPadding={true} py={'xs'}>
                  <Group>
                    <IconAlignJustified size={rem(20)} />
                    <Text weight={500}>{'Description'}</Text>
                  </Group>
                </Card.Section>

                <Text mt={'sm'} color={'dimmed'} size={'sm'}>
                  {description}
                </Text>
              </Card>
              <Space h={'xs'}></Space>
              <Card withBorder={true} shadow={'sm'} radius={'md'}>
                <Card.Section withBorder={true} inheritPadding={true} py={'xs'}>
                  <Group>
                    <IconChartRadar size={rem(20)} />
                    <Text weight={500}>{'Attributs'}</Text>
                  </Group>
                </Card.Section>
                <Space h={'xs'}></Space>

                {attributes.length > 0 && (
                  <SimpleGrid cols={isMobile ? 1 : 3}>
                    {attributes.map((attribute, index) => (
                      <Paper
                        p={'xs'}
                        key={index}
                        withBorder={
                          theme.colorScheme === 'light' ? true : false
                        }
                        shadow={
                          theme.colorScheme === 'light' ? 'md' : undefined
                        }
                      >
                        <Text
                          fz={12}
                          ta={'center'}
                          tt={'uppercase'}
                          color={'dimmed'}
                        >
                          {attribute.trait_type}
                        </Text>
                        <Text fz={14} ta={'center'} fw={500}>
                          {attribute.value}
                        </Text>
                      </Paper>
                    ))}
                  </SimpleGrid>
                )}
              </Card>
              <Space h={'xs'}></Space>
              <Card withBorder={true} shadow={'sm'} radius={'md'}>
                <Card.Section withBorder={true} inheritPadding={true} py={'xs'}>
                  <Group>
                    <IconListDetails size={rem(20)} />
                    <Text weight={500}>{'Details'}</Text>
                  </Group>
                </Card.Section>
                <Space h={'xs'}></Space>
                <Group position={'apart'}>
                  <Text size={'sm'} color={'dimmed'}>
                    {'Contract Address'}
                  </Text>
                  <AddNftToWalletWidget
                    nftContractAddress={contract}
                    nftTokenId={'' + id}
                    fullAddress={false}
                    nftTokenLink={contractLink}
                    size={'sm'}
                    color={theme.colors.brand[5]}
                  ></AddNftToWalletWidget>
                </Group>
                <Group position={'apart'}>
                  <Text size={'sm'} color={'dimmed'}>
                    {'Token ID'}
                  </Text>
                  <Text
                    size={'sm'}
                    onClick={() => openInNewTab(tokenUrl)}
                    color={theme.colors.brand[5]}
                    style={{ cursor: 'pointer' }}
                  >
                    {'' + id}
                  </Text>
                </Group>
                <Group position={'apart'}>
                  <Text size={'sm'} color={'dimmed'}>
                    {'Token Standard'}
                  </Text>
                  <Text size={'sm'}>{'ERC-721'}</Text>
                </Group>
                <Group position={'apart'}>
                  <Text size={'sm'} color={'dimmed'}>
                    {'Chain'}
                  </Text>
                  <Text size={'sm'}>{'Gnosis'}</Text>
                </Group>
              </Card>
            </div>
          </SimpleGrid>
        </div>
      </Group>
    </Modal>
  );
};
