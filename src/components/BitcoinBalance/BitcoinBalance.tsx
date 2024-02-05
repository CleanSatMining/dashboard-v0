import React, { useState, useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { formatSimpleUsd, formatBTC } from 'src/utils/format/format';
import { Stack, Text } from '@mantine/core';
import { BitcoinBalanceResponse } from './Types';
import { API_TREASURY } from 'src/constants/apis';

export type BitcoinBalanceCheckerProps = {
  siteId: string;
  btcPrice: number;
  isMobile: boolean;
};

const BitcoinBalanceChecker: React.FC<BitcoinBalanceCheckerProps> = ({
  siteId,
  btcPrice,
  isMobile,
}) => {
  //const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const checkBalance = async () => {
      try {
        const response = await fetch(API_TREASURY.url(siteId));

        if (!response.ok) {
          throw new Error(`Erreur de réseau: ${response.status}`);
        }

        const data: BitcoinBalanceResponse = await response.json();

        // 'final_balance' contient la balance totale en satoshis
        const totalBalance = data.final_balance;

        // Convertir de satoshis à bitcoins
        const balanceInBTC = totalBalance / 1e8;

        setBalance(balanceInBTC);
      } catch (error) {
        console.error('Erreur lors de la récupération de la balance :', error);
      }
    };

    checkBalance();
  }, [siteId]);

  return (
    <Stack spacing={0} align={'flex-end'} justify={'flex-start'}>
      <Text weight={500} fz={isMobile ? 'xs' : 'sm'}>
        {balance ? formatBTC(balance) : '-'}
      </Text>
      {balance && (
        <Text fz={'xs'} color={'dimmed'}>
          {formatSimpleUsd(new BigNumber(balance).times(btcPrice).toNumber())}
        </Text>
      )}
    </Stack>
  );
};

export default BitcoinBalanceChecker;
