import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {BulkDropdownType, MeterViewModel, ParentMeterValueModel} from '../../shared/models';
import {ShopsStepActionType, Step} from '../../shared/models/bulk-action.model';
import {LocationGroupMetersFormValue, UnitMetersFormValue} from '../../shared/store/reducers/bulk-equipment-wizard-reducers/shops-step.store';
import {BuildingFilter, BuildingFilterTypeDropdownItems, EquipmentTemplateListItemViewModel, LocationViewModel, SupplyType, SupplyTypeDropdownItems} from '@models';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';

@Component({
  selector: 'alloc-bulk-equip-to-shop',
  templateUrl: './alloc-bulk-equip-to-shop.component.html',
  styleUrls: ['./alloc-bulk-equip-to-shop.component.less']
})
export class AllocBulkEquipToShopComponent implements OnInit {
  public step = Step.ShopBulk;
  @Input() total: number;
  @Input() filterForm: FilterAttribute;
  @Input() dropdownData: any;
  @Input() parentMeters: MeterViewModel[];
  @Input() form: FormGroupState<any>;
  @Input() unitOptions: any[];
  @Input() isSelectedAllMeters: boolean;
  @Input() locationList: LocationViewModel[];
  @Input() equipmentGroups: any[];
  @Input() deviceTypes: EquipmentTemplateListItemViewModel[];
  
  checkedAllPartly: boolean;
  supplyTypeModel: SupplyType = -1;
  locationModel = -1;
  equipmentGroupModel = -1;
  deviceTypeModel = -1;

  @Output() filter: EventEmitter<FilterAttribute> = new EventEmitter<FilterAttribute>();
  searchTerm = '';
  @Input() existMeters: ParentMeterValueModel[];
  @Output() supplyToChange = new EventEmitter();
  @Output() locationTypeChange = new EventEmitter();
  @Output() serialNumberChange = new EventEmitter();
  @Output() parentChange = new EventEmitter();
  @Output() unitChange = new EventEmitter();
  @Output() changeShops = new EventEmitter();
  @Output() selectAllMeters = new EventEmitter();
  @Output() changeOrder = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() applyBulk: EventEmitter<{ step: Step, actionType: ShopsStepActionType }> = new EventEmitter();
  @Output() updateLocationMeters = new EventEmitter();
  bulkDropdownType = BulkDropdownType;
  actionType = ShopsStepActionType;
  filteredBulkSupplies: any[];
  filteredBulkLocationTypes: any[];
  bulkAction: ShopsStepActionType = ShopsStepActionType.SelectSupplyToAndLocationType;
  bulkValue: any;
  supplyType = SupplyType;

  filterTypeModel: BuildingFilter = -1;  
  filterTypes = BuildingFilter;

  public filterTypesList = BuildingFilterTypeDropdownItems;
  public supplyTypesList = SupplyTypeDropdownItems;

  _bulkSupplies: any[];

  get bulkSupplies() {
    return this._bulkSupplies;
  }

  @Input()
  set bulkSupplies(values: any[]) {
    this._bulkSupplies = values;
    this.filteredBulkSupplies = values;
    this.getFilteredBulkLocationTypes(values);
  }

  private _newMeters: ParentMeterValueModel[];

  get newMeters(): ParentMeterValueModel[] {
    return this._newMeters;
  }

  @Input('newMeters') set newMeters(meters: ParentMeterValueModel[]) {
    this._newMeters = meters;
  }

  private _selectedItems: number;

  get selectedItems() {
    return this._selectedItems;
  }

  @Input() set selectedItems(selectedItems: number) {
    this._selectedItems = selectedItems;
    this.checkedAllPartly = this.selectedItems > 0 && this.locationGroupMeters.value.length !== this.selectedItems;
  }

  get locationGroupMeters() {
    return this.form.controls.locationGroupMeters as FormArrayState<LocationGroupMetersFormValue[]>;
  }

  get meters() {
    return this.form.controls.meters as FormArrayState<UnitMetersFormValue[]>;
  }

  ngOnInit() {
    this.searchTerm = this.filterForm.searchTerm;
    this.supplyTypeModel = this.filterForm.supplyType;
    this.deviceTypes = this.deviceTypes.filter((item) => item.isAssigned == true);
    this.locationList = this.locationList.sort((a, b) => a.name > b.name ? 1 : -1);
    this.deviceTypes = this.deviceTypes.sort((a, b) => a.model > b.model ? 1 : -1);
    this.equipmentGroups = this.equipmentGroups.sort((a, b) => a.name > b.name ? 1 : -1);
  }

  onSelectAll() {
    this.selectAllMeters.emit(!this.isSelectedAllMeters);
  }

  getFilteredBulkLocationTypes(supplies: any[]) {
    const supplyTo = this.bulkValue && this.bulkValue[BulkDropdownType.SelectedSupplyTo] && supplies
      ? supplies.find(s => s.id === this.bulkValue[BulkDropdownType.SelectedSupplyTo].id) : null;
    const supplyTypes = supplyTo ? supplyTo.supplyTypes : [];

    this.filteredBulkLocationTypes = supplyTypes.length ? supplyTypes[0].supplyToLocations : [];
  }

  trackById(index) {
    return index;
  }

  onChangeFilterType(type) {
    this.filterTypeModel = type;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel, location: this.locationModel, equipmentGroup: this.equipmentGroupModel, device: this.deviceTypeModel, searchTerm: this.searchTerm});
    this.selectAllMeters.emit(false);
  }

  onSearchBySupplyType(supplyType: SupplyType) {
    this.supplyTypeModel = supplyType;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel});
    this.selectAllMeters.emit(false);
  }

  onSearchByLocation(location: any) {
    this.locationModel = location;
    this.filter.emit({category: this.filterTypeModel, location: this.locationModel});
    this.selectAllMeters.emit(false);
  }

  onSearchByEquipmentModel(equipmentGroup){
    this.equipmentGroupModel = equipmentGroup;
    this.filter.emit({category: this.filterTypeModel, equipmentGroup: this.equipmentGroupModel});
    this.selectAllMeters.emit(false);
  }

  onSearchByDeviceType(deviceType) {
    this.deviceTypeModel = deviceType;
    this.filter.emit({category: this.filterTypeModel, device: this.deviceTypeModel});
    this.selectAllMeters.emit(false);
  }
  
  search(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase();
    this.filter.emit({category: this.filterTypeModel, searchTerm});
    this.selectAllMeters.emit(false);
  }

  dropped(event) {
    this.changeOrder.emit({previousIndex: event.previousIndex, currentIndex: event.currentIndex});
  }
}
