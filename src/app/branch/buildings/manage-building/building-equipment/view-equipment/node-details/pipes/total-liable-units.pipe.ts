import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'totalLiableUnits',
  pure: false
})
export class TotalLiableUnitsPipe implements PipeTransform {

  transform(value: any[], param: boolean): any {
    let res = 0;
    value && value.forEach(el => {
      if (el.isLiable === param) {
        res++;
      }
    });
    return res;
  }

}
