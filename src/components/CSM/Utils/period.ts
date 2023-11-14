import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { MiningState } from 'src/types/mining/Mining';
import { getNumberOfDaysSinceStart } from './yield';
import { Site } from 'src/types/mining/Site';
import { SITES, SiteID } from '../../../constants/csm';

// Définition de la fonction
export function getMiningDays(
  miningState: MiningState,
  siteId: string,
  period: number,
  startDate: number,
  endDate: number,
): MiningSummaryPerDay[] {
  // Initialisation d'un tableau vide qui sera retourné en cas de conditions non satisfaites
  const ret: MiningSummaryPerDay[] = [];

  // Vérification des conditions pour accéder aux jours d'extraction minière
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const realPeriod = getRealPeriod(site, period);
    // Cas où startDate est 0, retourne les premiers jours de la période spécifiée
    if (startDate === 0) {
      return miningState.byId[siteId].mining.days.slice(
        0,
        Math.min(realPeriod, miningState.byId[siteId].mining.days.length),
      );
    }
    const aa = miningState.byId[siteId].mining.days.filter((miningDay) => {
      return (
        new Date(miningDay.date).getTime() >= startDate &&
        new Date(miningDay.date).getTime() <= endDate
      );
    });
    if (siteId === '2')
      console.log(
        'DAYS FILTERED',
        startDate,
        endDate,
        miningState.byId[siteId].mining.days.map((a) =>
          new Date(a.date).getTime(),
        ),
        JSON.stringify(aa),
      );

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
export function getRealPeriod(site: Site, period: number) {
  const daysSinceStart = getNumberOfDaysSinceStart(site);
  const realPeriod = Math.min(period, daysSinceStart);
  return realPeriod;
}

export function daysInPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date
  dateCopy.setMonth(dateCopy.getMonth() - 1);

  // Return the number of days in the previous month
  return new Date(dateCopy.getFullYear(), dateCopy.getMonth() + 1, 0).getDate();
}

export function getTimestampFirstDayOfPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date
  dateCopy.setMonth(dateCopy.getMonth() - 1);

  // Set the day of the copied date to the first day of the month
  dateCopy.setDate(1);

  // Set the hours, minutes, seconds, and milliseconds to 0
  dateCopy.setHours(0, 0, 0, 0);

  //console.log(`Le premier jour du mois : ${dateCopy}`);

  // Return the timestamp of the first day of the previous month at 0:00
  return dateCopy.getTime();
}

export function getTimestampLastDayOfPreviousMonth(date: Date): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date
  dateCopy.setMonth(dateCopy.getMonth() - 1);

  // Set the day of the copied date to the last day of the month
  dateCopy.setDate(daysInPreviousMonth(date));

  // Set the hours, minutes, seconds, and milliseconds to 23:59:59:999
  dateCopy.setHours(23, 59, 59, 999);
  //console.log(`Le dernier jour du mois : ${dateCopy}`);

  // Return the timestamp of the last day of the previous month at 23:59
  return dateCopy.getTime();
}
