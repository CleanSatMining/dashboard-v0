export function calculateDaysBetweenDates(
  timestamp1: number,
  timestamp2: number,
): number {
  if (timestamp1 === 0 || timestamp2 === 0) return 0;

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(timestamp2 - timestamp1);

  // Calculate the number of days
  const daysDifference = Math.round(timeDifference / millisecondsPerDay);

  return daysDifference;
}
/**
 * getTimestampUTC
 * @param date
 * @returns
 */
export function getTimestampUTC(date: Date): number {
  const timezoneOffset = date.getTimezoneOffset();

  return date.getTime() + timezoneOffset * 60 * 1000;
}

export function getMidnightTimestamp(inputTimestamp: number): number {
  const date = new Date(Number(inputTimestamp));

  date.setHours(0, 0, 0, 0); // Définir l'heure à 00:00:00.000

  // Retourner le nouveau timestamp à minuit
  return date.getTime();
}

export function getLastMinuteTimestamp(inputTimestamp: number): number {
  const date = new Date(Number(inputTimestamp));
  date.setHours(23, 59, 59, 999); // Définir l'heure à 23:59:59.999

  // Retourner le nouveau timestamp à 23h59
  return date.getTime();
}

export function getFirstDayOfPreviousMonth(): number {
  const date = new Date();
  date.setUTCDate(1); // Définir le jour du mois à 1
  date.setUTCHours(0, 0, 0, 0); // Réinitialiser l'heure à 00:00:00.000

  // Décrémenter le mois pour obtenir le mois précédent
  date.setUTCMonth(date.getUTCMonth() - 1);

  // Retourner le nouveau timestamp pour le premier jour du mois précédent
  return date.getTime();
}

export function getLastDayOfPreviousMonth(): number {
  const date = new Date();
  date.setUTCDate(0); // Définir le jour du mois à 0 pour revenir au dernier jour du mois précédent
  date.setUTCHours(23, 59, 59, 999); // Définir l'heure à 23:59:59.999

  // Retourner le nouveau timestamp pour le dernier jour du mois précédent
  return date.getTime();
}
