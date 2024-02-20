import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {monthNames} from '@app/branch/buildings/manage-building/meter-readings/building-periods/shared/models/months';

@Pipe({
  name: 'dateReadingFormat'
})
export class DateReadingFormatPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {
  }

  transform(periodName: string, readingDate: Date, isSingleFormat = true, previousDate?: Date): string {
    const date = new Date(readingDate);
    const monthIdx = monthNames.findIndex(m => m === periodName);
    date.setMonth(monthIdx);

    if (isSingleFormat) {
      return this.datePipe.transform(date, 'd MMMM, y');
    } else {
      return `${periodName} ${this.datePipe.transform(previousDate, 'y')} / ${this.datePipe.transform(readingDate, 'y')}`;
    }
  }
}
