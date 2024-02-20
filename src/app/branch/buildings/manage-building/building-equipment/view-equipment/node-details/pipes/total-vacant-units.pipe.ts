import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'totalVacantUnits',
  pure: false
})
export class TotalVacantUnitsPipe implements PipeTransform {

  transform(value: any[]): any {
    let res = 0;
    value && value.forEach(el => {
      if (!el.tenantName) {
        res++;
      }
    });
    return res;
  }

}
