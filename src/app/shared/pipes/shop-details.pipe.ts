import {Pipe, PipeTransform} from '@angular/core';
import {EquipmentTreeShopModel} from '@models';

@Pipe({
  name: 'shopDetails'
})
export class ShopDetailsPipe implements PipeTransform {

  transform(shopId: string, shops: EquipmentTreeShopModel[]): any {
    let res = '';
    if (shopId && Array.isArray(shops)) {
      const shop = shops.find(shop => shop.id === shopId);
      if (shop) {
        res = `<div class="shop-name" title="${shop.name}">${shop.name}</div>`
          + ((shop.tenant && shop.tenant.name) ? `<div class="shop-tenant" title="${shop.tenant.name}">${shop.tenant.name}</div>` : ``);
      }
    }
    return res;
  }

}
