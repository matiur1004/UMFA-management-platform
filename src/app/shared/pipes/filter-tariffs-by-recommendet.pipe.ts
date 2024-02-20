import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterTariffsByRecommended'
})
export class FilterTariffsByRecommendedPipe implements PipeTransform {
  transform(value: any[], isRecommended: number): any {
    let res = value;
    if (value && isRecommended) {
      res = value.filter(el => {
        if (isRecommended == 1) {
          return el.isRecommended == true;
        } else return true;
      });
    }
    return res;
  }
}
