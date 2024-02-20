import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  private readonly dateFormat = 'dd/MM/yyyy';
  private readonly dateTimeFormat = 'dd/MM/yyyy HH:mm';

  constructor(public datePipe: DatePipe) {

  }

  transform(date: string | Date, displayTime: boolean): string {
    const format = displayTime
      ? this.dateTimeFormat
      : this.dateFormat;

    return this.datePipe.transform(date, format);
  }
}
