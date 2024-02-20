import {ReadingSource, SupplyType} from '@models';

export class AbnormalityFilterData {
  public absoluteUsageAbove: number = 0;
  public levelFrom: number = 0;
  public levelTo: number = 0;
}

export class BillingReadingsFilterDetailViewModel {
  checkedSupplyType: SupplyType[] = [];
  id?: string;
  supplyTypes: SupplyType[] = new Array<SupplyType>();
  sources: ReadingSourceCheck[] = new Array<ReadingSourceCheck>();
  checkedRegisterId = '';
  checkedNodeId = '';
  checkedReasonId = '';
  checkedUnitId = '';
  checkedLocationId = '';
  checkedTenantId = '';
  isBillingOnlyRegisters = false;
  readingCategory = 0;
  abnormalityFilterData: AbnormalityFilterData = new AbnormalityFilterData();
}

export class BillingReadingsFilterModel {
  id: string;
  filterName: string;
  buildingId: string;
  active: boolean;
  readingSources: Array<ReadingSource> = new Array<ReadingSource>();
  supplyTypes: Array<SupplyType> = new Array<SupplyType>();
  registerId: string;
  billingOnly: boolean;
  readingCategory: number;
  nodeId: string;
  reasonId: string;
  unitId: string;
  locationId: string;
  tenantId: string;
  abnormalityFilterData: AbnormalityFilterData = new AbnormalityFilterData();

  constructor(activeFilter: BillingReadingsFilterDetailViewModel, buildingId: string = null, filterName = '') {
    this.id = activeFilter.id;
    this.buildingId = buildingId;
    this.filterName = filterName;
    this.supplyTypes = activeFilter.checkedSupplyType;
    this.readingSources = getSelectedReadingSources(activeFilter.sources);
    this.active = false;
    this.registerId = activeFilter.checkedRegisterId;
    this.nodeId = activeFilter.checkedNodeId;
    this.reasonId = activeFilter.checkedReasonId;
    this.unitId = activeFilter.checkedUnitId;
    this.locationId = activeFilter.checkedLocationId;
    this.tenantId = activeFilter.checkedTenantId;
    this.billingOnly = activeFilter.isBillingOnlyRegisters;
    this.readingCategory = activeFilter.readingCategory;
    this.abnormalityFilterData = Object.assign({}, activeFilter.abnormalityFilterData);
  }
}

function getSelectedReadingSources(sources: ReadingSourceCheck[]) {
  return sources && sources.length
    ? sources.filter(s => s.isChecked)
      .map(source => source.readingSource)
    : [];
}

export class ReadingSourceCheck {
  readingSource: ReadingSource;
  isChecked = true;
}
