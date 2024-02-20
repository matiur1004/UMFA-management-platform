import {TariffCategoryViewModel} from './tariff-category.model';
import {
  BasedOnAttributesLineItemViewModel,
  BasedOnCalculationsLineItemViewModel,
  BasedOnReadingsAndSettingsLineItemViewModel,
  BasedOnReadingsLineItemViewModel,
  FixedPriceLineItemViewModel
} from './line-items.model';
import {SupplyType} from './supply-type.model';
import {SupplierViewModel} from './supplier-view.model';
import {UserViewModel} from './user.model';
import {CategoryViewModel} from './category.model';
import {VersionViewModel} from './version.model';
import {TariffVersionSettingsViewModel} from "./tariff-version-settings.model";

export enum OrderVersion {
  ValuesAsc = 1,
  ValuesDesc = -1,
  CreatedAsc = 2,
  CreatedDesc = -2,
  CreatedByAsc = 3,
  CreatedByDesc = -3,
  UpdatedAsc = 4,
  UpdatedDesc = -4,
  UpdatedByAsc = 5,
  UpdatedByDesc = -5,
  IsActiveAsc = 6,
  IsActiveDesc = -6,
  StartDateAsc = 7,
  StartDateDesc = -7
}

export enum OrderTariffList {
  NameAsc = 1,
  NameDesc = -1,
  VersionAsc = 2,
  VersionDesc = -2,
  TypeAsc = 3,
  TypeDesc = -3
}

export class TariffDetailViewModel {
  id: string;
  supplierId: string;
  buildingId: string;
  name: string;
  code: string;
  supplyType: SupplyType;
  seasonalChangesEnabled: boolean;
  touChangesEnabled: boolean;
  buildingCategoriesIds: string[];

  basedOnReadingsLineItems: BasedOnReadingsLineItemViewModel[] = new Array<BasedOnReadingsLineItemViewModel>();
  basedOnReadingsAndSettingsLineItems: BasedOnReadingsAndSettingsLineItemViewModel[] =
    new Array<BasedOnReadingsAndSettingsLineItemViewModel>();
  basedOnAttributeLineItems: BasedOnAttributesLineItemViewModel[] = new Array<BasedOnAttributesLineItemViewModel>();
  basedOnCalculationsLineItems: BasedOnCalculationsLineItemViewModel[] = new Array<BasedOnCalculationsLineItemViewModel>();
  fixedPriceLineItems: FixedPriceLineItemViewModel[] = new Array<FixedPriceLineItemViewModel>();

  createdOn: Date;
  createdBy: string;
  disableAfter: Date;
  disableForNewCustomers: boolean;
  tariffCategories: TariffCategoryViewModel[];
  tariffVersionSettings: TariffVersionSettingsViewModel;
  tariffVersions: TariffVersionInfoViewModel[];
  tariffSubVersions: TariffVersionInfoViewModel[];
  tariffValues: TariffValueVersionInfoViewModel[];
  versionDate: any;
}

export class TariffViewModel {
  id: string;
  name: string;
  code: string;
  supplierId: string;
  supplier: SupplierViewModel;
  supplyType: SupplyType;
  seasonalChangesEnabled: boolean;
  touChangesEnabled: boolean;
  buildingCategoriesIds: string[];
  createdOn: Date;
  createdByUser: UserViewModel;
  tariffCategories: TariffCategoryViewModel[];
  tariffValues: TariffValueVersionInfoViewModel[];
  lineItems: any[];
  disableAfter: Date;
}

export class AggregatedTariffViewModel {
  id: string;
  name: string;
  code: string;
  createdOn: Date;
  createdByUser: UserViewModel;
  supplyType: SupplyType;
  buildingCategories: CategoryViewModel[] = new Array<CategoryViewModel>();
  tariffCategories: TariffCategoryViewModel[];
  tariffs: VersionViewModel<TariffViewModel>[] = new Array<VersionViewModel<TariffViewModel>>();
}

export interface CreateTariffValueViewModel {
  baseTariffValueId?: string;
  tariffVersionId: string;
  name: string;
  code: string;
  startDate: string | Date;
  endDate: Date | string;
  increasePercentage: number;
  lineItemIncreases: { lineItemId: string, increasePercentage: number }[];
}

export class TariffVersionInfoViewModel {
  versionId: string;
  name: string;
  createdOn: Date;
  createdByUser: UserViewModel;
  updatedOn: Date;
  updatedByUser: UserViewModel;
  majorVersion: number;
  minorVersion: number;
  version: string;
  isActual: boolean;
  subVersions: TariffVersionInfoViewModel[] = [];
}

export class TariffValueVersionInfoViewModel {
  versionId: string;
  valueId: string;
  tariffVersionId: string;
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
  createdOn: Date;
  createdByUser: UserViewModel;
  updatedOn: Date;
  updatedByUser: UserViewModel;
  majorVersion: number;
  minorVersion: number;
  version: string;
  isActual: boolean;
  subVersions: TariffValueVersionInfoViewModel[] = [];
  isExpanded: boolean;
}

export interface CostProviderNodeModel {
  name: string;
  nodeId: string;
  registerId: string;
  supplyType: SupplyType;
}
