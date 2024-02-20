import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'arrayLength'
})
export class ArrayLengthPipe implements PipeTransform {
  transform(value: any): any {
    if (value && Array.isArray(value)) {
      return value.length;
    }
    return 0;
  }
}
