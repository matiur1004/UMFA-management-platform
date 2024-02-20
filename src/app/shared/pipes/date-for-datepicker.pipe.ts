import {Pipe, PipeTransform} from '@angular/core';

export interface DateOfPicker {
  year: number;
  month: number;
  day: number;
}

@Pipe({
  name: 'dateForDatepicker'
})
export class DateForDatepickerPipe implements PipeTransform {

  transform(value: Date): DateOfPicker {
    if (!value) {
      value = new Date();
    }
    let date: DateOfPicker = {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate()
    };

    return date;
  }
}
