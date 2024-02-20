import {Pipe, PipeTransform} from '@angular/core';
import {TariffViewModel, VersionViewModel} from '@models';

@Pipe({
  name: 'lineItemDetails'
})
export class LineItemDetailsPipe implements PipeTransform {

  transform(lineItemId: string, tariffs: VersionViewModel<TariffViewModel>[]): any {
    let res = '&nbsp;';
    if (lineItemId && Array.isArray(tariffs)) {
      tariffs.forEach(tariff => {
        if (tariff.entity && tariff.entity.lineItems) {
          tariff.entity.lineItems.forEach(lineItem => {
            if (lineItemId == lineItem.id) {
              res = `<span class="line-item-name" title="${lineItem.name}">${lineItem.name}</div>`;
            }
          });
        }
      });
    }
    return res;
  }

}
