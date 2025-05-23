import BigNumber from 'bignumber.js';

/**
 * getTimestampUTC
 * @param date
 * @returns
 */
export function getTimestampUTC(date: Date): number {
  const timezoneOffset = date.getTimezoneOffset();

  return date.getTime() - timezoneOffset * 60 * 1000;
}

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

export function getMidnightTimestamp(inputTimestamp: number): number {
  const date = new Date(Number(inputTimestamp));

  date.setUTCHours(0, 0, 0, 0); // Définir l'heure à 00:00:00.000

  // Retourner le nouveau timestamp à minuit
  return date.getTime();
}

export function getMidnight(inputDate: string): Date {
  const date = new Date(inputDate);
  date.setUTCHours(0, 0, 0, 0); // Définir l'heure à 00:00:00.000

  // Retourner le nouveau timestamp à minuit
  return date;
}

export function getLastMinuteTimestamp(inputTimestamp: number): number {
  const date = new Date(Number(inputTimestamp));
  date.setUTCHours(23, 59, 59, 999); // Définir l'heure à 23:59:59.999

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

/**
 * getTimestampNDaysAgo
 * @param N
 * @returns
 */
export function getTimestampNDaysAgo(N: number): number {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - N);

  // Réinitialiser l'heure à 00:00:00.000
  targetDate.setUTCHours(0, 0, 0, 0);

  // Retourner le timestamp
  return targetDate.getTime();
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
export function getTimestampFirstDayOfCurrentMonth(): number {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

  // Return the timestamp
  return getTimestampUTC(firstDayOfCurrentMonth);
}

export function getTimestampFirstDayOfNMonthsAgo(N: number): number {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() - N, 1);

  // Set time to midnight
  targetDate.setHours(0, 0, 0, 0);

  // Return the timestamp
  return getTimestampUTC(targetDate);
}

export function getTimestampLastDayOfNMonthAgo(N: number): number {
  const lastDayOfMonth = new Date();
  // Decrement the month of the copied date
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() - N);

  // Set the day of the copied date to the last day of the month
  lastDayOfMonth.setDate(daysInNMonthAgo(new Date().getTime(), N));
  //console.log('daysInNMonthAgo', daysInNMonthAgo(new Date().getTime(), N));
  // Set the hours, minutes, seconds, and milliseconds to 23:59:59:999
  lastDayOfMonth.setHours(23, 59, 59, 999);
  //console.log('daysInNMonthAgo', formatTimestamp(lastDayOfMonth.getTime()));
  //lastDayOfMonth.setHours(lastDayOfMonth.getHours() - 24);
  //console.log('daysInNMonthAgo', formatTimestamp(lastDayOfMonth.getTime()));
  // Return the timestamp of the last day of the previous month at 23:59
  return getTimestampUTC(lastDayOfMonth);
}

export function daysInNMonthAgo(date: number, N: number): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date
  dateCopy.setMonth(dateCopy.getMonth() - N);

  // Return the number of days in the previous month
  return new Date(dateCopy.getFullYear(), dateCopy.getMonth() + 1, 0).getDate();
}

export function getTimestampStartOfNDaysAgo(N: number): number {
  /* const today = new Date();
  const targetDate = new Date(today);
  targetDate.setUTCDate(today.getUTCDate() - N);

  // Set time to midnight
  targetDate.setUTCHours(0, 0, 0, 0);

  // Return the timestamp
  return getTimestampUTC(targetDate); */
  const today = new Date(); // Get the current date
  today.setUTCHours(0, 0, 0, 0); // Set time to 00:00:00.000 UTC
  today.setDate(today.getDate() - N); // Subtract N days

  return today.getTime(); // Return the timestamp in milliseconds
}

export function getDateYesterday(): Date {
  const yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

export function getYesterdayMidnightUTC(
  hours: number,
  min: number,
  sec: number,
  ms: number,
): number {
  // Créez une nouvelle date correspondant à la date et l'heure actuelles
  const now = new Date();

  // Ajustez cette date pour obtenir la veille
  const yesterday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1),
  );

  // Mettez les heures, minutes, secondes et millisecondes à zéro pour obtenir minuit
  yesterday.setUTCHours(hours, min, sec, ms);

  // Retournez le timestamp en millisecondes depuis l'époque Unix
  return yesterday.getTime();
}

export function getTimestampEndOfTheDay(timestamp: number): number {
  const targetDate = new Date(timestamp);

  // Set time to midnight
  targetDate.setHours(23, 59, 59, 999);

  // Return the timestamp
  return getTimestampUTC(targetDate);
}

export function calculateDaysBetweenDateAndToday(timestamp: number): number {
  const today = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = today.getTime() - timestamp;

  // Calculate the number of days
  const daysDifference = Math.floor(
    new BigNumber(timeDifference).dividedBy(86400000).toNumber(),
  ); // timeDifference / (24 * 60 * 60 * 1000));

  return daysDifference;
}

export function convertDateFormat(inputDate: string): string {
  const inputDateTime = getTimestampUTC(new Date(inputDate));

  // Format the date according to the desired output
  const outputDate =
    new Date(inputDateTime).toISOString().split('.')[0] + '+00:00';

  return outputDate;
}

export function addYearsToTimestamp(
  inputTimestamp: number,
  inputYears: number,
): number {
  // Convertir le timestamp en objet Date
  const currentDate = new Date(inputTimestamp);

  // Ajouter 5 ans à la date actuelle en utilisant l'UTC
  currentDate.setUTCFullYear(currentDate.getUTCFullYear() + inputYears);

  // Renvoyer le nouveau timestamp
  return currentDate.getTime();
}

export function formatDateToISOString(inputDate: Date): string {
  const isoString = inputDate.toISOString();
  return isoString.substring(0, 23) + '+00:00';
}

export function getDayOfMonthUTC(timestamp: number): number {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);

  // Get the day of the month using Date object methods
  const dayOfMonthUTC = date.getUTCDate(); // getUTCDate() returns the day of the month using UTC time

  return dayOfMonthUTC;
}

export function isTodayUTC(timestamp: number): boolean {
  const givenDate = new Date(timestamp);
  const now = new Date();

  // Extraire la date UTC de 'givenDate'
  const givenUTCYear = givenDate.getUTCFullYear();
  const givenUTCMonth = givenDate.getUTCMonth();
  const givenUTCDay = givenDate.getUTCDate();

  // Extraire la date UTC de 'now'
  const currentUTCYear = now.getUTCFullYear();
  const currentUTCMonth = now.getUTCMonth();
  const currentUTCDay = now.getUTCDate();

  // Comparer les parties année, mois et jour
  return (
    givenUTCYear === currentUTCYear &&
    givenUTCMonth === currentUTCMonth &&
    givenUTCDay === currentUTCDay
  );
}

export function getTimestamp183DaysAgo(): number {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  return date.getTime() - 183 * 24 * 60 * 60 * 1000;
}
