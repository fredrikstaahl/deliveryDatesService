export const getStartOfWeekDate = (date: Date): Date => {
  let diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};
