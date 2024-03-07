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
export const START_DATE = 1687212000000;

export function daysInNMonthAgo(date: number, N: number): number {
  // Create a copy of the date to avoid modifying it directly
  const dateCopy = new Date(date);

  // Decrement the month of the copied date
  dateCopy.setMonth(dateCopy.getMonth() - N);

  // Return the number of days in the previous month
  return new Date(dateCopy.getFullYear(), dateCopy.getMonth() + 1, 0).getDate();
}

export function getDateYesterday(): Date {
  const yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
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

export function calculateDaysBetweenDates(
  timestamp1: number,
  timestamp2: number,
): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(timestamp2 - timestamp1);

  // Calculate the number of days
  const daysDifference = Math.round(timeDifference / millisecondsPerDay);

  return daysDifference;
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

  // Set time to midnight
  targetDate.setUTCHours(0, 0, 0, 0);

  // Return the timestamp
  return targetDate.getTime();
}

export function getTimestampFirstDayOfCurrentMonth(): number {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    1,
  );

  // Return the timestamp
  return firstDayOfCurrentMonth.getTime();
}
