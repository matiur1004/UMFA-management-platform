import {SupplyType} from "./supply-type.model";
import {VersionViewModel} from "./version.model";
import {TariffViewModel} from "./tariff.model";
import {SupplierViewModel} from "./supplier-view.model";


export interface AggregatedBuildingTariffViewModel {
  id: string;
  name: string;
  code: string;
  supplyType: SupplyType;
  supplierName: string;
  versions: VersionViewModel<BuildingTariffViewModel[]>;
}

export interface BuildingTariffViewModel extends TariffViewModel {
  supplier: SupplierViewModel;
}

export interface AddBuildingTariffViewModel extends VersionViewModel<TariffViewModel> {
  isSelected: boolean;
}

export enum BranchTariffsOrderList {
  NameDesc = -1,
  NameAsc = 1,
  SupplyTypeDesc = -2,
  SupplyTypeAsc = 2,
  AddDesc = -3,
  AddAsc = 3,
}
