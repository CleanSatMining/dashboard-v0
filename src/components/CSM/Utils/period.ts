import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { MiningHistory } from 'src/types/mining/Mining';

import { Site } from 'src/types/mining/Site';
import { SITES, SiteID } from '../../../constants/csm';
import {
  calculateDaysBetweenDates,
  addYearsToTimestamp,
  getMidnightTimestamp,
  formatDateToISOString,
} from 'src/utils/date';
import BigNumber from 'bignumber.js';

import { Asics } from 'src/types/mining/Site';
import { HashratePeriod } from 'src/types/mining/Mining';

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

  for (const asics of getAsicsInOut(site.mining.asics)) {
    if (
      getMidnightTimestamp(new Date(asics.date).getTime()) <=
      getMidnightTimestamp(date.getTime())
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
export function getPower(site: Site, date: Date): BigNumber {
  //const site: Site = SITES[siteId as SiteID];

  let power = new BigNumber(0);

  for (const asics of getAsicsInOut(site.mining.asics)) {
    if (
      getMidnightTimestamp(new Date(asics.date).getTime()) <=
      getMidnightTimestamp(date.getTime())
    ) {
      power = power.plus(
        new BigNumber(asics.powerW).times(Math.abs(asics.units)),
      );
    }
  }

  return power;
}

export function getEquipmentCost(site: Site, date: Date): BigNumber {
  //const site: Site = SITES[siteId as SiteID];

  let cost = new BigNumber(0);

  for (const asics of getAsicsInOut(site.mining.asics)) {
    if (
      getMidnightTimestamp(new Date(asics.date).getTime()) <=
      getMidnightTimestamp(date.getTime())
    ) {
      cost = cost.plus(
        new BigNumber(Math.abs(asics.intallationCosts.equipement)),
      );
    }
  }

  return cost;
}

/**
 *
 * @param site
 * @param date
 * @returns
 */
export function getHashrate(site: Site, date: Date): BigNumber {
  let hashrate = new BigNumber(0);

  for (const asics of getAsicsInOut(site.mining.asics)) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );

    if (installationDate <= getMidnightTimestamp(date.getTime())) {
      hashrate = hashrate.plus(
        new BigNumber(asics.hashrateHs).times(Math.abs(asics.units)),
      );
    }
  }

  return hashrate;
}

export function getAverageHashrate(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): BigNumber {
  let hashrate = new BigNumber(0);
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const startPeriod = Math.max(startTimestamp, siteStartTimestamp);
  const endPeriod = endTimestamp;
  const period = calculateDaysBetweenDates(startPeriod, endPeriod);

  for (const asics of site.mining.asics) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);
    const equipementHashrate = new BigNumber(asics.hashrateHs).times(
      asics.units,
    );

    if (
      installationDate <= startPeriod &&
      startPeriod <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // installation----startPeriod----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endPeriod,
      );

      hashrate = hashrate.plus(equipementHashrate.times(equipmentUptimePeriod));
    } else if (
      installationDate <= startPeriod &&
      startPeriod <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // installation----startPeriod----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endLifeMachines,
      );

      hashrate = hashrate.plus(equipementHashrate.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // startPeriod----installation----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endPeriod,
      );

      hashrate = hashrate.plus(equipementHashrate.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // startPeriod----installation----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endLifeMachines,
      );

      hashrate = hashrate.plus(equipementHashrate.times(equipmentUptimePeriod));
    } else {
      // startPeriod----endPeriod----installation----endLifeMachines
      // installation----endLifeMachines----startPeriod----endPeriod
    }
  }

  return period > 0 ? hashrate.dividedBy(period) : new BigNumber(0);
}

export function getAverageMachines(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): number {
  let machines = new BigNumber(0);
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const startPeriod = Math.max(startTimestamp, siteStartTimestamp);
  const endPeriod = endTimestamp;
  const period = calculateDaysBetweenDates(startPeriod, endPeriod);

  for (const asics of site.mining.asics) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);
    const equipementMachines = new BigNumber(asics.units);

    if (
      installationDate <= startPeriod &&
      startPeriod <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // installation----startPeriod----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endPeriod,
      );

      machines = machines.plus(equipementMachines.times(equipmentUptimePeriod));
    } else if (
      installationDate <= startPeriod &&
      startPeriod <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // installation----startPeriod----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endLifeMachines,
      );

      machines = machines.plus(equipementMachines.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // startPeriod----installation----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endPeriod,
      );

      machines = machines.plus(equipementMachines.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // startPeriod----installation----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endLifeMachines,
      );

      machines = machines.plus(equipementMachines.times(equipmentUptimePeriod));
    } else {
      // startPeriod----endPeriod----installation----endLifeMachines
      // installation----endLifeMachines----startPeriod----endPeriod
    }
  }

  return period > 0 ? machines.dividedBy(period).toNumber() : 0;
}

export function getAverageEquipmentCost(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): number {
  let cost = new BigNumber(0);
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const startPeriod = Math.max(startTimestamp, siteStartTimestamp);
  const endPeriod = endTimestamp;
  const period = calculateDaysBetweenDates(startPeriod, endPeriod);

  for (const asics of site.mining.asics) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);
    const equipementCost = new BigNumber(asics.intallationCosts.equipement);

    if (
      installationDate <= startPeriod &&
      startPeriod <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // installation----startPeriod----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endPeriod,
      );

      cost = cost.plus(equipementCost.times(equipmentUptimePeriod));
    } else if (
      installationDate <= startPeriod &&
      startPeriod <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // installation----startPeriod----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        startPeriod,
        endLifeMachines,
      );

      cost = cost.plus(equipementCost.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // startPeriod----installation----endPeriod----endLifeMachines
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endPeriod,
      );

      cost = cost.plus(equipementCost.times(equipmentUptimePeriod));
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // startPeriod----installation----endLifeMachines----endPeriod
      const equipmentUptimePeriod = calculateDaysBetweenDates(
        installationDate,
        endLifeMachines,
      );

      cost = cost.plus(equipementCost.times(equipmentUptimePeriod));
    } else {
      // startPeriod----endPeriod----installation----endLifeMachines
      // installation----endLifeMachines----startPeriod----endPeriod
    }
  }

  return period > 0 ? cost.dividedBy(period).toNumber() : 0;
}

export function getEquipementDepreciation(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): BigNumber {
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const startPeriod = Math.max(startTimestamp, siteStartTimestamp);
  const endPeriod = endTimestamp;
  const depreciationRatePerDay = new BigNumber(0.2).dividedBy(365);
  let equipementDepreciation = new BigNumber(0);
  for (const asics of site.mining.asics) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);
    const equipementCost = new BigNumber(asics.intallationCosts.equipement);

    if (
      installationDate <= startPeriod &&
      startPeriod <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // installation----startPeriod----endPeriod----endLifeMachines
      const depreciationPeriod = calculateDaysBetweenDates(
        startPeriod,
        endPeriod,
      );
      equipementDepreciation = equipementDepreciation.plus(
        depreciationRatePerDay.times(depreciationPeriod).times(equipementCost),
      );
    } else if (
      installationDate <= startPeriod &&
      startPeriod <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // installation----startPeriod----endLifeMachines----endPeriod
      const depreciationPeriod = calculateDaysBetweenDates(
        startPeriod,
        endLifeMachines,
      );
      equipementDepreciation = equipementDepreciation.plus(
        depreciationRatePerDay.times(depreciationPeriod).times(equipementCost),
      );
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // startPeriod----installation----endPeriod----endLifeMachines
      const depreciationPeriod = calculateDaysBetweenDates(
        installationDate,
        endPeriod,
      );
      equipementDepreciation = equipementDepreciation.plus(
        depreciationRatePerDay.times(depreciationPeriod).times(equipementCost),
      );
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // startPeriod----installation----endLifeMachines----endPeriod
      const depreciationPeriod = calculateDaysBetweenDates(
        installationDate,
        endLifeMachines,
      );
      equipementDepreciation = equipementDepreciation.plus(
        depreciationRatePerDay.times(depreciationPeriod).times(equipementCost),
      );
    } else {
      // startPeriod----endPeriod----installation----endLifeMachines
      // installation----endLifeMachines----startPeriod----endPeriod
    }
  }
  return equipementDepreciation;
}

export function getProgressSteps(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): HashratePeriod[] {
  const asicsIn = getAsicsEquipements(site, startTimestamp, endTimestamp);
  const asicsInOut = getAsicsInOut(asicsIn, endTimestamp);

  return asicsInOut
    .map((equipement, index) => {
      const installationDate = new Date(equipement.date);
      const nextUpdateDate =
        index < asicsInOut.length - 1
          ? new Date(new Date(asicsInOut[index + 1].date).getTime() - 1) //yesterday at 23:59:59
          : new Date(endTimestamp);

      const hashrate = getHashrate(site, installationDate);
      const h: HashratePeriod = {
        start: new Date(Math.max(installationDate.getTime(), startTimestamp)),
        end: nextUpdateDate,
        hashrateHs: 0,
        hashrateMax: hashrate.toNumber(),
        equipmentInstalled:
          equipement.units > 0
            ? {
                date: installationDate,
                model: equipement.model,
                powerW: equipement.powerW,
                hashrateHs: equipement.hashrateHs,
                units: equipement.units,
              }
            : undefined,
        equipmentUninstalled:
          equipement.units < 0
            ? {
                date: installationDate,
                model: equipement.model,
                powerW: equipement.powerW,
                hashrateHs: equipement.hashrateHs,
                units: equipement.units,
              }
            : undefined,
      };
      return h;
    })
    .filter((h) => h.start.getTime() < h.end.getTime());
}

export function getAsicsInOut(
  asicsEquipement: Asics[],
  timestampMax?: number,
): Asics[] {
  const asicsOut: Asics[] = asicsEquipement.map((asics) => {
    const outDate = formatDateToISOString(
      new Date(addYearsToTimestamp(new Date(asics.date).getTime(), 5)),
    );
    const units = -asics.units;
    const hashrateHs = -asics.hashrateHs;
    const equipmentOut: Asics = {
      model: asics.model,
      powerW: -asics.powerW,
      date: outDate,
      units: units,
      hashrateHs: hashrateHs,
      intallationCosts: {
        equipement: -asics.intallationCosts.equipement,
      },
    };
    return equipmentOut;
  });

  return asicsEquipement.concat(
    timestampMax
      ? asicsOut.filter((e) => new Date(e.date).getTime() < timestampMax)
      : asicsOut,
  );
}

export function getAsicsEquipements(
  site: Site,
  startTimestamp: number,
  endTimestamp: number,
): Asics[] {
  const asicsEquipements: Asics[] = [];
  const startPeriod = startTimestamp;
  const endPeriod = endTimestamp;

  for (const asics of site.mining.asics) {
    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);

    if (
      installationDate <= startPeriod &&
      startPeriod <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // installation----startPeriod----endPeriod----endLifeMachines
      asicsEquipements.push(asics);
    } else if (
      installationDate <= startPeriod &&
      startPeriod <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // installation----startPeriod----endLifeMachines----endPeriod
      asicsEquipements.push(asics);
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endPeriod &&
      endPeriod <= endLifeMachines
    ) {
      // startPeriod----installation----endPeriod----endLifeMachines
      asicsEquipements.push(asics);
    } else if (
      startPeriod <= installationDate &&
      installationDate <= endLifeMachines &&
      endLifeMachines <= endPeriod
    ) {
      // startPeriod----installation----endLifeMachines----endPeriod
      asicsEquipements.push(asics);
    } else {
      // startPeriod----endPeriod----installation----endLifeMachines
      // installation----endLifeMachines----startPeriod----endPeriod
    }
  }
  return asicsEquipements;
}
