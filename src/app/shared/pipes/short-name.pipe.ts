import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'shortName'
})
export class ShortNamePipe implements PipeTransform {

  transform(value: string): any {
    let res = '';
    if (value) {
      res = value.split(' ').map(r => r.substring(0, 1).toUpperCase()).join('');
    }
    return res;
  }

}
