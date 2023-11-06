export function truncateString(inputString: string, maxLength: number): string {
  if (inputString.length <= maxLength) {
    return inputString;
  }

  const beforeMaxLengthCharacter = inputString.substring(0, maxLength);
  const lastSpace = beforeMaxLengthCharacter.lastIndexOf(' ');
  let dots = '...';

  if (lastSpace > 0) {
    const truncatedString = beforeMaxLengthCharacter.substring(0, lastSpace);
    if (truncatedString.charAt(truncatedString.length - 1) === '.') {
      dots = '..';
    }
    return truncatedString + dots;
  } else {
    if (
      beforeMaxLengthCharacter.charAt(beforeMaxLengthCharacter.length - 1) ===
      '.'
    ) {
      dots = '..';
    }
    return beforeMaxLengthCharacter + dots;
  }
}

export function maskAddress(address: string): string {
  if (address.length < 12) {
    // Si la chaîne est trop courte pour être masquée, retourne la chaîne d'origine
    return address;
  }

  const maskedAddress = address.slice(0, 6) + '...' + address.slice(-4); // Garde les 6 premiers caractères et les 4 derniers caractères

  return maskedAddress;
}
