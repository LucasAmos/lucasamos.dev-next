export function generateYears(start: number): number[] {
  const years: any = [];
  const currentYear = new Date().getFullYear();

  let year = currentYear - 1;
  while (year >= start) {
    years.push(year);
    year = year - 1;
  }
  return years;
}
