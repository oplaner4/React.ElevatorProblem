export function str2Hsl(source: string, saturation: number = 100, lightness: number = 60) {
  /**
   * Adapted from https://stackoverflow.com/a/21682946
   */

  let hash = 0;

  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, ${saturation}%, ${lightness}%)`;
}

export function getInitials(source: string, limit: number): string[] {
  return source
    .split(/\s+/g)
    .map((w) => w[0])
    .filter((_, i) => i < limit);
}

export const getRange = (start: number, count: number) => {
  const result: number[] = [];

  for (let i = start; i < count; i++) {
    result.push(i);
  }

  return result;
};

export const getReversedRange = (start: number, count: number) => {
  const result: number[] = [];

  for (let i = count - 1; i >= start; i--) {
    result.push(i);
  }

  return result;
};
