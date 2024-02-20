import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateDuration'
})
export class DateDurationPipe implements PipeTransform {

  transform(value: number): string {
    let res = '';
    value = value * 1;
    if (value > 0) {
      const date = new Date('Jan 1 2000 00:00:00 GMT+0 (Eastern European Standard Time)');
      date.setDate(value);
      const years = date.getFullYear() - 2000;
      if (years > 0) {
        res += years + ' years ';
      }

      const month = date.getMonth();
      if (month > 0) {
        res += month + ' months ';
      }

      const day = date.getDate();
      res += day + ' days';

    } else {
      res = '0 days';
    }

    return res;
  }

}
