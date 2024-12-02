import { MiningSummaryPerDay } from 'src/types/mining/Mining';
import { MiningHistory } from 'src/types/mining/Mining';

import { Site } from 'src/types/mining/Site';
import { SITES } from '../../../constants/csm';
import { SiteID } from 'src/types/mining/Site';
import {
  calculateDaysBetweenDates,
  addYearsToTimestamp,
  getMidnightTimestamp,
  formatDateToISOString,
  getTimestamp183DaysAgo,
} from 'src/utils/date';
import BigNumber from 'bignumber.js';

import { Asics } from 'src/types/mining/Site';
import { HashratePeriod } from 'src/types/mining/Mining';

// Définition de la fonction
export function getMiningDays(
  miningState: MiningHistory,
  site: Site,
  period: number,
  startDate: number,
  endDate: number,
  subaccountId?: number,
): MiningSummaryPerDay[] {
  // Initialisation d'un tableau vide qui sera retourné en cas de conditions non satisfaites
  const ret: MiningSummaryPerDay[] = [];

  // Vérification des conditions pour accéder aux jours d'extraction minière
  if (
    miningState &&
    miningState.byId[site.id] &&
    miningState.byId[site.id].mining &&
    miningState.byId[site.id].mining.days
  ) {
    const { realStartTimestamp } = getPeriodFromStart(site, startDate, endDate);
    // Cas où startDate est 0, retourne les premiers jours de la période spécifiée
    if (startDate === 0) {
      return miningState.byId[site.id].mining.days.slice(
        0,
        Math.min(period, miningState.byId[site.id].mining.days.length),
      );
    }
    const days = miningState.byId[site.id].mining.days.filter((miningDay) => {
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

    const subaccountValue =
      subaccountId ??
      (site.api.length === 1 ? site.api[0].subaccount?.id : undefined);

    // if (site.id === '5') {
    //   console.log('DAYS FILTERED subaccount', subaccountValue);
    // }

    // Cas où startDate n'est pas 0, filtre les jours dans la plage spécifiée
    return days.filter(
      (d) =>
        d.subaccountId === subaccountValue || subaccountValue === undefined,
    );
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
): { realPeriod: number; realStartTimestamp: number; dataMissing: boolean } {
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const realStartTimestamp = Math.max(startTimestamp, siteStartTimestamp);
  const realPeriod = calculateDaysBetweenDates(
    realStartTimestamp,
    endTimestamp,
  );

  if (isWarningSiteDataMissing(site, startTimestamp)) {
    const timestamp183DaysAgo = getTimestamp183DaysAgo();
    if (startTimestamp < timestamp183DaysAgo) {
      const days =
        timestamp183DaysAgo > endTimestamp
          ? 0
          : calculateDaysBetweenDates(timestamp183DaysAgo, endTimestamp);
      return {
        realPeriod: days,
        realStartTimestamp: timestamp183DaysAgo,
        dataMissing: true,
      };
    }
  }

  return {
    realPeriod: realPeriod,
    realStartTimestamp: realStartTimestamp,
    dataMissing: false,
  };
}

export function isWarningSiteDataMissing(
  site: Site,
  startTimestamp: number,
): boolean {
  // if (
  //   site.name === 'CSM Alpha' ||
  //   site.name === 'CSM Beta' ||
  //   site.name === 'CSM Omega'
  // ) {
  //   const timestamp183DaysAgo = getTimestamp183DaysAgo();
  //   if (startTimestamp < timestamp183DaysAgo) {
  //     return true;
  //   }
  // }

  return false;
}

/**
 * getNumberOfMachines
 *
 * @param siteId
 * @param date
 * @returns
 */
export function getNumberOfMachines(
  site: Site,
  date: Date,
  subaccountId?: number,
): number {
  //const site: Site = SITES[siteId as SiteID];
  const asicsSubaccountConfig = site.api.find(
    (api) => api.subaccount?.id === subaccountId,
  );

  let totalMachines = 0;

  for (const asics of getAsicsInOut(site.mining.asics)) {
    if (
      getMidnightTimestamp(new Date(asics.date).getTime()) <=
      getMidnightTimestamp(date.getTime())
    ) {
      if (subaccountId === undefined) {
        totalMachines = totalMachines + asics.units;
      } else if (
        asicsSubaccountConfig !== undefined &&
        asicsSubaccountConfig.subaccount !== undefined &&
        asicsSubaccountConfig.subaccount.asics.find(
          (a) => a.asicsId === asics.id,
        ) !== undefined
      ) {
        const asicSubaccountConfig =
          asicsSubaccountConfig.subaccount.asics.find(
            (a) => a.asicsId === asics.id,
          );
        const machines = asicSubaccountConfig?.machines ?? 0;

        totalMachines = totalMachines + machines;
      }
    }
  }

  return totalMachines;
}

/**
 * getPower
 *
 * @param siteId
 * @param date
 * @returns
 */
export function getPower(
  site: Site,
  date: Date,
  subaccountId?: number,
): BigNumber {
  //const site: Site = SITES[siteId as SiteID];

  const asicsSubaccountConfig = site.api.find(
    (api) => api.subaccount?.id === subaccountId,
  );

  let power = new BigNumber(0);

  for (const asics of getAsicsInOut(site.mining.asics)) {
    if (
      getMidnightTimestamp(new Date(asics.date).getTime()) <=
      getMidnightTimestamp(date.getTime())
    ) {
      if (subaccountId === undefined) {
        power = power.plus(
          new BigNumber(asics.powerW).times(Math.abs(asics.units)),
        );
      } else if (
        asicsSubaccountConfig !== undefined &&
        asicsSubaccountConfig.subaccount !== undefined &&
        asicsSubaccountConfig.subaccount.asics.find(
          (a) => a.asicsId === asics.id,
        ) !== undefined
      ) {
        const asicSubaccountConfig =
          asicsSubaccountConfig.subaccount.asics.find(
            (a) => a.asicsId === asics.id,
          );
        const machines = asicSubaccountConfig?.machines ?? 0;
        power = power.plus(
          new BigNumber(asics.powerW).times(Math.abs(machines)),
        );
      }
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
export function getHashrateMax(site: Site, date: Date): BigNumber {
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
  if (startTimestamp >= endTimestamp) {
    return new BigNumber(0);
  }

  let hashrate = new BigNumber(0);
  const siteStartTimestamp = new Date(site.mining.startingDate).getTime();
  const startPeriod = Math.max(startTimestamp, siteStartTimestamp);
  const endPeriod = endTimestamp;
  const period = calculateDaysBetweenDates(startPeriod, endPeriod);

  const shallManageSubaccount = site.api.length === 1 && site.api[0].subaccount;
  const subAsics = shallManageSubaccount
    ? site.api[0].subaccount?.asics
    : undefined;

  for (const asics of site.mining.asics) {
    const subAccountAsics = shallManageSubaccount
      ? (subAsics?.find((a) => a.asicsId === asics.id)?.machines ?? 0)
      : undefined;

    const installationDate = getMidnightTimestamp(
      new Date(asics.date).getTime(),
    );
    const endLifeMachines = addYearsToTimestamp(installationDate, 5);
    const equipementHashrate = new BigNumber(asics.hashrateHs).times(
      subAccountAsics ?? asics.units,
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
  if (startTimestamp >= endTimestamp) {
    return [];
  }

  const asicsIn = getAsicsEquipements(site, startTimestamp, endTimestamp);
  const asicsInOut = getAsicsInOut(asicsIn, endTimestamp);
  const equipmentInOutDuringPeriod = asicsInOut.filter(
    (a) => new Date(a.date).getTime() >= startTimestamp,
  );

  const equipmentEvents: Date[] = [new Date(startTimestamp)];
  const days = equipmentInOutDuringPeriod.map((equipement) => {
    return new Date(equipement.date);
  });

  equipmentEvents.push(...days);

  console.log('equipmentEvents', JSON.stringify(equipmentEvents, null, 4));

  const allHashratePeriod = equipmentEvents.map((date, index) => {
    const eventDate = date;
    const installedAsics = getAsicsInstalledAtATime(
      asicsInOut,
      eventDate.getTime(),
    );
    const hashrateMax = getHashrateMax(site, eventDate);

    if (site.id === '1') {
      console.log(
        'nextUpdateDate',
        index,
        eventDate.toISOString(),
        JSON.stringify(installedAsics, null, 4),
      );
    }

    const equipements: {
      date: Date;
      model: string;
      powerW: number;
      hashrateHs: number;
      units: number;
    }[] = installedAsics.map((e) => {
      return {
        date: new Date(e.date),
        model: e.model,
        powerW: e.powerW,
        hashrateHs: e.hashrateHs,
        units: e.units,
      };
    });

    const h: HashratePeriod = {
      start: new Date(Math.max(eventDate.getTime(), startTimestamp)),
      end: new Date(endTimestamp),
      hashrateHs: 0,
      hashrateMax: hashrateMax.toNumber(),
      equipmentInstalled: equipements,
      equipmentUninstalled: undefined,
    };
    return h;
  });

  const filteredHashratePeriod = allHashratePeriod.filter(
    (h) => h.start.getTime() <= h.end.getTime(),
  );

  if (site.id === '1') {
    console.log('startTimestamp', new Date(startTimestamp).toISOString());
    console.log('endTimestamp', new Date(endTimestamp).toISOString());
    console.log('asicsInOut', JSON.stringify(asicsInOut, null, 4));
    console.log('Hashrate period', JSON.stringify(allHashratePeriod, null, 4));
    console.log(
      'Filtered Hashrate period',
      JSON.stringify(filteredHashratePeriod, null, 4),
    );
  }

  return allHashratePeriod;
}

export function getAsicsInstalledAtATime(
  asics: Asics[],
  timestamp: number,
): Asics[] {
  // Filter asics that are installed at the timestamp
  // and uninstalled after 5 years
  return asics.filter(
    (e) =>
      new Date(e.date).getTime() <= timestamp &&
      new Date(addYearsToTimestamp(new Date(e.date).getTime(), 5)).getTime() >
        timestamp,
  );
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
      id: asics.id,
      model: asics.model,
      powerW: -asics.powerW,
      date: outDate,
      units: units,
      hashrateHs: hashrateHs,
      intallationCosts: {
        equipement: -asics.intallationCosts.equipement,
        total: -asics.intallationCosts.total,
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
