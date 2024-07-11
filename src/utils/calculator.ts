type Values = {
  total: number;
  /** Full value @example 30 for 30% */
  percentage: number;
};

export function calcReversePercentage({ percentage, total }: Values): number {
  return (100 * total) / (100 + percentage);
}
