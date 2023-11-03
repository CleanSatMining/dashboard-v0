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
