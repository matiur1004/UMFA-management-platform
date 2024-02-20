import {Pipe, PipeTransform} from '@angular/core';

interface ArrayItem {
  isSelected: boolean;
}

@Pipe({
  name: 'selectedArrayLength',
  pure: false
})
export class SelectedArrayLengthPipe implements PipeTransform {
  transform(value: ArrayItem[]): number {
    let res = 0;
    if (value && Array.isArray(value)) {
      value.forEach(el => {
        if (el.isSelected) {
          res++;
        }
      });
    }
    return res;
  }
}
