export const versionDayKey = (dateValue) => {
  const date = new Date(dateValue);

  return ''
    + date.getUTCFullYear()
    + (date.getUTCMonth() < 9 ? '0' : '') + (date.getUTCMonth() + 1)
    + (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate();
};
