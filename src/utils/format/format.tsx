import { BigNumber } from 'bignumber.js';

export const formatUsd = (
  tvl: number,
  digit = 0,
  symbol = '$',
  currency = 'USD',
  oraclePrice = 1,
) => {
  // TODO: bignum?
  if (oraclePrice) {
    tvl /= oraclePrice;
  }
  const order = Math.floor(Math.log10(tvl) / 3);

  const units = ['', 'k', 'M', 'B', 'T'];
  const shouldShowUnits = order > 1; // only use units if 1M+
  let unitToDisplay = '';
  let num = tvl;

  if (shouldShowUnits) {
    num = tvl / 1000 ** order;
    unitToDisplay = units[order];
  }
  const prefix = symbol;

  return num < 999
    ? prefix + num.toFixed(2) + unitToDisplay
    : tvl.toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: digit,
        minimumFractionDigits: digit,
      });
};

/**
 * Formats a number to output as a percent% string
 * @param percent as decimal e.g. 0.01 to represent 1%
 * @param dp
 * @param placeholder
 */
export const formatPercent = (
  percent: number | null | undefined,
  dp = 2,
  placeholder: string = '?',
) => {
  if (!percent && percent !== 0) return placeholder;

  if (percent === 0) {
    return '0%';
  }

  // Convert to number
  const numberPercent: number = percent * 100;

  const units = ['', 'k', 'M', 'B', 'T', 'Q', 'S'];
  const order = Math.floor(Math.log10(numberPercent) / 3);

  // Show fire symbol if very large %
  if (order >= units.length - 1) return `🔥`;

  // Magnitude to display
  let unitToDisplay = '';
  let num: number = numberPercent;
  if (order > 1) {
    num = numberPercent / 1000 ** order;
    unitToDisplay = units[order];
  }

  // Format output
  return num < 999
    ? `${num.toFixed(dp)}${unitToDisplay}%`
    : numberPercent.toLocaleString('en-US', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }) + '%';
};

export function formatSmallPercent(
  percent: number,
  maxPlaces = 2,
  minPlaces = 0,
  formatZero = false,
): string {
  return !formatZero && percent === 0
    ? '0%'
    : (percent * 100).toLocaleString('en-US', {
        maximumFractionDigits: maxPlaces,
        minimumFractionDigits: minPlaces,
      }) + '%';
}

export function formatBigNumber(num: number) {
  let value = new BigNumber(num);
  value = value.decimalPlaces(2, BigNumber.ROUND_FLOOR);

  if (value.isZero()) {
    return '0';
  }
  const order = getBigNumOrder(value);
  if (value.abs().gte(100)) {
    value = value.decimalPlaces(0, BigNumber.ROUND_FLOOR);
  }
  if (order < 2 && value.abs().gte(100)) {
    return value.toNumber().toLocaleString('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });
  }
  const units = ['', 'k', 'M', 'B', 'T'];

  return value.shiftedBy(-order * 3).toFixed(2) + units[order];
}

export function getBigNumOrder(num: BigNumber): number {
  const nEstr = num
    .abs()
    .decimalPlaces(0, BigNumber.ROUND_FLOOR)
    .toExponential();
  const parts = nEstr.split('e');
  const exp = parseInt(parts[1] || '0');
  return Math.floor(exp / 3);
}

export function formatFullNumber(
  num: number,
  maxDp = 2,
  roundMode: BigNumber.RoundingMode = BigNumber.ROUND_FLOOR,
) {
  let value = new BigNumber(num);
  value = value.decimalPlaces(2, BigNumber.ROUND_FLOOR);
  return stripTrailingZeros(
    value.toFormat(maxDp, roundMode, {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: '.',
      fractionGroupSize: 0,
      suffix: '',
    }),
  );
}
export function formatFullBigNumber(
  value: BigNumber,
  maxDp = 2,
  roundMode: BigNumber.RoundingMode = BigNumber.ROUND_FLOOR,
) {
  value = value.decimalPlaces(2, BigNumber.ROUND_FLOOR);
  return stripTrailingZeros(
    value.toFormat(maxDp, roundMode, {
      prefix: '',
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
      secondaryGroupSize: 0,
      fractionGroupSeparator: '.',
      fractionGroupSize: 0,
      suffix: '',
    }),
  );
}

export const stripTrailingZeros = (str: string) => {
  return str.replace(/(\.[0-9]*?)(0+$)/, '$1').replace(/\.$/, '');
};

export function formatBigDecimals(num: number, maxPlaces = 8, strip = true) {
  const value = new BigNumber(num);

  if (value.isZero() && strip) {
    return '0';
  }

  const fixed = value.toFixed(maxPlaces);
  return strip ? stripTrailingZeros(fixed) : fixed;
}

export function formatBTC(num: number) {
  return formatBigDecimals(num) + ' BTC';
}

export function formatToken(num: number, symbol = '') {
  return formatFullNumber(num) + (symbol == '' ? '' : ' ' + symbol);
}

export function formatHashrate(num: number) {
  const numBig = new BigNumber(num);
  const value = numBig.dividedBy(new BigNumber(10).exponentiatedBy(12));
  return formatFullBigNumber(value, 0, 0) + ' TH/s';
}

export const formatUsdCentsPerKWh = (
  tvl: number,
  digit = 0,
  symbol = '$',
  currency = 'USD',
  oraclePrice = 1,
) => {
  const usd = formatUsd(tvl, digit, symbol, currency, oraclePrice);
  const suffix = ' cts/kWh';

  return usd + suffix;
};
