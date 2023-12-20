import React, { FC } from 'react';
import { useAtomValue } from 'jotai';
import { btcPriceAtom } from 'src/states';
import { Group, Paper, Text, useMantineTheme, Avatar } from '@mantine/core';
import { formatUsd } from 'src/utils/format/format';

interface BtcPriceProps {
  marginLeft?: string;
}

export const BtcPrice: FC<BtcPriceProps> = ({ marginLeft }) => {
  const theme = useMantineTheme();
  const btcPrice = useAtomValue(btcPriceAtom);
  return (
    <>
      {btcPrice && (
        <Paper
          shadow={'xs'}
          //p={2}
          withBorder={theme.colorScheme === 'dark' ? true : false}
          sx={{
            marginLeft: marginLeft,
            padding: '3px 10px 3px 10px',
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : undefined,
          }}
        >
          <Group position={'apart'} spacing={5}>
            <Avatar
              src={'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025'}
              size={'xs'}
              sx={{ margin: '0px' }}
            ></Avatar>
            <Text fw={600} size={'sm'}>
              {formatUsd(btcPrice)}
            </Text>
          </Group>
        </Paper>
      )}
    </>
  );
};
