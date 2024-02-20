import {NgbDate} from "@ng-bootstrap/ng-bootstrap";

export function parseAsUTCDate(dateStr: string) {
  let parsed = Date.parse(dateStr);
  if (isNaN(parsed)) return null;
  let date = new Date(parsed);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

// returns string in format MM/dd/yyyy
export function getShortDateString(dateStr: string, delimeter: string) {
  let parsed = Date.parse(dateStr);
  if (isNaN(parsed)) return null;
  const date = new Date(parsed);

  return (date.getMonth() + 1) + (delimeter || "/") + date.getDate() + (delimeter || "/") + date.getFullYear();
}

export const dateMediumFormat = 'dd/MM/yy';

export const convertDateToNgbDate = (date: Date | string): NgbDate => {
  if (date) {
    const dateObject = new Date(date);

    return new NgbDate(dateObject.getUTCFullYear(), dateObject.getUTCMonth() + 1, dateObject.getUTCDate());
  } else {
    return null;
  }
}

interface INgbDatePickerDate {
  year: number;
  month: number;
  day: number;
}

export const convertNgbDateToDate = (ngbDate: INgbDatePickerDate): Date => {
  if (!ngbDate) {
    return null;
  }

  return new Date(Date.UTC(ngbDate.year, ngbDate.month - 1, ngbDate.day));
};

export const convertDateToISOString = (date: Date): string => {
  if(!date) {
    return null;
  }
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

export function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);

  return result;
}

export const createUrlPartFromDate = (date: Date | string): string => {
  const ngbDate = convertDateToNgbDate(date);

  return `${ngbDate.year.toString().padStart(4, '0')}${ngbDate.month.toString().padStart(2, '0')}${ngbDate.day.toString().padStart(2, '0')}`;
}

export const formatBuildingDate = (dateStr: string): string => {
  const response = dateStr.substr(8, 2) + "/" + dateStr.substr(5, 2) + "/" + dateStr.substr(0,4);
  return response;
}

export const formatNgbDatePickerDate = (dateStr: string) => {
  const nYear = Number(dateStr.substr(6, 4));
  const nMonth = Number(dateStr.substr(3, 2));
  const nDay = Number(dateStr.substr(0, 2));
  return {year: nYear, month: nMonth, day: nDay};
}