import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'emptyValue'
})
export class EmptyValuePipe implements PipeTransform {

  transform(value: any, defValue = ''): any {
    if (!value && value !== false && value !== 0) {
      if (!defValue) {
        return 'N/A';
      } else {
        return defValue;
      }
    } else {
      return value;
    }
  }

}
