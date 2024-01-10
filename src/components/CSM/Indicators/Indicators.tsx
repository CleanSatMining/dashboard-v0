import React, { FC } from 'react';
import { Group } from '@mantine/core';
import { Networkoverview } from 'src/components/CSM/Indicators/components/NetworkOverview';
import { BtcPrice } from 'src/components/CSM/Indicators/components/BtcPrice';

interface IndicatorsProps {
  withBorder?: boolean;
  withLabel?: boolean;
}

export const Indicators: FC<IndicatorsProps> = ({
  withBorder = false,
  withLabel = false,
}) => {
  return (
    <Group>
      <BtcPrice withBorder={withBorder} withLabel={withLabel}></BtcPrice>
      <Networkoverview
        withBorder={withBorder}
        withLabel={withLabel}
      ></Networkoverview>
    </Group>
  );
};
