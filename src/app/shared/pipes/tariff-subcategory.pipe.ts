import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'tariffSubcategory'
})
export class TariffSubcategoryPipe implements PipeTransform {

  transform(value: any[], isRecommended: boolean): any {
    if (value && Array.isArray(value)) {
      let subcategory = value.filter(item => item.isRecommended === isRecommended);
      return subcategory;
    }
    return null;
  }

}
