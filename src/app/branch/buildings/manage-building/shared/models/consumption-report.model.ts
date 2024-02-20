import {SupplyType, TariffViewModel, VersionViewModel} from '@models';

export class TenantCostsReportOptionsViewModel {
  tenants: any[] = [];
  tariffs: VersionViewModel<TariffViewModel>[] = [];

  constructor() {
  }
}

export class TenantCostReportFilterViewModel {
  supplyTypes: SupplyType[] = [];
  tenantIds: string[] = [];
  unitType: number | null;
  tariffId: string | null;
  lineItemId: string | null;
}

export class TenantCostsReportViewModel {
  tenants: any[] = [];
  vacant: any[] = [];
  vacantShops: any[] = [];
  vacantTenants: any[] = [];
  ownerLiability: any[] = [];
  ownerTenants: any[] = [];
  tenantsNotLiable: any[] = [];
  tenantsNotLiableTenants: any[] = [];
}

export class SupplyTypeUnitTypeCostViewModel {
  supplyType: SupplyType;
  unitType: number | null;
  reconCategory: number | null;
  recoverable: number | null;
  recoverableIncVat: number | null;
  nonRecoverable: number | null;
  nonRecoverableIncVat: number | null;
  total: number | null;
  totalIncVat: number | null;
}
