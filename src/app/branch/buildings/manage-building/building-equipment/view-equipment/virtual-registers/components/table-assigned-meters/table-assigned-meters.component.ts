import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AssignedStatus,
  MeterListFilterParameters,
  MeterViewModel,
  NodeType,
  TableAssignedViewModel
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {
  ShopViewModel,
  SupplyToLocationViewModel,
  SupplyToViewModel,
  SupplyType,
  UnitOfMeasurement,
  UNITS_PER_PAGE
} from '@models';
import {getItemsDetails} from 'app/branch/buildings/shared/utils/text';
import {VirtualRegisterMeter} from '../../../../shared/models/virtual-register.model';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {ISupplyType} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/models/supply-type.model';
import {SearchFilterAssignedMetersModel} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/models/filter-meter.model';


@Component({
  selector: 'table-assigned-meters',
  templateUrl: './table-assigned-meters.component.html',
  styleUrls: ['./table-assigned-meters.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableAssignedMetersComponent {
  supplyType = SupplyType;
  searchForm: SearchFilterAssignedMetersModel = new SearchFilterAssignedMetersModel();
  supplyTypesList: ISupplyType[] = [
    {supplyType: SupplyType.Electricity, checked: false},
    {supplyType: SupplyType.Water, checked: false},
    {supplyType: SupplyType.Sewerage, checked: false},
    {supplyType: SupplyType.Gas, checked: false},
    {supplyType: SupplyType.AdHoc, checked: false}
  ];
  nodeTypes = [
    {
      label: 'All Types',
      value: null
    },
    {
      label: NodeType[NodeType.Single],
      value: NodeType.Single
    },
    {
      label: NodeType[NodeType.Multi],
      value: NodeType.Multi
    }
  ];
  status = [
    {
      label: AssignedStatus[AssignedStatus.All],
      value: AssignedStatus.All
    },
    {
      label: AssignedStatus[AssignedStatus.Assigned],
      value: AssignedStatus.Assigned
    },
    {
      label: AssignedStatus[AssignedStatus['Not Assigned']],
      value: AssignedStatus['Not Assigned']
    }
  ];
  @Input() total = 0;
  @Input() unitsOfMeasurement: UnitOfMeasurement[];
  @Input() suppliers: SupplyToViewModel[];
  @Input() assignedMeters: VirtualRegisterMeter[];
  @Output() assignedMeter = new EventEmitter();
  @Output() getMeters = new EventEmitter();
  @Output() onApplyFilter: EventEmitter<SearchFilterAssignedMetersModel> = new EventEmitter();
  showFilter = false;
  itemsPerPageList = UNITS_PER_PAGE;
  itemsPerPage = 30;
  page = 1;
  searchTerms = '';
  public isAllSelected = false;
  public checkedAllPartly = false;
  public cbSizeError: boolean;
  locationTypes: SupplyToLocationViewModel[] = [];

  constructor() {
  }

  _equipments: TableAssignedViewModel[];

  @Input() set equipments(equipments: MeterViewModel[]) {
    if (equipments && this.assignedMeters) {
      this._equipments = equipments.length ? this.getAssignedEquipments(equipments) : [];
    }
  }

  private _units: Array<ShopViewModel[]>;

  get units() {
    return this._units;
  }

  @Input('units') set units(units) {
    this._units = units;
  }

  onShowFilter() {
    this.showFilter = !this.showFilter;
  }

  getShowingItems() {
    return getItemsDetails(this.page, this.itemsPerPage, this._equipments ? this._equipments.length : 0, 'items');
  }

  onPageChange(page: number) {
    this.page = page;
    this.onUpdateMetersList();
  }

  onSearchMeter(term: string) {
    this.searchTerms = term;
    this.page = 1;
    this.onUpdateMetersList();
  }

  onItemsPerPageChange(pageSize: number) {
    this.isAllSelected = false;
    this.checkedAllPartly = false;

    if (!pageSize) {
      this.itemsPerPage = 0;
      this.page = 1;
    } else {
      this.itemsPerPage = pageSize;
      this.page = 1;
    }
    this.onUpdateMetersList();
  }

  onUpdateMetersList() {
    const payload: PagingOptions<MeterListFilterParameters> = {
      requestParameters: new MeterListFilterParameters(),
      skip: (this.page - 1) * this.itemsPerPage,
      take: this.itemsPerPage
    };

    payload.requestParameters.searchKey = this.searchTerms;

    this.getMeters.emit(payload);
  }

  onSelectAll(isAllSelected: boolean) {
    this.checkedAllPartly = false;
    this._equipments = this._equipments.map(eq => {
      return {...eq, isSelected: isAllSelected};
    });
  }

  onSelect(equipmentId: string) {
    const meterIdx = this._equipments.findIndex(item => item.id === equipmentId);
    this._equipments[meterIdx].isSelected = !this._equipments[meterIdx].isSelected;
    const selectedEquipments = this._equipments.filter(item => item.isSelected === true);

    if (selectedEquipments.length === this._equipments.length) {
      this.checkedAllPartly = false;
      this.isAllSelected = true;
      return;
    }

    if (!selectedEquipments.length) {
      this.checkedAllPartly = false;
      this.isAllSelected = false;
      return;
    }

    this.checkedAllPartly = true;
  }

  onUseForBilling(equipmentId: string) {
    const meterIdx = this._equipments.findIndex(item => item.id === equipmentId);
    this._equipments[meterIdx].useForBilling = !this._equipments[meterIdx].useForBilling;

    if (this._equipments[meterIdx].isAssigned) {
      this.assignedMeter.emit(this._equipments.filter(item => item.isAssigned));
    }
  }

  setBillingStatus(setStatus: boolean) {
    this._equipments = this._equipments.map(item => {
      return {
        ...item,
        useForBilling: item.isSelected ? setStatus : item.useForBilling
      };
    });
    this.assignedMeter.emit(this._equipments.filter(item => item.isAssigned));
  }

  onAssignSelected(isAssigned: boolean) {
    this._equipments = this._equipments.map(item => {
      return {
        ...item,
        isAssigned: item.isSelected ? isAssigned : item.isAssigned
      };
    });
    this.assignedMeter.emit(this._equipments.filter(item => item.isAssigned));
  }

  onSupplyTypeChecked(supplyType: number) {
    const index = this.supplyTypesList.findIndex(x => x.supplyType === supplyType);
    this.supplyTypesList[index].checked = !this.supplyTypesList[index].checked;
    const selectedSupplies = this.supplyTypesList.filter(s => s.checked).map(s => s.supplyType);
    this.searchForm.supplyType = [...selectedSupplies];
  }

  updateSupplyTo() {
    if (this.searchForm.supplyToId !== '') {
      this.locationTypes = this.suppliers && this.suppliers.find(supplier => supplier.id === this.searchForm.supplyToId).locationTypes;
      this.searchForm.locationTypeId = '';
    } else {
      this.locationTypes = [];
      this.searchForm.locationTypeId = null;
    }
  }

  onResetFilter() {
    this.searchForm = new SearchFilterAssignedMetersModel();
    this.supplyTypesList = this.supplyTypesList.map(supplyType => {
      return {...supplyType, checked: false};
    });
  }

  onApply() {
    this.onApplyFilter.emit(this.searchForm);
  }

  onCancel() {
    this.showFilter = !this.showFilter;
  }

  cbSizeMinChange(min: number) {
    this.cbSizeError = this.searchForm.cbSize.max < min;
  }

  cbSizeMaxChange(max: number) {
    this.cbSizeError = max < this.searchForm.cbSize.min;
  }

  private getAssignedEquipments(equipments: MeterViewModel[]) {
    return equipments.map(item => {
      const assignedMeter = this.assignedMeters.find(meter => meter.meterId === item.id);

      return {
        ...item,
        isSelected: false,
        isAssigned: !!assignedMeter,
        useForBilling: assignedMeter ? assignedMeter.useForBilling : false
      };
    });
  }
}
