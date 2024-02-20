import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {NgbModal, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {FormGroupState, SetValueAction} from 'ngrx-forms';

import * as fromEquipment from '../shared/store/reducers';
import * as wizardAction from '../shared/store/actions/wizard.actions';
import * as commonData from '../../shared/store/selectors/common-data.selectors';
import * as equipmentStepActions from '../shared/store/actions/equipment-step.actions';
import * as shopStepActions from '../shared/store/actions/shop-step.actions';
import * as locationEquipmentActions from '../shared/store/actions/location-equipment.action';
import * as equipmentActions from '../shared/store/actions/equipment.actions';

import * as fromLocationStep from '../shared/store/reducers/location-step.store';

import * as locationFormAction from '../shared/store/actions/location-form.actions';
import {ImgModalComponent} from 'app/widgets/img-modal/img-modal.component';
import {FileExtension} from 'app/shared/helper/file-extension';

import {
  MeterEquipmentViewModel,
  MeterPhotoType,
  MeterRegisterViewModel,
  SelectedUnitFilter,
  UnitFilter,
  UserViewModel
} from '../shared/models';
import {AddLocationComponent} from '../view-equipment/locations-list/add-location/add-location.component';
import {LocationViewModel, SupplyToLocationViewModel, SupplyToViewModel} from '@models';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {convertNgbDateToDate} from '@app/shared/helper/date-extension';
import { BuildingPeriodViewModel } from '../../shared/models/building-period.model';

@Component({
  selector: 'create-equipment',
  templateUrl: './create-equipment.component.html',
  styleUrls: ['./create-equipment.component.less']
})
export class CreateEquipmentComponent implements OnInit, OnDestroy {

  step$: number;

  // Equipment step
  equipmentTemplates$: Observable<any[]>;
  equipmentTemplateForm$: Observable<FormGroupState<MeterEquipmentViewModel>>;
  equipmentTemplateName$: Observable<string>;
  notIncludedRegisters$: Observable<any[]>;
  registerFiles$: Observable<any>;
  equipmentRegistersDict$: Observable<any>;

  meters$: Observable<any[]>;
  parentMeter$: Observable<any>;

  equipmentTemplateId$: Subscription;
  equipmentTemplateId: string;

  isFixedRegister: boolean;

  actualPhotoUrl: string;

  // Location step
  locations$: Observable<LocationViewModel[]>;
  supplies$: Observable<SupplyToViewModel[]>;
  locationTypes$: Observable<SupplyToLocationViewModel[]>;
  technicians$: Observable<UserViewModel[]>;
  locationForm$: Observable<any>;

  // Shop step
  units$: Observable<any[]>;
  unitFilterText$: Observable<string>;
  shopCountText$: Observable<string>;

  selectedUnitFilter = SelectedUnitFilter;

  // Wizard
  isLocationWizard$: Subscription;
  shouldDisplayVersionPopup$: Subscription;
  isLocationWizard: boolean;
  shouldDisplayVersionPopup: boolean;

  // Common Data
  comment$: Subscription;
  comment: string;
  isComplete$: Subscription;
  isComplete: boolean;
  buildingPeriod$: Observable<BuildingPeriodViewModel>;

  constructor(private store: Store<fromEquipment.State>, private modalService: NgbModal) {
    store.pipe(select(fromEquipment.getWizardStep), map(step => step.toString())).subscribe((id) => this.step$ = Number(id));

    store.pipe(select(fromEquipment.getStepSelecetedTemplate)).subscribe(res => {
      this.isFixedRegister = res.isFixedRegister;
    })

    // Equipment step
    this.equipmentTemplates$ = store.pipe(select(fromEquipment.getEquipmentStepEquipmentTemplates));
    this.meters$ = store.pipe(select(fromEquipment.getEquipmentStepMeters));
    this.equipmentTemplateForm$ = store.pipe(select(fromEquipment.getEquipmentStepFormState));
    this.notIncludedRegisters$ = store.pipe(select(fromEquipment.getEquipmentStepNotIncludedRegisters));
    this.registerFiles$ = store.pipe(select(fromEquipment.getRegisterFiles));
    this.equipmentRegistersDict$ = store.pipe(select(fromEquipment.getEquipmentStepEquipmentTemplateRegistersDict));

    // Location step
    this.locationForm$ = store.pipe(select(fromEquipment.getLocationStepFormState));
    this.locations$ = store.pipe(select(fromEquipment.getLocationStepLocations));
    this.supplies$ = store.pipe(select(fromEquipment.getLocationStepSupplies));
    this.locationTypes$ = store.pipe(select(fromEquipment.getLocationStepLocationTypes));
    this.technicians$ = store.pipe(select(fromEquipment.getLocationStepTechnicians));

    // Shop step
    this.units$ = store.pipe(select(fromEquipment.getAllUnitsWithFilters));
    this.unitFilterText$ = store.pipe(select(fromEquipment.getShopStepFilter),
      map(filter => {
        switch (filter) {
          case UnitFilter.AllUnits:
            return this.selectedUnitFilter.ALL_UNITS;
          case UnitFilter.AllShops:
            return this.selectedUnitFilter.ALL_SHOPS;
          case UnitFilter.AllCommonAreas:
            return this.selectedUnitFilter.ALL_COMMON_AREAS;
          case UnitFilter.ConnectedUnits:
            return this.selectedUnitFilter.CONNECTED_UNITS;
          case UnitFilter.NotConnectedUnits:
            return this.selectedUnitFilter.NOT_CONNECTED_UNITS;
        }
      })
    );
    this.shopCountText$ = combineLatest(
      [
        store.pipe(select(fromEquipment.getAllUnits)),
        store.pipe(select(fromEquipment.getSelectedShopIds))
      ]
    )
      .pipe(map(([units, selectedIds]) => `${units.length} shop(s) / equipment is added to ${selectedIds.length} shop(s)`));

    // Wizard
    this.isLocationWizard$ = store.pipe(select(fromEquipment.getIsLocationWizard)).subscribe(flag => {
      return this.isLocationWizard = flag;
    });

    this.shouldDisplayVersionPopup$ = store.pipe(select(fromEquipment.getShouldDisplayVersionPopup)).subscribe(flag => {
      this.shouldDisplayVersionPopup = flag;
    });

    this.comment$ = store.pipe(select(commonData.getSelectedHistoryLog)).subscribe(log => {
      this.comment = log ? log.comment : '';
    });

    this.isComplete$ = store.pipe(select(commonData.getIsComplete)).subscribe(flag => {
      this.isComplete = flag;
    });

    this.buildingPeriod$ = store.pipe(select(commonData.getActiveBuildingPeriod));
  }

  ngOnInit() {
    this.store.dispatch(new equipmentStepActions.GetEquipmentTemplateRequest());
    this.store.dispatch(new equipmentStepActions.GetMetersRequest());
  }

  ngOnDestroy() {
    this.isLocationWizard$.unsubscribe();
    this.shouldDisplayVersionPopup$.unsubscribe();
    this.isComplete$.unsubscribe();
    this.equipmentTemplateId$ && this.equipmentTemplateId$.unsubscribe();
  }

  beforeChange($event: NgbNavChangeEvent) {

    const currentStep = +$event.activeId;
    const nextStep = +$event.nextId;

    if (nextStep >= currentStep) {
      $event.preventDefault();
      return;
    }

    this.store.dispatch(new wizardAction.GoToStep(nextStep));
  }

  onOpenVersionPopup($event) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = this.comment;

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new wizardAction.UpdateVersionData({
        comment: comment, versionDate: date, actionType: actionType, shouldDisplayVersionPopup: false
      }));
      this.store.dispatch(new wizardAction.TryNextStep($event)); // Navigate
    }, () => {
    });
  }

  onNextStep($event) {
    if (this.shouldDisplayVersionPopup && this.isComplete) {
      this.onOpenVersionPopup($event); // Display Version popup for the first time.
    } else {
      this.store.dispatch(new wizardAction.TryNextStep($event)); // Navigate
    }
  }

  onComboSettingsChange(event) {
    this.store.dispatch(new equipmentStepActions.ComboSettingsChange({value: event}));
  }

  onDeviceChanges($event) {
    this.store.dispatch(new equipmentStepActions.EquipmentTemplateChanged($event));
  }

  onLocationChange($event) {
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.id.id, $event.id));
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.name.id, $event.name));
  }

  onSupplieChange($event) {
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.supplyId.id, $event.id));
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.supplyName.id, $event.name));
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.locationType.id, ''));
  }

  onLocationTypeChange($event) {
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.locationType.id, $event.name));
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.supplyToLocationId.id, $event.id));
  }

  onTestingDateChange($event) {
    const date = convertNgbDateToDate($event);
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.testingDate.id, date.toJSON()));
  }

  onTechnicianChange($event) {
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.technicianId.id, $event.id));
    this.store.dispatch(new SetValueAction(fromLocationStep.InitState.controls.technicianName.id, $event.fullName));
  }

  onCloseWizard() {
    this.store.dispatch(new wizardAction.ToggleWizard());
    if (this.isLocationWizard) {
      this.store.dispatch(new locationEquipmentActions.ReloadLocationData());
    } else {
      this.store.dispatch(new equipmentActions.RequestEquipmentList());
    }
    this.store.dispatch(new equipmentStepActions.ResetEquipmentStepForm());
  }

  openDetail() {
    const modalRef = this.modalService.open(AddLocationComponent, {backdrop: 'static'});
  }

  onCreate() {
    this.store.dispatch(new locationFormAction.CreateLocation());
    this.openDetail();
  }

  onRemoveRegister($event) {
    if (!this.isFixedRegister) {
      this.store.dispatch(new equipmentStepActions.RemoveRegister($event));
    }
  }

  onAddRegister($event) {
    if (!this.isFixedRegister) {
      this.store.dispatch(new equipmentStepActions.AddRegister($event));
    }
  }

  onToggleUnit($event) {
    this.store.dispatch(new shopStepActions.ToggleUnit($event));
  }

  onUpdateFilter($event) {
    this.store.dispatch(new shopStepActions.UpdateFilter($event));
  }

  onUpdateSearchTerm($event) {
    this.store.dispatch(new shopStepActions.UpdateSearchTerm($event));
  }

  onOpenImage($event) {
    switch ($event.meterPhotoType) {
      case MeterPhotoType.ActualPhoto: {
        this.store.dispatch(new equipmentStepActions.UpdateActualPhoto($event.result));
        //this.actualPhotoUrl = result;
        break;
      }
      case MeterPhotoType.AttributePhoto: {
        this.store.dispatch(new equipmentStepActions.UpdateAttributePhoto({
          photo: $event.result,
          //photoUrl: result,
          attributeId: $event.attributeId
        }));
        break;
      }
    }
    // const modalRef = this.modalService.open(ImgModalComponent);
    // modalRef.componentInstance.url = $event.url;
    // modalRef.componentInstance.isReadonlyImage = $event.meterPhotoType === MeterPhotoType.MainPhoto;
    // modalRef.result.then((result) => {
    //   console.log('image logo', result);
    //   const file = FileExtension.dataURLtoFile(result, 'meter-image' + '.png');
    //   switch ($event.meterPhotoType) {
    //     case MeterPhotoType.ActualPhoto: {
    //       this.store.dispatch(new equipmentStepActions.UpdateActualPhoto(file));
    //       this.actualPhotoUrl = result;
    //       break;
    //     }
    //     case MeterPhotoType.AttributePhoto: {
    //       this.store.dispatch(new equipmentStepActions.UpdateAttributePhoto({
    //         photo: file,
    //         photoUrl: result,
    //         attributeId: $event.attributeId
    //       }));
    //       break;
    //     }
    //   }
    // }, () => {
    // });
  }

  onRegisterFileChange($event) {
    const file = $event.files[0] || null;

    if (file) {
      this.store.dispatch(new equipmentStepActions.AddRegisterFile(
        {
          registerId: $event.registerId,
          file: file
        }));
    }
  }

  onRegisterScaleChange($event) {
    this.store.dispatch(new equipmentStepActions.ChangeRegisterScale(
      {
        index: $event.index,
        scaleId: $event.scaleId
      }));
  }

  onRegisterSequenceChange(event: CdkDragDrop<MeterRegisterViewModel[]>) {
    this.store.dispatch(new equipmentStepActions.ChangeRegisterSequence({
      from: event.previousIndex,
      to: event.currentIndex
    }));
  }

  onParentMeterChange($event) {
    this.store.dispatch(new equipmentStepActions.ChangeParentMeter($event));
  }

  convertMetersListToDictionary(meters: any[]) {
    const metersDict = {};

    if (!meters) {
      return metersDict;
    }

    meters.forEach(m => {
      metersDict[m.id] = m;
    });

    return metersDict;
  };
}
