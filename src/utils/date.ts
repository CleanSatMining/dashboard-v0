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

export function getMidnightTimestamp(inputTimestamp: number): number {
  const date = new Date(Number(inputTimestamp));
  console.log('getMidnightTimestamp #', inputTimestamp, date.getTime());
  date.setHours(0, 0, 0, 0); // Définir l'heure à 00:00:00.000
  console.log('getMidnightTimestamp', inputTimestamp, date.getTime());
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
