import BigNumber from 'bignumber.js';
import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarTime,
  IconClock,
  TablerIcon,
} from '@tabler/icons';
import { PredefinedPeriods } from './Types';
export const FIRST_OF_MAY = 1682892000000;
export const START_DATE = 1687132800000;

export function daysInNMonthAgo(date: number, N: number): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Décrémenter le mois de la date copiée en utilisant UTC
  dateCopy.setUTCMonth(dateCopy.getUTCMonth() - N);

  // Retourner le nombre de jours dans le mois précédent en utilisant UTC
  return new Date(
    Date.UTC(dateCopy.getUTCFullYear(), dateCopy.getUTCMonth() + 1, 0),
  ).getUTCDate();
}

export function getDateYesterday(): Date {
  const yesterday: Date = new Date();

  // Décrémenter la date d'un jour en utilisant UTC
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);

  // Mettre l'heure à minuit en utilisant UTC
  yesterday.setUTCHours(0, 0, 0, 0);

  return new Date(getTimestampUTC(yesterday));
}

export function calculateDaysBetweenDateAndToday(timestamp: number): number {
  const today = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = today.getTime() - timestamp;

  // Calculate the number of days
  const daysDifference =
    Math.floor(new BigNumber(timeDifference).dividedBy(86400000).toNumber()) +
    1; // timeDifference / (24 * 60 * 60 * 1000));

  return daysDifference;
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

export function getCalendarIcon(period: PredefinedPeriods): TablerIcon {
  let Icon = IconCalendar;
  switch (period) {
    case PredefinedPeriods.Last24Hours:
      Icon = IconClock;
      break;
    case PredefinedPeriods.Last7Days:
      Icon = IconCalendarTime;
      break;
    case PredefinedPeriods.Last30Days:
      Icon = IconCalendarTime;
      break;
    case PredefinedPeriods.CurrentMonth:
      Icon = IconCalendarDue;
      break;
    case PredefinedPeriods.LastMonth:
      Icon = IconCalendarEvent;
      break;
    case PredefinedPeriods.Last3Months:
      Icon = IconCalendarPlus;
      break;
    case PredefinedPeriods.FromStart:
      Icon = IconCalendar;
      break;
    // Add cases for other predefined periods as needed
    default:
      // Handle default case
      break;
  }

  return Icon;
}

export function getTimestampEndOfTheDay(timestamp: number): number {
  const targetDate = new Date(timestamp);

  // Set time to midnight using UTC
  targetDate.setUTCHours(23, 59, 59, 999);

  // Return the timestamp
  return targetDate.getTime();
}

export function getTimestampStartOfNDaysAgo(N: number): number {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setUTCDate(today.getUTCDate() - N);

  // Set time to midnight
  targetDate.setUTCHours(0, 0, 0, 0);

  // Return the timestamp
  return targetDate.getTime();
}

export function getDateAtMidnightUTC(inputDate: Date): Date {
  // Créer une copie de la date pour éviter de la modifier directement
  const dateCopy = new Date(inputDate);

  // Mettre l'heure, les minutes, les secondes et les millisecondes à 0 en utilisant UTC
  dateCopy.setUTCHours(0, 0, 0, 0);

  // Renvoyer le timestamp pour la date modifiée
  return dateCopy;
}

export function getTimestampAtMidnightUTC(inputTimestamp: number): number {
  // Créer une copie de la date pour éviter de la modifier directement
  const dateCopy = new Date(inputTimestamp);

  // Mettre l'heure, les minutes, les secondes et les millisecondes à 0 en utilisant UTC
  dateCopy.setUTCHours(0, 0, 0, 0);

  // Renvoyer le timestamp pour la date modifiée
  return dateCopy.getTime();
}

export function stringToTimestampUTC(dateString: string): number {
  // Convertir la chaîne en objet Date
  const date = new Date(dateString);
  const timezoneOffsetInMinutes = date.getTimezoneOffset();

  //console.log('timezoneOffsetInMinutes', timezoneOffsetInMinutes);
  return date.getTime() - timezoneOffsetInMinutes * 60 * 1000;
}

export function getLastMinuteTimestampUTC(inputTimestamp: number): number {
  // Créer une copie de la date pour éviter de la modifier directement
  const dateCopy = new Date(inputTimestamp);

  // Définir l'heure, les minutes, les secondes et les millisecondes à la dernière minute de la journée en utilisant UTC
  dateCopy.setUTCHours(23, 59, 59, 999);

  // Renvoyer le timestamp pour la date modifiée
  return dateCopy.getTime();
}

export function getTimestampLastDayOfNMonthAgo(N: number): number {
  const lastDayOfMonth = new Date();

  // Decrement the month of the copied date using UTC
  lastDayOfMonth.setUTCMonth(lastDayOfMonth.getUTCMonth() - N);

  // Set the day of the copied date to the last day of the month using UTC
  lastDayOfMonth.setUTCDate(daysInNMonthAgo(new Date().getTime(), N));
  lastDayOfMonth.setUTCHours(23, 59, 59, 999);

  // Return the timestamp of the last day of the previous month at 23:59
  return lastDayOfMonth.getTime();
}

export function getTimestampFirstDayOfNMonthsAgo(N: number): number {
  const today = new Date();
  const targetDate = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth() - N,
    1,
  );

  return getTimestampUTC(targetDate);
}

export function getTimestampFirstDayOfCurrentMonth(): number {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    1,
  );

  // Return the timestamp
  return getTimestampUTC(firstDayOfCurrentMonth);
}

export function getTimestampUTC(date: Date): number {
  // Set time to midnight
  const timezoneOffsetInMinutes = date.getTimezoneOffset();

  // Return the timestamp
  return date.getTime() - timezoneOffsetInMinutes * 60 * 1000;
}
