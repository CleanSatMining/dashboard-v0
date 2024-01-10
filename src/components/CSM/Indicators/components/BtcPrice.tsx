import React, { FC } from 'react';
import { useAtomValue } from 'jotai';
import { btcPriceAtom } from 'src/states';

import { formatUsd } from 'src/utils/format/format';
import { Indicator } from './Indicator';

interface BtcPriceProps {
  marginLeft?: string;
  withBorder?: boolean;
  withLabel?: boolean;
}

export const BtcPrice: FC<BtcPriceProps> = ({
  marginLeft,
  withBorder = true,
  withLabel = false,
}) => {
  const btcPrice = useAtomValue(btcPriceAtom);
  return (
    <>
      {btcPrice && (
        <Indicator
          value={formatUsd(btcPrice)}
          imageUrl={'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=025'}
          label={withLabel ? 'BTC price' : ''}
          marginLeft={marginLeft}
          withBorder={withBorder}
        ></Indicator>
      )}
    </>
  );
};
