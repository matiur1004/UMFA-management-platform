import {CommonAreaShopRelationsItemViewModel} from '../../models';
import {
  CommonAreaServiceViewModel,
  Dictionary,
  LiabilityViewModel,
  ShopLiabilityViewModel,
  ShopViewModel,
  SplitType,
  SupplyType
} from '@models';

export class OccupetionStoreEx {

  public static initLiabilities(commonAreaServices: CommonAreaServiceViewModel, splitType: SplitType = SplitType.Proportional) {
    let liabilities = new Array<LiabilityViewModel>();

    if (commonAreaServices.isElectricityEnable) {
      let liability = new LiabilityViewModel();
      liability.serviceType = SupplyType.Electricity;
      liability.splitType = splitType;
      liabilities.push(liability);
    }
    if (commonAreaServices.isWaterEnable) {
      let liability = new LiabilityViewModel();
      liability.serviceType = SupplyType.Water;
      liability.splitType = splitType;
      liabilities.push(liability);
    }
    if (commonAreaServices.isSewerageEnable) {
      let liability = new LiabilityViewModel();
      liability.serviceType = SupplyType.Sewerage;
      liability.splitType = splitType;
      liabilities.push(liability);
    }
    if (commonAreaServices.isGasEnable) {
      let liability = new LiabilityViewModel();
      liability.serviceType = SupplyType.Gas;
      liability.splitType = splitType;
      liabilities.push(liability);
    }
    if (commonAreaServices.isOtherEnable) {
      let liability = new LiabilityViewModel();
      liability.serviceType = SupplyType.AdHoc;
      liability.splitType = splitType;
      liabilities.push(liability);
    }

    return liabilities;
  };

  public static initRelations(commonAreaServices: CommonAreaServiceViewModel, allocation: number = 0) {
    let relations = new Array<CommonAreaShopRelationsItemViewModel>();

    if (commonAreaServices.isElectricityEnable) {
      let item = new CommonAreaShopRelationsItemViewModel();
      item.allocation = allocation;
      item.isLiable = true;
      item.serviceType = SupplyType.Electricity;
      relations.push(item);
    }
    if (commonAreaServices.isWaterEnable) {
      let item = new CommonAreaShopRelationsItemViewModel();
      item.allocation = allocation;
      item.isLiable = true;
      item.serviceType = SupplyType.Water;
      relations.push(item);
    }
    if (commonAreaServices.isSewerageEnable) {
      let item = new CommonAreaShopRelationsItemViewModel();
      item.allocation = allocation;
      item.isLiable = true;
      item.serviceType = SupplyType.Sewerage;
      relations.push(item);
    }
    if (commonAreaServices.isGasEnable) {
      let item = new CommonAreaShopRelationsItemViewModel();
      item.allocation = allocation;
      item.isLiable = true;
      item.serviceType = SupplyType.Gas;
      relations.push(item);
    }
    if (commonAreaServices.isOtherEnable) {
      let item = new CommonAreaShopRelationsItemViewModel();
      item.allocation = allocation;
      item.isLiable = true;
      item.serviceType = SupplyType.AdHoc;
      relations.push(item);
    }

    return relations;
  };

  public static removeShopFromLiabilities(shopId: string, liabilities: LiabilityViewModel[]) {
    liabilities.forEach(l => {
      let idx = l.shopLiabilities.findIndex(sl => {
        return sl.shopId == shopId;
      })
      if (idx != -1)
        l.shopLiabilities.splice(idx, 1);
    });
  }

  public static addShopToLiabilities(shopId: string, shops: Dictionary<ShopViewModel>, liabilities: LiabilityViewModel[]) {
    liabilities.forEach(l => {
      let hasShop = l.shopLiabilities.find(sl => sl.shopId == shopId);
      if (hasShop)
        return;

      let shopLiability = new ShopLiabilityViewModel();
      shopLiability.shopId = shopId;
      shopLiability.isLiable = true;
      shopLiability.allocation = shops[shopId].area;
      l.shopLiabilities.push(shopLiability);
    });
  }
}
