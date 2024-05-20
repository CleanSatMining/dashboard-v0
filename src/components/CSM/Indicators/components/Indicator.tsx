import React, { FC } from 'react';

import {
  Group,
  Paper,
  Text,
  useMantineTheme,
  Avatar,
  Flex,
} from '@mantine/core';

interface IndicatorProps {
  value: string;
  imageUrl?: string;
  label?: string;
  marginLeft?: string;
  withBorder?: boolean;
  isMobile?: boolean;
}

export const Indicator: FC<IndicatorProps> = ({
  value,
  imageUrl,
  label,
  marginLeft,
  withBorder = true,
  isMobile = false,
}) => {
  const theme = useMantineTheme();
  return (
    <>
      {
        <Paper
          shadow={withBorder ? 'xs' : undefined}
          withBorder={
            withBorder ? (theme.colorScheme === 'dark' ? true : false) : false
          }
          sx={{
            marginLeft: marginLeft,
            padding: '3px 10px 3px 10px',
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[6] : undefined,
          }}
        >
          {isMobile ? (
            <Group position={'apart'} spacing={5}>
              {label && (
                <Text size={'xs'} color={'dimmed'} fs={'italic'}>
                  {label}
                </Text>
              )}
              <Group position={'left'} spacing={5}>
                {imageUrl && (
                  <Avatar
                    src={imageUrl}
                    size={16}
                    sx={{ margin: '0px' }}
                    radius={0}
                  ></Avatar>
                )}
                <Text fw={'bold'} size={'xs'}>
                  {value}
                </Text>
              </Group>
            </Group>
          ) : (
            <Flex direction={'column'}>
              {label && (
                <Text size={'sm'} color={'dimmed'} fs={'italic'}>
                  {label}
                </Text>
              )}
              <Group position={'left'} spacing={5}>
                {imageUrl && (
                  <Avatar
                    src={imageUrl}
                    size={16}
                    sx={{ margin: '0px' }}
                    radius={0}
                  ></Avatar>
                )}
                <Text fw={'bold'} size={16}>
                  {value}
                </Text>
              </Group>
            </Flex>
          )}
        </Paper>
      }
    </>
  );
};
