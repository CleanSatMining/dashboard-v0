import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { MiningHistory } from 'src/types/mining/Mining';

import { Site } from 'src/types/mining/Site';
import { SITES, SiteID } from '../../../constants/csm';
import { calculateDaysBetweenDates } from 'src/utils/date';

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

  // Vérification des conditions pour accéder aux jours d'extraction minière
  if (
    miningState &&
    miningState.byId[siteId] &&
    miningState.byId[siteId].mining &&
    miningState.byId[siteId].mining.days
  ) {
    const site: Site = SITES[siteId as SiteID];
    const { realStartTimestamp } = getPeriodFromStart(site, startDate, endDate);
    // Cas où startDate est 0, retourne les premiers jours de la période spécifiée
    if (startDate === 0) {
      return miningState.byId[siteId].mining.days.slice(
        0,
        Math.min(period, miningState.byId[siteId].mining.days.length),
      );
    }
    const aa = miningState.byId[siteId].mining.days.filter((miningDay) => {
      return (
        new Date(miningDay.date).getTime() >= realStartTimestamp &&
        new Date(miningDay.date).getTime() <= endDate
      );
    });
    // if (siteId === '2')
    //   console.log(
    //     'DAYS FILTERED',
    //     startDate,
    //     endDate,
    //     miningState.byId[siteId].mining.days.map((a) =>
    //       new Date(a.date).getTime(),
    //     ),
    //     JSON.stringify(aa),
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
export function getPeriodFromStart(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): { realPeriod: number; realStartTimestamp: number } {
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const realStartTimestamp = Math.max(startTimestamp, siteStartTimestamp);
  const realPeriod = calculateDaysBetweenDates(
    realStartTimestamp,
    endTimestamp,
  );
  return {
    realPeriod,
    realStartTimestamp,
  };
}
