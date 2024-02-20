import {monthNames} from '../models/months';

export const getMonthDateFromName = (name) => {
  const monthYearArr = name.toLowerCase().split(' ');
  if (monthYearArr.length !== 2) {
    return;
  }
  const monthIndex = monthNames.findIndex(m => monthYearArr[0].indexOf(m.toLowerCase()) >= 0);
  const year = parseInt(monthYearArr[1], 10);
  if (monthIndex < 0 || isNaN(year)) {
    return;
  }
  return new Date(year, monthIndex);
};

export const getMonthYearName = (date: Date, adjustMonth: number = 0) => {
  let year = date.getFullYear();
  let month = date.getMonth() + adjustMonth;
  if (month < 0) {
    --year;
    month = (month + 12) % 12;
  } else if (month >= 12) {
    ++year;
    month = month % 12;
  }
  return `${monthNames[month]} ${year}`;
};
