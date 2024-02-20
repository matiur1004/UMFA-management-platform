import {Pipe, PipeTransform} from '@angular/core';
import {ShopOrder, ShopViewModel} from '@models';

@Pipe({
  name: 'sortUnits'
})
export class SortUnitsPipe implements PipeTransform {

  transform(value: ShopViewModel[], orderType: ShopOrder): any {
    const sortIndex = orderType / Math.abs(orderType);
    const property = Math.abs(orderType);

    let sortFunction = (a: ShopViewModel, b: ShopViewModel) => {
      let a_value, b_value;
      if (property === ShopOrder.ShopNameAsc) {
        a_value = a.name;
        b_value = b.name;
      } else if (property === ShopOrder.FloorAsc) {
        a_value = a.floor;
        b_value = b.floor;
      } else if (property === ShopOrder.TenantNameAsc) {
        a_value = a.tenant ? a.tenant.name : '';
        b_value = b.tenant ? b.tenant.name : '';
      }

      if (a_value > b_value)
        return 1 * sortIndex;
      else if (a_value < b_value)
        return -1 * sortIndex;

      return 0;
    };
    return value ? value.sort(sortFunction) : [];
  }

}
