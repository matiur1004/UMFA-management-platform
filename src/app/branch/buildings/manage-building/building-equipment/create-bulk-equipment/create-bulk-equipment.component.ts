import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgbModal, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {FormGroupState, SetValueAction} from 'ngrx-forms';

import * as fromEquipment from '../shared/store/reducers';

import * as bulkWizardSelectors
  from '../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/bulk-wizard.selectors';
import * as setupStepSelectors
  from '../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/setup-step.selectors';
import * as shopsStepSelectors
  from '../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/shops-step.selectors';
import * as attributesStepSelectors
  from '../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/attributes-step.selectors';
import * as registersAndReadingsStepSelectors
  from '../shared/store/reducers/bulk-equipment-wizard-reducers/selectors/registers-and-readings.selectors';

import * as bulkWizardActions from '../shared/store/actions/bulk-equipment-wizard-actions/bulk-wizard.actions';
import * as setupStepActions from '../shared/store/actions/bulk-equipment-wizard-actions/setup-step.actions';
import * as shopsStepActions from '../shared/store/actions/bulk-equipment-wizard-actions/shops-step.actions';
import * as shopsStepStore from '../shared/store/reducers/bulk-equipment-wizard-reducers/shops-step.store';
import * as attributesStepActions from '../shared/store/actions/bulk-equipment-wizard-actions/attributes-step.actions';
import * as registersAndReadingsStepActions
  from '../shared/store/actions/bulk-equipment-wizard-actions/registers-and-readings-step.actions';
import * as equipmentActions from '../shared/store/actions/equipment.actions';
import * as commonData from '../../shared/store/selectors/common-data.selectors';

import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';
import {MeterRegisterViewModel, MeterViewModel, ParentMeterValueModel} from '../shared/models';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {Step} from '@app/branch/buildings/manage-building/building-equipment/shared/models/bulk-action.model';
import {EquipmentWizardPopupComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/shared/components/equipment-wizard-popup/equipment-wizard-popup.component';
import {Dictionary, EquipmentGroupViewModel, EquipmentTemplateListItemViewModel, LocationViewModel, TemplateListItemViewModel} from '@models';
import {FilterAttribute} from '@app/branch/buildings/manage-building/building-equipment/shared/models/search-filter.model';
import * as fromEquipmentTemplate from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/index';
import * as equipmentTemplateAction from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/building-equip-template.action';
import { EquipmentService } from '@app/shared/services';
import { BuildingPeriodViewModel } from '../../shared/models/building-period.model';
import { formatBuildingDate, formatNgbDatePickerDate } from '@app/shared/helper/date-extension';
@Component({
  selector: 'create-bulk-equipment',
  templateUrl: './create-bulk-equipment.component.html',
  styleUrls: ['./create-bulk-equipment.component.less']
})

export class CreateBulkEquipmentComponent implements OnInit, OnDestroy {

  step$: Observable<string>;

  // Setup step
  dropdownData$: Observable<any>;
  setupForm$: Observable<FormGroupState<any>>;
  total$: Observable<number>;
  totalShop$: Observable<number>;
  totalAttributes$: Observable<number>;
  totalRegisters$: Observable<number>;

  // Shops step
  meterDropdownData$: Observable<any>;
  shopsForm$: Observable<FormGroupState<any>>;
  shopsStepIsSelectedAllMeters$: Observable<boolean>;
  unitOptions$: Observable<any[]>;
  shopsStepIsSelectedMetersByOneGroup$: Observable<any>;
  shopsStepIsSelectedOneOrMoreMeters$: Observable<boolean>;
  shopsSupplies$: Observable<any[]>;
  existMeters$: Observable<ParentMeterValueModel[]>;
  newMeters$: Observable<ParentMeterValueModel[]>;
  unselectedMeters$: Observable<ParentMeterValueModel[]>;
  public selectedItems$: Observable<number>;
  // Attributes step
  attributesForm$: Observable<FormGroupState<any>>;
  attributesStepSelectedAllMeters$: Observable<any>;
  attributesStepSelectedOneOrMoreMeters$: Observable<any>;
  public filteredAttributesForm$: Observable<FormGroupState<any>>;
  // Registers and readings step
  registersForm$: Observable<FormGroupState<any>>;
  registersStepIsSelectedAllMeters$: Observable<boolean>;
  notIncludedRegisters$: Observable<any>;
  registerFiles$: Observable<any>;
  equipmentRegistersDictionary$: Observable<{}>;
  registersStepIsSelectedOneOrMoreMeters$: Observable<boolean>;
  public filteredRegistersForm$: Observable<FormGroupState<any>>;
  // Bulk wizard
  shouldDisplayVersionPopup$: Subscription;
  shouldDisplayVersionPopup: boolean;
  // Common Data
  comment$: Subscription;
  comment: string;
  isComplete$: Subscription;
  isComplete: boolean;
  selectedTemplates$: Observable<number>;

  equipmentGroups$: Observable<any>;
  buildingPeriod$: Observable<BuildingPeriodViewModel>;
  
  public parentMeters$: Observable<MeterViewModel[]>;
  selectedAttributeMetersCount$: Observable<number>;
  public selectedRegisters$: Observable<number>;
  public isAllSelectedTemplates$: Observable<boolean>;
  filterShopForm$: Observable<FilterAttribute>;
  filterAttributeForm$: Observable<FilterAttribute>;

  equipmentGroups: EquipmentGroupViewModel[];
  equipmentTemplateList$: Observable<EquipmentTemplateListItemViewModel[]>;
  private filteredShopsForm$: Observable<FormGroupState<shopsStepStore.FormValue>>;
  private readonly locations$: Observable<LocationViewModel[]>;
  private readonly selectedGroups$: Observable<Dictionary<{
    group: EquipmentGroupViewModel,
    devices: TemplateListItemViewModel[]
  }>>;
  private readonly selectedGroupsParents$: Observable<Dictionary<{ groupName: string, parentMeters: MeterViewModel[] }>>;
  private selectedLocationAndSupplies$: Observable<Dictionary<{ groupName: string, supplyTypes: Array<any>; }>>;
  
  constructor(private store: Store<fromEquipment.State>, private modalService: NgbModal, private equipmentService: EquipmentService) {
    this.step$ = store.pipe(select(bulkWizardSelectors.getWizardStep)).pipe(map(step => step.toString()));

    // Setup step
    this.locations$ = store.pipe(select(setupStepSelectors.getLocations));
    this.dropdownData$ = store.pipe(select(setupStepSelectors.getFilteredDropdownData));
    this.selectedGroups$ = store.pipe(select(setupStepSelectors.getEquipmentSelectedGroups));
    this.setupForm$ = store.pipe(select(setupStepSelectors.getFormState));
    this.total$ = store.pipe(select(setupStepSelectors.getEquipmentTemplateSum));
    this.selectedTemplates$ = store.pipe(select(setupStepSelectors.getEquipmentSelectedTotal));
    this.isAllSelectedTemplates$ = store.pipe(select(setupStepSelectors.getIsSelectedAllTemplates));
    // Shops step
    this.shopsForm$ = store.pipe(select(shopsStepSelectors.getFormState));
    this.meterDropdownData$ = store.pipe(select(shopsStepSelectors.getMeterDropdownData));
    this.totalShop$ = store.pipe(select(shopsStepSelectors.getShopTotal));
    this.selectedGroupsParents$ = store.pipe(select(shopsStepSelectors.getSelectedGroupsParents));
    this.selectedLocationAndSupplies$ = store.pipe(select(shopsStepSelectors.getSelectedGroupsLocationAndSupply));
    this.shopsStepIsSelectedAllMeters$ = store.pipe(select(shopsStepSelectors.getIsSelectedAllMeters));
    this.unitOptions$ = store.pipe(select(shopsStepSelectors.getUnitOptions));
    this.selectedItems$ = store.pipe(select(shopsStepSelectors.getTotalSelected));
    this.shopsStepIsSelectedMetersByOneGroup$ = store.pipe(select(shopsStepSelectors.getIsSelectedMetersByOneGroup));
    this.shopsStepIsSelectedOneOrMoreMeters$ = store.pipe(select(shopsStepSelectors.getIsSelectedOneOrMoreMeters));
    this.shopsSupplies$ = store.pipe(select(shopsStepSelectors.getSupplies));
    this.filteredShopsForm$ = store.pipe(select(shopsStepSelectors.getFilteredFormState));
    this.filterShopForm$ = store.pipe(select(shopsStepSelectors.getFilterForm));
    this.existMeters$ = store.pipe(select(shopsStepSelectors.getExistMeters));
    this.newMeters$ = store.pipe(select(shopsStepSelectors.getNewMeters));
    this.unselectedMeters$ = store.pipe(select(shopsStepSelectors.getUnselectedMeters));
    // Attributes step
    this.attributesForm$ = store.pipe(select(attributesStepSelectors.getFormState));
    this.filteredAttributesForm$ = store.pipe(select(attributesStepSelectors.getFilteredFormState));
    this.totalAttributes$ = store.pipe(select(attributesStepSelectors.getTotalAttributes));
    this.filterAttributeForm$ = store.pipe(select(attributesStepSelectors.getFilterFormState));
    this.attributesStepSelectedAllMeters$ = store.pipe(select(attributesStepSelectors.getSelectedAllMeters));
    this.selectedAttributeMetersCount$ = store.pipe(select(attributesStepSelectors.getSelectedAttributeMeters));
    this.attributesStepSelectedOneOrMoreMeters$ = store.pipe(select(attributesStepSelectors.getSelectedOneOrMoreMeters));

    // Registers and readings step
    this.registersForm$ = store.pipe(select(registersAndReadingsStepSelectors.getFormState));
    this.registersStepIsSelectedAllMeters$ = store.pipe(select(registersAndReadingsStepSelectors.getIsSelectedAllMeters));
    this.registerFiles$ = store.pipe(select(registersAndReadingsStepSelectors.getRegisterFiles));
    this.totalRegisters$ = store.pipe(select(registersAndReadingsStepSelectors.getTotalRegisters));
    this.selectedRegisters$ = store.pipe(select(registersAndReadingsStepSelectors.getSelectedRegistersCount));
    this.equipmentRegistersDictionary$ = store.pipe(select(registersAndReadingsStepSelectors.getRegisterDictionary));
    this.notIncludedRegisters$ = store.pipe(select(registersAndReadingsStepSelectors.getNotIncludedRegisters));
    this.filteredRegistersForm$ = store.pipe(select(registersAndReadingsStepSelectors.getFilteredFormState));
    this.registersStepIsSelectedOneOrMoreMeters$ = store.pipe(select(registersAndReadingsStepSelectors.getIsSelectedOneOrMoreMeters));

    // Bulk wizard
    this.shouldDisplayVersionPopup$ = store.pipe(select(bulkWizardSelectors.getShouldDisplayVersionPopup)).subscribe(flag => {
      this.shouldDisplayVersionPopup = flag;
    });

    this.comment$ = store.pipe(select(commonData.getSelectedHistoryLog)).subscribe(log => {
      this.comment = log ? log.comment : '';
    });

    this.isComplete$ = store.pipe(select(commonData.getIsComplete)).subscribe(flag => {
      this.isComplete = flag;
    });

    this.equipmentTemplateList$ = this.store.select(fromEquipmentTemplate.getEquipmentTemplates);
    this.buildingPeriod$ = store.pipe(select(commonData.getActiveBuildingPeriod));
  }

  ngOnInit() {
    this.store.dispatch(new setupStepActions.InitData());
    this.store.dispatch(new equipmentTemplateAction.InitFilterData());
    this.equipmentService.getAllEquipmentGroups('')
      .subscribe(res => {
        this.equipmentGroups = res;
      })
  }

  ngOnDestroy() {
  }

  // Bulk wizard
  beforeChange($event: NgbNavChangeEvent) {

    const currentStep = +$event.activeId;
    const nextStep = +$event.nextId;

    if (nextStep >= currentStep) {
      $event.preventDefault();
      return;
    }

    this.store.dispatch(new bulkWizardActions.GoToStep(nextStep));
  }


  onOpenVersionPopup($event) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = this.comment;

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new bulkWizardActions.UpdateVersionData({
        comment: comment, versionDate: date, actionType: actionType, shouldDisplayVersionPopup: false
      }));
      this.store.dispatch(new bulkWizardActions.TryNextStep($event)); // Navigate
    }, () => {
    });
  }

  onNextStep($event) {
    if ($event > 3 && this.shouldDisplayVersionPopup && this.isComplete) {
      this.onOpenVersionPopup($event); // Display Version popup for the first time.
    } else {
      this.store.dispatch(new bulkWizardActions.TryNextStep($event)); // Navigate
    }
  }

  onCloseWizard() {
    this.store.dispatch(new bulkWizardActions.ToggleWizard());
    this.store.dispatch(new equipmentActions.RequestEquipmentList());
  }

  // Setup step
  onEquipmentGroupChanged($event: { id: string, equipmentGroupId: string }) {
    this.store.dispatch(new setupStepActions.EquipmentGroupChanged($event));
  }

  onSelectAllTemplates(isAllSelected: boolean) {
    this.store.dispatch(new setupStepActions.SelectAllItem(isAllSelected));
  }

  onDeviceChange($event) {
    const {id, deviceId} = $event;
    this.store.dispatch(new setupStepActions.DeviceChange({id, deviceId}));
  }

  onLocationChanged($event) {
    const {locationId, id} = $event;
    this.store.dispatch(new setupStepActions.LocationChanged({id: id, locationId: locationId}));
  }

  onSupplyToChanged($event) {
    const {supplyToId, id} = $event;
    this.store.dispatch(new setupStepActions.SupplieChanged({id: id, supplyToId: supplyToId}));
  }

  onLocationTypeChanged($event) {
    const {id, locationType} = $event;
    this.store.dispatch(new setupStepActions.LocationTypeChanged({id: id, locationType: locationType}));
  }

  onRemoveItem($event) {
    if ($event) {
      this.store.dispatch(new setupStepActions.RemoveItem({id: $event.id, selected: false}));
    } else {
      this.store.dispatch(new setupStepActions.RemoveItem({selected: true}));
    }
  }

  onAddItem($event) {
    this.store.dispatch(new setupStepActions.AddNewItem($event));
  }

  onSetupStepPhotoChanged({templateId, file}) {
    if (file) {
      this.store.dispatch(new setupStepActions.ChangeImage({templateId, photo: file}));
    } else {
      this.store.dispatch(new setupStepActions.ChangeImage({templateId, photo: null}));
    }
  }

  // Shops step

  onShopsSupplyToChanged($event) {
    this.store.dispatch(new shopsStepActions.SupplyToChanged($event));
  }

  onShopsLocationTypeChanged($event) {
    this.store.dispatch(new shopsStepActions.LocationTypeChanged($event));
  }

  onUnitChanged($event) {
    this.store.dispatch(new shopsStepActions.UnitChanged($event));
  }

  onParentChanged($event) {
    this.store.dispatch(new shopsStepActions.ParentChanged($event));
  }

  onSerialNumberChanged($event) {
    this.store.dispatch(new shopsStepActions.SerialNumberChanged($event));
  }

  onShopsSelectAllMeters($event) {
    this.store.dispatch(new shopsStepActions.SelectAllMeters($event));
  }

  onFilterShops($event: FilterAttribute) {
    this.store.dispatch(new shopsStepActions.FilterShops($event));
  }

  onShopsUpdateLocationMeters($event) {
    this.store.dispatch(new shopsStepActions.UpdateLocationMeters($event));
  }

  onChangeOrder($event) {
    this.store.dispatch(new shopsStepActions.UpdateOrderMeters($event));
  }
  // Attributes step

  onAttributesSelectAllMeters($event) {
    this.store.dispatch(new attributesStepActions.SelectAllMeters($event));
  }


  onFilterAttributes(payload: FilterAttribute) {
    this.store.dispatch(new attributesStepActions.FilterWizardEquipment(payload));
  }

  onAttributesComboSettingChange($event) {
    this.store.dispatch(new SetValueAction($event.controlId, $event.value));
  }

  // Registers and readings step

  onFilterRegistersAndReadings(payload: FilterAttribute) {
    this.store.dispatch(new registersAndReadingsStepActions.FilterWizardEquipment(payload));
  }
  onRegistersSelectAllMeters($event) {
    this.store.dispatch(new registersAndReadingsStepActions.SelectAllMeters($event));
  }

  onRegisterScaleChanged($event) {
    this.store.dispatch(new registersAndReadingsStepActions.ChangeRegisterScale($event));
  }

  onRemoveRegister($event) {
    this.store.dispatch(new registersAndReadingsStepActions.RemoveRegister($event));
  }

  onAddRegister($event) {
    this.store.dispatch(new registersAndReadingsStepActions.AddRegister($event));
  }

  onRegisterFileChanged($event) {
    const file = $event.file;

    if (file) {
      this.store.dispatch(new registersAndReadingsStepActions.AddRegisterFile({
        serialNumber: $event.serialNumber,
        registerId: $event.registerId,
        file: file
      }));
    }
  }

  onRegisterSequenceChange(event: { dropEvent: CdkDragDrop<MeterRegisterViewModel[]>, serialNumber: string }) {
    this.store.dispatch(new registersAndReadingsStepActions.ChangeRegisterSequence({
      serialNumber: event.serialNumber,
      from: event.dropEvent.previousIndex,
      to: event.dropEvent.currentIndex
    }));
  }

  onAttributePhotoChange($event) {
    this.store.dispatch(new attributesStepActions.AttributePhotoChanged($event));
  }

  onSetBulkActionType($event) {
    const {step, actionType} = $event;
    const modalRef = this.modalService.open(EquipmentWizardPopupComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.bulkAction = actionType;
    modalRef.componentInstance.equipmentGroup = actionType && actionType.equipmentGroup ? actionType.equipmentGroup : null;
    modalRef.componentInstance.step = step;
    modalRef.componentInstance.unitOptions$ = this.unitOptions$;
    modalRef.componentInstance.selectedGroupsParents$ = this.selectedGroupsParents$;
    modalRef.componentInstance.selectedGroups$ = this.selectedGroups$;
    modalRef.componentInstance.selectedLocationAndSupplies$ = this.selectedLocationAndSupplies$;
    modalRef.componentInstance.locations$ = this.locations$;
    modalRef.componentInstance.dropdownData$ = this.dropdownData$;
    modalRef.result.then((result: { bulkAction: any, bulkValue: any, description: any }) => {
      if (result) {
        const {bulkAction, bulkValue, description} = result;
        switch (step) {
          case Step.EquipmentBulk:
            this.store.dispatch(new setupStepActions.ApplyBulkValue(result));
            break;
          case Step.ShopBulk:
            this.store.dispatch(new shopsStepActions.ApplyBulkValue({bulkAction, bulkValue, description}));
            break;
          case Step.Attributes:
            this.store.dispatch(new attributesStepActions.ApplyBulkValue({
              bulkAction: bulkAction,
              bulkValue: bulkValue
            }));
            break;

          case Step.RegistersAndReadings:
            this.store.dispatch(new registersAndReadingsStepActions.ApplyBulkValue({bulkAction, bulkValue}));
            break;
        }
      }
    }, () => {
    });
  }

}
