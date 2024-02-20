import {convertNgbDateToDate} from './date-extension';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export const ngbDateNgrxValueConverter = {
  convertViewToStateValue: (value: NgbDateStruct) => {
    if (!value) {
      return '';
    }

    const jsDate = convertNgbDateToDate(value);

    return jsDate.toISOString();
  },
  convertStateToViewValue: (value: string) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);

    return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};
  }
};

export class NgbDateValueConverter extends NgbDateParserFormatter {
  parse = (value: string): NgbDateStruct => ngbDateNgrxValueConverter.convertStateToViewValue(value);
  format = (date: NgbDateStruct): string => ngbDateNgrxValueConverter.convertViewToStateValue(date).slice(0, 10);
}
