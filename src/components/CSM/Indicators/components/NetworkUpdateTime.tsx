import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { formatTimestamp } from 'src/utils/format/format';
import { useNetworkOverview } from 'src/hooks/useNetworkOverview';

import { Indicator } from './Indicator';

interface NetworkUpdateTimeProps {
  marginLeft?: string;
  withBorder?: boolean;
  withLabel?: boolean;
}

export const NetworkUpdateTime: FC<NetworkUpdateTimeProps> = ({
  marginLeft,
  withBorder = true,
  withLabel = false,
}) => {
  const { t } = useTranslation('banner');
  const { overview, isLoading } = useNetworkOverview();

  return (
    <>
      {!isLoading && (
        <>
          <Indicator
            value={formatTimestamp(overview.timestamp)}
            label={withLabel ? t('updateTime') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
        </>
      )}
    </>
  );
};
