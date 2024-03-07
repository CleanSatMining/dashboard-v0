import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { MiningHistory } from 'src/types/mining/Mining';
import { Site } from 'src/types/mining/Site';
import { SITES, SiteID } from 'src/constants/csm';
import BigNumber from 'bignumber.js';
import {
  getTimestampAtMidnightUTC,
  getDateAtMidnightUTC,
  stringToTimestampUTC,
} from 'src/components/Display/components/Utils';

interface Period {
  period: number;
  startDate: number;
  endDate: number;
  equipementCost: number;
}

export function getNumberOfDaysSinceStart(site: Site) {
  if (
    site.mining.startingDate !== undefined &&
    site.mining.startingDate !== '-'
  ) {
    const today = new Date();
    const startDate = getDateAtMidnightUTC(new Date(site.mining.startingDate));
    const diffTime = new BigNumber(today.getTime() - startDate.getTime());
    const daysSinceStart = Math.ceil(
      diffTime.dividedBy(1000 * 3600 * 24).toNumber(),
    );
    return daysSinceStart ?? 0;
  }
  return 0;
}

// Définition de la fonction
export function getMiningDays(
  miningState: MiningHistory,
  siteId: string,
  period: number,
  startDate: number,
  endDate: number,
): MiningSummaryPerDay[] {
  // Initialisation d'un tableau vide qui sera retourné en cas de conditions non satisfaites
  const ret: MiningSummaryPerDay[] = [];
  const startTimestampUTC = getTimestampAtMidnightUTC(startDate);
  const endTimestampUTC = getTimestampAtMidnightUTC(endDate);

  // Vérification des conditions pour accéder aux jours d'extraction minière
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getPeriodFromStart(site, period);
    // Cas où startDate est 0, retourne les premiers jours de la période spécifiée
    if (startTimestampUTC === 0) {
      return miningState.byId[siteId].mining.days.slice(
        0,
        Math.min(realPeriod, miningState.byId[siteId].mining.days.length),
      );
    }
    const aa = miningState.byId[siteId].mining.days.filter((miningDay) => {
      return (
        stringToTimestampUTC(miningDay.date) >= startTimestampUTC &&
        stringToTimestampUTC(miningDay.date) <= endTimestampUTC
      );
    });
    // if (siteId === '3')
    //   console.log(
    //     'DAYS FILTERED',
    //     startTimestampUTC,
    //     endTimestampUTC,
    //     JSON.stringify(
    //       miningState.byId[siteId].mining.days.map((a) =>
    //         stringToTimestampUTC(a.date),
    //       ),
    //       null,
    //       4,
    //     ),
    //     JSON.stringify(aa, null, 4),
    //   );

    // Cas où startDate n'est pas 0, filtre les jours dans la plage spécifiée
    return aa;
  }

  // Retourne le tableau vide si les conditions ne sont pas satisfaites
  return ret;
} /**
 * getRealPeriod
 *
 * @param site
 * @param period
 * @returns
 */
export function getPeriodFromStart(site: Site, period: number) {
  const daysSinceStart = getNumberOfDaysSinceStart(site);
  const realPeriod = Math.min(period, daysSinceStart);
  return realPeriod;
}

export function daysInPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date using UTC
  dateCopy.setUTCMonth(dateCopy.getUTCMonth() - 1);

  // Return the number of days in the previous month using UTC
  return new Date(
    Date.UTC(dateCopy.getUTCFullYear(), dateCopy.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

export function getTimestampFirstDayOfPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date using UTC
  dateCopy.setUTCMonth(dateCopy.getUTCMonth() - 1);

  // Set the day of the copied date to the first day of the month using UTC
  dateCopy.setUTCDate(1);

  // Set the UTC hours, minutes, seconds, and milliseconds to 0
  dateCopy.setUTCHours(0, 0, 0, 0);

  // Return the timestamp of the first day of the previous month at 0:00 UTC
  return dateCopy.getTime();
}

export function getTimestampLastDayOfPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date using UTC
  dateCopy.setUTCMonth(dateCopy.getUTCMonth() - 1);

  // Set the day of the copied date to the last day of the month using UTC
  dateCopy.setUTCDate(daysInPreviousMonth(date));

  // Set the UTC hours, minutes, seconds, and milliseconds to 23:59:59:999
  dateCopy.setUTCHours(23, 59, 59, 999);

  // Return the timestamp of the last day of the previous month at 23:59
  return dateCopy.getTime();
}

export function calculateDaysBetweenDates(
  timestamp1: number,
  timestamp2: number,
): number {
  if (timestamp1 === 0 || timestamp2 === 0) return 0;

  // Calcul du nombre de millisecondes dans une journée
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  // Calcul du nombre de jours entre les deux dates
  const daysDifference = Math.abs(
    (timestamp2 - timestamp1) / millisecondsPerDay,
  );

  return Math.floor(daysDifference) + 1;
}

export function getYesterdayTimestamp(timestamp: number): number {
  // Create a copy of the input date to avoid modifying it directly
  const yesterday = new Date(timestamp);

  // Subtract one day from the current date
  yesterday.setDate(yesterday.getDate() - 1);

  // Set the UTC time to 23:59:59:999
  yesterday.setUTCHours(23, 59, 59, 999);

  // Return the timestamp for the modified date
  return yesterday.getTime();
}

function add5YearsToTimestamp(inputTimestamp: number): number {
  // Convertir le timestamp en objet Date
  const currentDate = new Date(inputTimestamp);

  // Ajouter 5 ans à la date actuelle en utilisant l'UTC
  currentDate.setUTCFullYear(currentDate.getUTCFullYear() + 5);

  // Renvoyer le nouveau timestamp
  return currentDate.getTime();
}

/**
 * getNumberOfMachines
 *
 * @param siteId
 * @param date
 * @returns
 */
export function getNumberOfMachines(site: Site, date: Date): number {
  //const site: Site = SITES[siteId as SiteID];

  let totalMachines = 0;

  for (const asics of site.mining.asics) {
    if (
      getDateAtMidnightUTC(new Date(asics.date)).getTime() <=
      getTimestampAtMidnightUTC(date.getTime())
    ) {
      totalMachines = totalMachines + asics.units;
    }
  }

  return totalMachines;
}

/**
 * getNumberOfMachines
 *
 * @param siteId
 * @param date
 * @returns
 */
export function getPower(site: Site, date: Date): number {
  //const site: Site = SITES[siteId as SiteID];

  let power = new BigNumber(0);

  for (const asics of site.mining.asics) {
    if (
      getDateAtMidnightUTC(new Date(asics.date)).getTime() <=
      getTimestampAtMidnightUTC(date.getTime())
    ) {
      power = power.plus(new BigNumber(asics.powerW).times(asics.units));
    }
  }

  return power.toNumber();
}

export function getHashrate(site: Site, date: Date): number {
  let hashrate = new BigNumber(0);

  for (const asics of site.mining.asics) {
    if (
      getDateAtMidnightUTC(new Date(asics.date)).getTime() <=
      getTimestampAtMidnightUTC(date.getTime())
    ) {
      hashrate = hashrate.plus(
        new BigNumber(asics.hashrateHs).times(asics.units),
      );
    }
  }

  return hashrate.toNumber();
}

export function getEquipementPeriods(
  site: Site,
  startDate: number,
  endDate: number,
): Period[] {
  const periods: Period[] = [];
  const startTimestampUTC = getTimestampAtMidnightUTC(startDate);
  const endTimestampUTC = getTimestampAtMidnightUTC(endDate);

  const timestamps = site.mining.intallationCosts.map((installation) =>
    getTimestampAtMidnightUTC(new Date(installation.date).getTime()),
  );

  const equipementTimestamps: { timestamp: number; cost: number }[] =
    timestamps.map((timestamp, i) => {
      return {
        timestamp: timestamp,
        cost: site.mining.intallationCosts[i].equipement,
      };
    });

  const equipementTimestamps5Years: { timestamp: number; cost: number }[] =
    timestamps.map((timestamp, i) => {
      return {
        timestamp: add5YearsToTimestamp(timestamp),
        cost: -site.mining.intallationCosts[i].equipement,
      };
    });

  const equipementPeriods = equipementTimestamps
    .concat(equipementTimestamps5Years)
    .filter((equipement) => equipement.timestamp <= endTimestampUTC)
    .sort((a, b) => a.timestamp - b.timestamp);

  let equipementCost = 0;

  for (let i = 0; i < equipementPeriods.length; i++) {
    equipementCost = equipementCost + equipementPeriods[i].cost;
    const endPeriod =
      i + 1 < equipementPeriods.length
        ? getYesterdayTimestamp(equipementPeriods[i + 1].timestamp)
        : endTimestampUTC;
    const startPeriod =
      equipementPeriods[i].timestamp > startTimestampUTC
        ? equipementPeriods[i].timestamp
        : startTimestampUTC;

    periods.push({
      period: calculateDaysBetweenDates(startPeriod, endPeriod),
      startDate: startPeriod,
      endDate: endPeriod,
      equipementCost: equipementCost,
    });
  }

  //periods.filter((period) => period.startDate >= startDate);

  return removeDuplicatesByStartDate(periods);
}

export function getEquipementCost(
  site: Site,
  startDate: number,
  endDate: number,
): BigNumber {
  const startTimestampUTC = getTimestampAtMidnightUTC(startDate);
  const endTimestampUTC = getTimestampAtMidnightUTC(endDate);
  const period = calculateDaysBetweenDates(startTimestampUTC, endTimestampUTC);
  const equipementPeriods = getEquipementPeriods(
    site,
    startTimestampUTC,
    endTimestampUTC,
  );
  let equipement = new BigNumber(0);
  for (const equipementPeriod of equipementPeriods) {
    equipement = equipement.plus(
      new BigNumber(equipementPeriod.equipementCost).times(
        equipementPeriod.period,
      ),
    );
  }
  return equipement.dividedBy(period);
}

function removeDuplicatesByStartDate(periods: Period[]): Period[] {
  // Trier la liste par "period" de manière décroissante
  const sortedPeriods = periods.sort((a, b) => b.period - a.period);

  const uniqueStartDates: Set<number> = new Set();
  const result: Period[] = [];

  for (const period of sortedPeriods) {
    if (!uniqueStartDates.has(period.startDate)) {
      // Si la startDate n'a pas encore été vue, ajoutez-la à la liste unique
      uniqueStartDates.add(period.startDate);
      result.push(period);
    }
  }

  return result;
}
