import {LiableShopStatus, SupplyType} from '@models';

export class CommonAreaShopRelationsViewModel {
  commmonAreaId: string;
  shopId: string;
  isSelected: boolean;
  liabilities: CommonAreaShopRelationsItemViewModel[] = new Array<CommonAreaShopRelationsItemViewModel>();
}

export class CommonAreaShopRelationsItemViewModel {
  status: LiableShopStatus;
  isLiable: boolean;
  allocation: number;
  proportion: string;
  serviceType: SupplyType;
}
