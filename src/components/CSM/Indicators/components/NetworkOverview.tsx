import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  formatCustumHashrate,
  formatUsd,
  formatPercent,
  formatBigDecimals,
} from 'src/utils/format/format';
import { useNetworkOverview } from 'src/hooks/useNetworkOverview';

import { Indicator } from './Indicator';

interface NetworkOverviewProps {
  marginLeft?: string;
  withBorder?: boolean;
  withLabel?: boolean;
}

export const Networkoverview: FC<NetworkOverviewProps> = ({
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
            value={formatUsd(overview.marketcap, 1) + 'B USD'}
            imageUrl={'https://cdn-icons-png.flaticon.com/512/4256/4256900.png'}
            label={withLabel ? t('marketCap') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
          <Indicator
            value={formatUsd(overview.hashpriceUsd * 1000) + ' USD'}
            imageUrl={'https://cdn-icons-png.flaticon.com/512/2178/2178616.png'}
            label={withLabel ? t('hashPrice') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
          <Indicator
            value={formatPercent(overview.feesBlocks24H / 100, 2)}
            imageUrl={
              'https://cdn-icons-png.flaticon.com/512/10704/10704301.png'
            }
            label={withLabel ? t('feesBlocks24H') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
          <Indicator
            value={formatBigDecimals(overview.coinbaseRewards24H, 2) + ' BTC'}
            imageUrl={'https://cdn-icons-png.flaticon.com/512/8794/8794530.png'}
            label={withLabel ? t('blockRewards') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
          <Indicator
            value={formatCustumHashrate(overview.networkHashrate7D, 6, 'EH/s')}
            imageUrl={'https://cdn-icons-png.flaticon.com/512/5198/5198491.png'}
            label={withLabel ? t('networkHashrate7D') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
          <Indicator
            value={
              Math.round(
                (new Date(overview.nextHalvingDate).getTime() -
                  new Date().getTime()) /
                  86400000,
              ) + ' jours'
            }
            imageUrl={'https://cdn-icons-png.flaticon.com/512/1442/1442093.png'}
            label={withLabel ? t('halvingCountdown') : ''}
            marginLeft={marginLeft}
            withBorder={withBorder}
          ></Indicator>
        </>
      )}
    </>
  );
};
