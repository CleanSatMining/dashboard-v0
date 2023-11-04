import React, { FC, useState } from 'react';
import {
  Button,
  Paper,
  Image,
  Text,
  Avatar,
  Tooltip,
  Popover,
  CopyButton,
  ActionIcon,
  Group,
  useMantineTheme,
} from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons';

type Props = {
  erc20TokenAddress: string;
  erc20TokenSymbol: string;
  erc20TokenDecimal?: number;
  erc20TokenImage?: string;
  nftContractAddress: string;
  nftTokenId: string;
};

export const AddTokenToWallet: FC<Props> = ({
  erc20TokenAddress,
  erc20TokenSymbol,
  erc20TokenImage = 'https://cleansatmining.com/data/files/logo_csm.png',
  erc20TokenDecimal = 18,
  nftContractAddress,
  nftTokenId,
}) => {
  async function addErc20TokenToMetaMask() {
    const { ethereum } = window;
    if (ethereum) {
      try {
        /* eslint-disable */
        const wasAdded = await (window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: erc20TokenAddress,
              symbol: erc20TokenSymbol,
              decimals: erc20TokenDecimal,
              image: erc20TokenImage,
            },
          },
        });
        /* eslint-enable */

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('MetaMask is not installed or not detected.');
    }
  }

  async function addNftToMetaMask() {
    const { ethereum } = window;
    if (ethereum) {
      try {
        /* eslint-disable */
        const wasAdded = await (window as any).ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC721', // or 'ERC1155'
            options: {
              address: nftContractAddress, // The address of the token.
              tokenId: nftTokenId, // ERC-721 or ERC-1155 token ID.
            },
          },
        });
        /* eslint-enable */

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('MetaMask is not installed or not detected.');
    }
  }

  return (
    <div>
      <Paper style={{ display: 'inline-block', cursor: 'pointer' }}>
        <Button onClick={addErc20TokenToMetaMask} variant={'light'} size={'xs'}>
          {'Add ERC20 Token to MetaMask'}
        </Button>
      </Paper>

      <Paper style={{ display: 'inline-block', cursor: 'pointer' }}>
        <Button
          onClick={addNftToMetaMask}
          variant={'light'}
          size={'xs'}
          rightIcon={
            <Image
              src={
                'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
              }
              alt={'nft'}
              height={16}
            ></Image>
          }
        >
          {'Add NFT to MetaMask'}
        </Button>
      </Paper>
      <Paper style={{ display: 'inline-block', cursor: 'pointer' }}>
        <Group spacing={5}>
          <Text fz={'xs'}>{nftContractAddress}</Text>
          <CopyButton value={nftContractAddress} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} position={'right'}>
                <ActionIcon onClick={copy} size={16} variant={'transparent'}>
                  {copied ? (
                    <IconCheck color='teal' size='1rem' />
                  ) : (
                    <IconCopy size='1rem' />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label={'Add NFT to MetaMask'} position={'right'}>
            <ActionIcon
              size={16}
              onClick={addNftToMetaMask}
              variant={'transparent'}
            >
              <Image
                src={
                  'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
                }
                alt={'nft'}
                height={16}
              ></Image>
            </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </div>
  );
};

type Erc20Props = {
  erc20TokenAddress: string;
  erc20TokenSymbol: string;
  erc20TokenDecimal?: number;
  erc20TokenImage?: string;
};

export const AddErc20ToWalletWidget: FC<Erc20Props> = ({
  erc20TokenAddress,
  erc20TokenSymbol,
  erc20TokenImage = 'https://cleansatmining.com/data/files/logo_csm.png',
  erc20TokenDecimal = 18,
}) => {
  const theme = useMantineTheme();

  // Condition pour choisir la couleur d'arrière-plan en fonction du thème
  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0];

  return (
    <div>
      <Paper
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          padding: '5px',
          backgroundColor: backgroundColor,
        }}
      >
        <Group spacing={5}>
          <Tooltip label={'See on gnosisscan'} position={'right'}>
            <ActionIcon size={16} variant={'transparent'}>
              <Image src={erc20TokenImage} alt={'nft'} height={16}></Image>
            </ActionIcon>
          </Tooltip>
          <Tooltip label={'See on gnosisscan'} position={'right'}>
            <Text fz={'xs'}>{erc20TokenAddress}</Text>
          </Tooltip>
          <CopyButton value={erc20TokenAddress} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} position={'right'}>
                <ActionIcon onClick={copy} size={16} variant={'transparent'}>
                  {copied ? (
                    <IconCheck color={'teal'} size={'1rem'} />
                  ) : (
                    <IconCopy size={'1rem'} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label={'Add Token to MetaMask'} position={'right'}>
            <ActionIcon
              size={16}
              onClick={() =>
                addErc20TokenToMetaMask(
                  erc20TokenAddress,
                  erc20TokenSymbol,
                  erc20TokenDecimal,
                  erc20TokenImage,
                )
              }
              variant={'transparent'}
            >
              <Image
                src={
                  'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
                }
                alt={'nft'}
                height={16}
              ></Image>
            </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </div>
  );
};

export const AddErc20ToWallet: FC<Erc20Props> = ({
  erc20TokenAddress,
  erc20TokenSymbol,
  erc20TokenImage = 'https://cleansatmining.com/data/files/logo_csm.png',
  erc20TokenDecimal = 9,
}) => {
  return (
    <Tooltip label={'Add Token to MetaMask'} position={'right'}>
      <ActionIcon
        size={16}
        onClick={() =>
          addErc20TokenToMetaMask(
            erc20TokenAddress,
            erc20TokenSymbol,
            erc20TokenDecimal,
            erc20TokenImage,
          )
        }
        variant={'transparent'}
      >
        <Image
          src={
            'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
          }
          alt={'nft'}
          height={16}
        ></Image>
      </ActionIcon>
    </Tooltip>
  );
};

type NftProps = {
  nftContractAddress: string;
  nftTokenId: string;
};

export const AddNftToWalletWidget: FC<NftProps> = ({
  nftContractAddress,
  nftTokenId,
}) => {
  const theme = useMantineTheme();

  // Condition pour choisir la couleur d'arrière-plan en fonction du thème
  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0];

  return (
    <div>
      <Paper
        style={{
          display: 'inline-block',
          cursor: 'pointer',
          padding: '5px',
          backgroundColor: backgroundColor,
        }}
      >
        <Group spacing={5}>
          <Tooltip label={'See on gnosisscan'} position={'right'}>
            <Text fz={'xs'}>{nftContractAddress}</Text>
          </Tooltip>
          <CopyButton value={nftContractAddress} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? 'Copied' : 'Copy'} position={'right'}>
                <ActionIcon onClick={copy} size={16} variant={'transparent'}>
                  {copied ? (
                    <IconCheck color={'teal'} size={'1rem'} />
                  ) : (
                    <IconCopy size={'1rem'} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label={'Add NFT to MetaMask'} position={'right'}>
            <ActionIcon
              size={16}
              onClick={() => addNftToMetaMask(nftContractAddress, nftTokenId)}
              variant={'transparent'}
            >
              <Image
                src={
                  'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
                }
                alt={'nft'}
                height={16}
              ></Image>
            </ActionIcon>
          </Tooltip>
        </Group>
      </Paper>
    </div>
  );
};

export const AddNftToWallet: FC<NftProps> = ({
  nftContractAddress,
  nftTokenId,
}) => {
  return (
    <Tooltip label={'Add NFT to MetaMask'} position={'right'}>
      <ActionIcon
        size={16}
        onClick={() => addNftToMetaMask(nftContractAddress, nftTokenId)}
        variant={'transparent'}
      >
        <Image
          src={
            'https://static.coingecko.com/s/metamask_fox-99d631a5c38b5b392fdb2edd238a525ba0657bc9ce045077c4bae090cfc5b90a.svg'
          }
          alt={'nft'}
          height={16}
        ></Image>
      </ActionIcon>
    </Tooltip>
  );
};

async function addErc20TokenToMetaMask(
  erc20TokenAddress: string,
  erc20TokenSymbol: string,
  erc20TokenDecimal: number,
  erc20TokenImage: string,
) {
  const { ethereum } = window;
  if (ethereum) {
    try {
      /* eslint-disable */
      const wasAdded = await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: erc20TokenAddress,
            symbol: erc20TokenSymbol,
            decimals: erc20TokenDecimal,
            image: erc20TokenImage,
          },
        },
      });
      /* eslint-enable */
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('MetaMask is not installed or not detected.');
  }
}

async function addNftToMetaMask(
  nftContractAddress: string,
  nftTokenId: string,
) {
  const { ethereum } = window;
  if (ethereum) {
    try {
      /* eslint-disable */
      const wasAdded = await (window as any).ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: nftContractAddress,
            tokenId: nftTokenId, // ERC-721 or ERC-1155 token ID.
          },
        },
      });
      /* eslint-enable */
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('MetaMask is not installed or not detected.');
  }
}
