import {Pipe, PipeTransform} from '@angular/core';
import {TimeOfUseName} from '../models/time-of-use.model';

@Pipe({
  name: 'timeOfUseName'
})
export class TimeOfUseNamePipe implements PipeTransform {
  transform(value: string | number): string {
    const touNames = Object.values(TimeOfUseName);
    if ((typeof value === 'number') && (value > 0) && (value <= touNames.length)) {
      return TimeOfUseName[value];
    }
    if (touNames.some(t => t === value)) {
      return value as string;
    }
    return '';
  }
}
