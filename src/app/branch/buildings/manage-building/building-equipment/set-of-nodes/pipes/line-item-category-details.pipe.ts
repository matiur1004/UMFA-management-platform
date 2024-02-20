import {Pipe, PipeTransform} from '@angular/core';
import {TariffViewModel, VersionViewModel} from '@models';

@Pipe({
  name: 'lineItemCategoryDetails'
})
export class LineItemCategoryDetailsPipe implements PipeTransform {

  transform(categoryId: string, tariffs: VersionViewModel<TariffViewModel>[]): any {
    let res = '&nbsp;';
    if (categoryId && Array.isArray(tariffs)) {
      tariffs.forEach(tariff => {
        tariff.entity.lineItems.forEach(lineItem => {
          lineItem.categories.forEach(category => {
            if (category.id === categoryId) {
              res = `<span class="line-item-category-name" title="${category.name}">${category.name}</div>`;
            }
          })
        });
      });
    }
    return res;
  }

}
