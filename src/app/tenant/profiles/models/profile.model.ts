import {ContactViewModel, SupplyType} from '@models';


export class TenantBuildingViewModel {
  buildingId: string;
  buildingName: string;
  branchName: string;
  buildingAddress: string;
  buildingContact: ContactViewModel;
  tenants: TenantShopsViewModel[];
}

export class TenantBuildingPopupViewModel {
  buildingId: string;
  buildingName: string;
  branchName: string;
  tenantId: string;
  tenantName: string;
  shops: string[];
}

export class TenantShopsViewModel {
  tenantId: string;
  tenantName: string;
  shops: ShopViewModel[];
}

export class ShopViewModel {
  shopId: string;
  shopName: string;
  area: number;
  floor: number;
  supplyTypes: SupplyType[];
  meters: string[];
  allocatedTariffs: string[];
}
