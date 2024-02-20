import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'dateReadingDetails'
})
export class DateReadingDetailsPipe implements PipeTransform {
  private readonly dateFormat = 'dd.MM.yyyy';
  private readonly dateTimeFormat = 'dd.MM.yyyy HH:mm';

  constructor(public datePipe: DatePipe) {

  }

  transform(date: string | Date, displaTime: boolean): string {
    const format = displaTime
      ? this.dateTimeFormat
      : this.dateFormat;

    return this.datePipe.transform(date, format);
  }
}
