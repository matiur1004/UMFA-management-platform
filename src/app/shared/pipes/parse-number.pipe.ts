import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'parseNumber'
})
export class ParseNumberPipe implements PipeTransform {

  transform(value: any): number {
    let res: number = 0;
    try {
      res = parseFloat(value);
      if (isNaN(res)) {
        res = 0;
      }
    } catch (er) {
    }
    return res;
  }

}
