export const datesDifferenceInDays = (startDate, endDate) => Math.round(Math.abs(((startDate - endDate) / 24) * 60 * 60 * 1000));

export function DaysBetween(StartDate, EndDate) {
  return Math.round(Math.abs((+StartDate) - (+EndDate))/8.64e7);
}