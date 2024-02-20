import {Pipe, PipeTransform} from '@angular/core';
import {TariffViewModel, VersionViewModel} from '@models';

@Pipe({
  name: 'findLineItemCategories'
})
export class FindLineItemCategoriesPipe implements PipeTransform {

  transform(tariffs: VersionViewModel<TariffViewModel>[], tariffId: string, lineItemId: string): any {
    let res = [];
    if (lineItemId && Array.isArray(tariffs)) {
      tariffs.forEach(tariff => {
        if (tariffId === tariff.id && tariff.entity) {
          tariff.entity.lineItems.forEach(lineItem => {
            if (lineItemId == lineItem.id) {
              res = lineItem.categories;
            }
          });
        }
      });
    }
    return res;
  }

}
