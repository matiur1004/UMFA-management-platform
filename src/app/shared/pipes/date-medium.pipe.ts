import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {dateMediumFormat} from '../helper';

@Pipe({
  name: 'dateMediumFormat'
})
export class DateMediumFormatPipe implements PipeTransform {
  private readonly dateFormat = dateMediumFormat;

  constructor(public datePipe: DatePipe) {
  }

  transform(value: string | Date): string {
    return this.datePipe.transform(value, this.dateFormat);
  }
}
