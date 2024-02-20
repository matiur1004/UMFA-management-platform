import {SupplierViewModel, SupplyType, VersionViewModel} from '@models';
import {BuildingViewModel} from './building-view.model';
import {BranchTariffViewModel} from './branch-tariff-view.model';

export interface SupplierBranchViewModel extends SupplierViewModel {
  tariffs?: AggregatedTariffViewModel[];
  isExpanded?: boolean;
  physicalAddressStr: string;
}

export interface AggregatedTariffViewModel {
  id: string;
  name: string;
  code: string;
  supplyType: SupplyType;
  buildings?: BuildingViewModel[];
  versions: VersionViewModel<BranchTariffViewModel[]>;
}
