import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'totalAreaUnits',
  pure: false
})
export class TotalAreaUnitsPipe implements PipeTransform {

  transform(value: any[]): any {
    let res = 0;
    value && value.forEach(el => {
      res += el.area ? el.area : 0;
    });
    return res;
  }

}
