import {IShopViewModel, LiableShopStatus, ShopStatus, ShopViewModel} from '@models';
import {Injectable} from '@angular/core';

@Injectable()
export class ShopHelper {

  public static getStatus(shop: IShopViewModel): ShopStatus {

    if (shop.isSpare)
      return ShopStatus.Spare;

    if (!shop.tenant || !shop.tenant.name)
      return ShopStatus.Vacant;

    return ShopStatus.Occupied;
  }

  public static getLiabilityStatusForRelation(isLiable: boolean, shop: ShopViewModel) {
    if (!shop.tenant || !shop.tenant.name) {
      return LiableShopStatus.VacantShops;
    }

    if (isLiable) {
      return LiableShopStatus.LiableShops;
    }

    return LiableShopStatus.NotLiableShops;
  }
}
