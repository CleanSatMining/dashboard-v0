import BigNumber from 'bignumber.js';

export function getTimestampFirstDayOfCurrentMonth(): number {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1,
  );

  // Return the timestamp
  return firstDayOfCurrentMonth.getTime();
}

export function getTimestampFirstDayOfNMonthsAgo(N: number): number {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() - N, 1);

  // Set time to midnight
  targetDate.setHours(0, 0, 0, 0);

  // Return the timestamp
  return targetDate.getTime();
}

export function getTimestampLastDayOfNMonthAgo(N: number): number {
  const lastDayOfMonth = new Date();
  // Decrement the month of the copied date
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() - N);

  // Set the day of the copied date to the last day of the month
  lastDayOfMonth.setDate(daysInNMonthAgo(lastDayOfMonth.getTime(), N));

  // Set the hours, minutes, seconds, and milliseconds to 23:59:59:999
  lastDayOfMonth.setHours(23, 59, 59, 999);

  // Return the timestamp of the last day of the previous month at 23:59
  return lastDayOfMonth.getTime();
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
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() - N);

  // Set time to midnight
  targetDate.setHours(0, 0, 0, 0);

  // Return the timestamp
  return targetDate.getTime();
}

export function getDateYesterday(): Date {
  const yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return yesterday;
}

export function getTimestampEndOfTheDay(timestamp: number): number {
  const targetDate = new Date(timestamp);

  // Set time to midnight
  targetDate.setHours(23, 59, 59, 999);

  // Return the timestamp
  return targetDate.getTime();
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
  const daysDifference = Math.floor(timeDifference / millisecondsPerDay);

  return daysDifference;
}
