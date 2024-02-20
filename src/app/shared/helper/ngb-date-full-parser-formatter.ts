import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from './ngb-date-fr-parser-formatter';

function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

function isNumber(value: any): boolean {
  return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

@Injectable()
export class NgbDateFullParserFormatter extends NgbDateFRParserFormatter {
  monthShortNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  format(date: NgbDateStruct): string {
    let stringDate: string = '';
    if (date) {
      stringDate += isNumber(date.day) ? padNumber(date.day) + ' ' : '';
      stringDate += isNumber(date.month) ? this.monthShortNames[date.month - 1] + ' ' : '';
      stringDate += date.year;
    }

    return stringDate;
  }
}
