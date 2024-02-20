import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {BuildingFilter, BuildingFilterTypeDropdownItems, EquipmentTemplateListItemViewModel, FieldType, LocationViewModel, SupplyType, SupplyTypeDropdownItems} from '@models';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as fromEquipment from '../../shared/store/reducers';

import * as attributesStepSelectors
  from '../../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/attributes-step.selectors';
import {ratioMask, ratioPlaceholderMask} from '@shared-helpers';
import {Step} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import {EquipmentGroupMetersFormValue,} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/bulk-equipment-wizard-reducers/attributes-step.store';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';
import {ImgModalComponent} from '@app/widgets/img-modal/img-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'bulk-equipment-attributes',
  templateUrl: './bulk-equipment-attributes.component.html',
  styleUrls: ['./bulk-equipment-attributes.component.less']
})
export class BulkEquipmentAttributesComponent implements OnInit {

  ratioMask = ratioMask;
  ratioPlaceholderMask = ratioPlaceholderMask
  checkedAllPartly: boolean;
  @Input() total: number;
  @Input() filterAttribute: FilterAttribute;
  @Input() locationList: LocationViewModel[];
  @Input() equipmentGroups: any[];
  @Input() deviceTypes: EquipmentTemplateListItemViewModel[];
  @Output() filter: EventEmitter<FilterAttribute> = new EventEmitter<FilterAttribute>();
  searchTerm = '';
  @Input() selectedAllMeters: any;
  @Input() selectedOneOrMoreMeters: any;
  @Input() attributePhotos: any;
  @Output() attributePhotoChange = new EventEmitter();
  @Output() selectAllMeters = new EventEmitter();
  @Output() nextStep = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() comboSettingChange = new EventEmitter();
  @Output() applyBulkValue = new EventEmitter();

  actions$: Observable<any>;
  fieldTypes = FieldType;
  bulkAction: any = {};
  bulkValue: any = {};
  supplyType = SupplyType;

  step = Step.Attributes;

  supplyTypeModel: SupplyType | null = null;
  locationModel = -1;
  equipmentGroupModel = -1;
  deviceTypeModel = -1;

  filterTypeModel: BuildingFilter | null = null;  
  filterTypes = BuildingFilter;

  public filterTypesList = BuildingFilterTypeDropdownItems;
  public supplyTypesList = SupplyTypeDropdownItems;
  
  constructor(
    private modalService: NgbModal,
    private store: Store<fromEquipment.State>
  ) {
    this.actions$ = store.pipe(select(attributesStepSelectors.getActions));
  }

  _form: FormGroupState<any>;

  get form() {
    return this._form;
  }

  @Input()
  set form(form: FormGroupState<any>) {
    this._form = form;
    if (!Object.keys(this.bulkAction).length) {
      form.value.equipmentGroupMeters.forEach(g => {
        this.bulkAction[g.equipmentGroupId] = g.headerAttributes[0];
      });
    }

  }

  private _selectedAttributes: number;

  get selectedAttributes() {
    return this._selectedAttributes;
  }

  @Input() set selectedAttributes(selectedAttr: number) {
    this._selectedAttributes = selectedAttr;
    const metersCount = this.equipmentGroupMeters.value.reduce((acc, group) => {
      const countMeters = group.meters.length;

      return acc + countMeters;
    }, 0);

    this.checkedAllPartly = this.selectedAttributes > 0 && metersCount !== this.selectedAttributes;
  }

  get equipmentGroupMeters() {
    return this.form.controls.equipmentGroupMeters as FormArrayState<EquipmentGroupMetersFormValue>;
  }

  ngOnInit() {
    this.searchTerm = this.filterAttribute.searchTerm;
    this.supplyTypeModel = this.filterAttribute.supplyType;
    this.deviceTypes = this.deviceTypes.filter((item) => item.isAssigned == true);
    this.locationList = this.locationList.sort((a, b) => a.name > b.name ? 1 : -1);
    this.deviceTypes = this.deviceTypes.sort((a, b) => a.model > b.model ? 1 : -1);
    this.equipmentGroups = this.equipmentGroups.sort((a, b) => a.name > b.name ? 1 : -1);
  }

  trackById(index) {
    return index;
  }

  trackByEquipmentGroupId(ind, eqGr) {
    return eqGr.value.equipmentGroupId;
  }

  onBulkActionChanged(step: Step, equipmentGroup: any, action: any) {
    this.bulkAction[equipmentGroup.equipmentGroupId] = {equipmentGroup, ...action};
    this.bulkValue[equipmentGroup.equipmentGroupId] = null;
    this.applyBulkValue.emit({
      step,
      actionType: this.bulkAction[equipmentGroup.equipmentGroupId],
    });
  }

  onChangeFilterType(type) {
    this.filterTypeModel = type;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel, location: this.locationModel, equipmentGroup: this.equipmentGroupModel, device: this.deviceTypeModel, searchTerm: this.searchTerm});
  }

  onSearchBySupplyType(supplyType: SupplyType) {
    this.supplyTypeModel = supplyType;
    this.filter.emit({category: this.filterTypeModel, supplyType: this.supplyTypeModel});
  }

  onSearchByLocation(location: any) {
    this.locationModel = location;
    this.filter.emit({category: this.filterTypeModel, location: this.locationModel});
  }

  onSearchByEquipmentModel(equipmentGroup){
    this.equipmentGroupModel = equipmentGroup;
    this.filter.emit({category: this.filterTypeModel, equipmentGroup: this.equipmentGroupModel});
  }

  onSearchByDeviceType(deviceType) {
    this.deviceTypeModel = deviceType;
    this.filter.emit({category: this.filterTypeModel, device: this.deviceTypeModel});
  }
  
  search(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase();
    this.filter.emit({category: this.filterTypeModel, searchTerm});
  }

  onChangePhoto(equipmentGroupId: string, serialNumber: string, attrId: string, photo: string) {
    const modalRef = this.modalService.open(ImgModalComponent);
    modalRef.componentInstance.url = photo;
    modalRef.result.then((res) => {
      this.attributePhotoChange.emit({equipmentGroupId, serialNumber, attributeId: attrId, file: res});
    }, () => {
    });
  }

  getSelectedItems(group: EquipmentGroupMetersFormValue) {
    return group.meters.filter(m => m.isSelected).length || 0;
  }
}
