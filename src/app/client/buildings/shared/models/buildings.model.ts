import {AppliedTariffViewModel, ShopMeterViewModel} from 'app/tenant/profiles/models/shop-detail.model';
import {AddressViewModel, IShopViewModel, ShopStatus, SupplyType, TenantViewModel} from '@models';

export class PortfolioViewModel {
  id: string;
  name: string;
  logoUrl: string;
  totalBuildings: number;
  buildings: BuildingViewModel[];
  isSelected: boolean;
}

export class BuildingViewModel {
  id: string;
  name: string;
  description: string;
  address: AddressViewModel;
  totalGLA: number;
  phone: string;
  logoUrl: string;
}

export class BuildingDetailViewModel {
  id: string;
  name: string;
  address: string;
  totalGLA: number;
  branchName: string;
  logoUrl: string;
  categories: string[];
  shops: BuildingShopViewModel[];
}

export class BuildingShopViewModel implements IShopViewModel {
  id: string;
  name: string;
  tenant: TenantViewModel;
  area: number;
  floor: number | null;
  isSpare: boolean;
  isSelected: boolean;
  status: ShopStatus;
  details: BuildingShopDetailsViewModel;
}

export class SpecialViewModel {
  id: string;
  name: string;
  floor: number | null;
  supplyTypeMeters: SupplyTypeMeterViewModel[];
}

export class SupplyTypeMeterViewModel {
  supplyType: SupplyType;
  share: number;
  meter: MeterViewModel;
  appliedTariff: AppliedTariffViewModel;
}

export class MeterViewModel {
  id: string;
  serialNumber: string;
  equipmentModel: string;
}

export class BuildingShopDetailsViewModel {
  meters: ShopMeterViewModel[];
  specials: SpecialViewModel[];
}
