import BigNumber from 'bignumber.js';
import { getMiningDays } from './period';
import { MiningHistory } from 'src/types/mining/Mining';

import { SITES, SiteID } from '../../../constants/csm';

import { Site } from '../../../types/mining/Site';

import { getPeriodFromStart, getHashrate } from './period';
import { getTimestampAtMidnightUTC } from 'src/components/Display/components/Utils';
export const getUptimeBySite = (
  miningState: MiningHistory,
  siteId: string,
  period: number,
  startDate: number,
  endDate: number,
): {
  machines: number;
  days: number;
  percent: number;
  hashrate: number;
  hashratePercent: number;
  hashrates: number[];
  hashratePercents: number[];
} => {
  if (
    miningState &&
    miningState.byId &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getPeriodFromStart(site, period);
    const startTimestampUTC = getTimestampAtMidnightUTC(startDate);
    const endTimestampUTC = getTimestampAtMidnightUTC(endDate);
    const days = getMiningDays(
      miningState,
      siteId,
      period,
      startTimestampUTC,
      endTimestampUTC,
    );
    const hashrates: BigNumber[] = site.mining.asics.map(
      () => new BigNumber(0),
    );
    const hashratePercents: BigNumber[] = site.mining.asics.map(
      () => new BigNumber(0),
    );
    const periods: number[] = site.mining.asics.map(() => 0);

    let uptimeHashrate: BigNumber = new BigNumber(0);
    let uptimeHashratePercent: BigNumber = new BigNumber(0);
    let uptimePercentage: BigNumber = new BigNumber(0);
    let uptimeTotalMachines: BigNumber = new BigNumber(0);

    for (const day of days) {
      uptimeHashrate = uptimeHashrate.plus(day.hashrate);
      uptimeHashratePercent = uptimeHashratePercent.plus(
        new BigNumber(day.hashrate)
          .dividedBy(getHashrate(site, new Date(day.date)))
          .times(100),
      );
      uptimePercentage = uptimePercentage.plus(day.uptimePercentage);
      uptimeTotalMachines = uptimeTotalMachines.plus(day.uptimeTotalMachines);

      const dayTimestamp = getTimestampAtMidnightUTC(
        new Date(day.date).getTime(),
      );
      for (let i = 0; i < site.mining.asics.length; i++) {
        const asicTimestamp = new Date(site.mining.asics[i].date).getTime();
        const nextAsicTimestamp =
          i + 1 < site.mining.asics.length
            ? getTimestampAtMidnightUTC(
                new Date(site.mining.asics[i + 1].date).getTime(),
              )
            : 4102444800000;
        if (dayTimestamp >= asicTimestamp && dayTimestamp < nextAsicTimestamp) {
          periods[i]++;
          hashrates[i] = hashrates[i].plus(day.hashrate);
          hashratePercents[i] = hashratePercents[i].plus(
            new BigNumber(day.hashrate)
              .dividedBy(getHashrate(site, new Date(day.date)))
              .times(100),
          );

          console.log('hashrates[i]', hashrates[i].toNumber());
          console.log(
            'Day hashrate',
            day.date,
            getHashrate(site, new Date(day.date)),
          );
          console.log('hashratePercents[i]', hashratePercents[i]);
        }
      }
    }

    if (siteId === '1') {
      console.log(
        'hashrates days',
        realPeriod,
        period,
        days.length,
        JSON.stringify(days, null, 4),
        'hashrate ' + uptimeHashrate.dividedBy(realPeriod).toNumber(),
        'hashratePercent ' +
          uptimeHashratePercent.dividedBy(realPeriod).toNumber(),
        'machines ' + uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
        'percent ' + uptimePercentage.dividedBy(realPeriod).toNumber(),
        JSON.stringify(hashrates, null, 4),
        JSON.stringify(hashratePercents, null, 4),
      );
    }

    return {
      days: days.length,
      hashrate: uptimeHashrate.dividedBy(realPeriod).toNumber(),
      hashratePercent: uptimeHashratePercent.dividedBy(realPeriod).toNumber(),
      machines: uptimeTotalMachines.dividedBy(realPeriod).toNumber(),
      percent: uptimePercentage.dividedBy(realPeriod).toNumber(),
      hashrates: hashrates.map((hashrate, i) =>
        hashrate.dividedBy(periods[i]).toNumber(),
      ),
      hashratePercents: hashratePercents.map((hashrate, i) =>
        hashrate.dividedBy(periods[i]).toNumber(),
      ),
    };
  }
  return {
    days: 0,
    hashrate: 0,
    hashratePercent: 0,
    machines: 0,
    percent: 0,
    hashrates: [],
    hashratePercents: [],
  };
};
