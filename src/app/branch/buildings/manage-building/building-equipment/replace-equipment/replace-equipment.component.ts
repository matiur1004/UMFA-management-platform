import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject, Subscription} from 'rxjs';
import {FormGroupState, SetValueAction} from 'ngrx-forms';
import {map, takeUntil} from 'rxjs/operators';

import * as equipmentActions from '../shared/store/actions/equipment.actions';
import * as addClosingReadingsActions
  from '../shared/store/actions/replace-equipment-wizard-actions/add-closing-readings-step.actions';
import * as replaceEquipmentActions
  from '../shared/store/actions/replace-equipment-wizard-actions/replace-equipment-step.actions';
import * as replaceWizardActions from '../shared/store/actions/replace-equipment-wizard-actions/replace-wizard.actions';
import * as replaceNodeTariffActions
  from '../shared/store/actions/replace-equipment-wizard-actions/replace-node-tariff-step.actions';
import * as locationEquipmentActions from '../shared/store/actions/location-equipment.action';

import * as replaceWizardSelector from '../shared/store/selectors/replace-wizard-selectors/replace-wizard.selector';
import * as addClosingReadingsSelector
  from '../shared/store/selectors/replace-wizard-selectors/add-closing-readings-step.selector';
import * as replaceEquipmentSelector
  from '../shared/store/selectors/replace-wizard-selectors/replace-equipment-step.selector';
import * as replaceNodeTariffSelector
  from '../shared/store/selectors/replace-wizard-selectors/replace-node-tariff-step.selector';

import {MeterRegisterViewModel} from '../shared/models';
import {ReplaceMeterNodeViewModel} from '../shared/models/replace-meter-node.model';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'replace-equipment',
  templateUrl: './replace-equipment.component.html',
  styleUrls: ['./replace-equipment.component.less']
})
export class ReplaceEquipmentComponent implements OnInit, OnDestroy {

  step$: Observable<string>;

  // Add closing readings step
  readingsForm$: Observable<FormGroupState<any>>;
  registerFiles$: Observable<any>;

  // Replace equipment step
  equipmentTemplates$: Observable<any[]>;
  equipmentTemplateForm$: Observable<FormGroupState<any>>;
  equipmentTemplateName$: Observable<string>;
  notIncludedRegisters$: Observable<any[]>;
  registeFiles$: Observable<any>;
  equipmentRegistersDict$: Observable<any>;

  meters$: Observable<any[]>;
  parentMeter$: Observable<any>;

  replacementDate$: Observable<any>;

  equipmentTemplateId$: Subscription;
  equipmentTemplateId: string;

  actualPhotoUrl: string;

  // Update node tariffs step
  nodes$: Observable<ReplaceMeterNodeViewModel[]>;
  tariffs$: Observable<any>;

  // Replace wizard
  isLocationWizard: boolean;

  destroy$ = new Subject<boolean>();

  defaultUrl: string = '../../../assets/images/upload-file/upload-img-preview.png';

  constructor(public activeModal: NgbActiveModal, private store: Store<any>, private modalService: NgbModal) {
    this.step$ = store.pipe(select(replaceWizardSelector.getWizardStep), map(step => step.toString()));

    // Add closing readings step
    this.readingsForm$ = store.pipe(select(addClosingReadingsSelector.getFormState));
    this.registerFiles$ = store.pipe(select(addClosingReadingsSelector.getRegisterFiles));

    // Replace equipment step
    this.equipmentTemplates$ = store.pipe(select(replaceEquipmentSelector.getEquipmentTemplates));
    this.meters$ = store.pipe(select(replaceEquipmentSelector.getMeters));
    this.equipmentTemplateForm$ = store.pipe(select(replaceEquipmentSelector.getFormState));
    this.notIncludedRegisters$ = store.pipe(select(replaceEquipmentSelector.getNotIncludedRegisters));
    this.registeFiles$ = store.pipe(select(replaceEquipmentSelector.getRegisterFiles));
    this.equipmentRegistersDict$ = store.pipe(select(replaceEquipmentSelector.getEquipmentTemplateRegistersDict));
    this.parentMeter$ = store.pipe(select(replaceEquipmentSelector.getParentMeter));
    this.replacementDate$ = store.pipe(select(addClosingReadingsSelector.getReplacementDate));

    // Replace node tariff step
    this.nodes$ = store.pipe(select(replaceNodeTariffSelector.getNodes));
    this.tariffs$ = store.pipe(select(replaceNodeTariffSelector.getTariffs));

    // Replace wizards
    store.pipe(select(replaceWizardSelector.getIsLocationWizard), takeUntil(this.destroy$)).subscribe(isLocationWizard => {
      this.isLocationWizard = isLocationWizard;
    });

    store.pipe(select(replaceWizardSelector.getIsWizardMode), takeUntil(this.destroy$)).subscribe(isWizardMode => {
      if (!isWizardMode) {
        this.onCancel();
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  beforeChange($event: NgbNavChangeEvent) {
    const currentStep = +$event.activeId;
    const nextStep = +$event.nextId;

    if (nextStep >= currentStep) {
      $event.preventDefault();
      return;
    }

    this.store.dispatch(new replaceWizardActions.GoToStep(nextStep));
  }

  // Add closing readings step

  onEditNote($event) {
    this.store.dispatch(new SetValueAction($event.id, $event.text));
  }

  onChangeRegisterFile($event) {
    const file = $event.files[0] || null;

    this.store.dispatch(new addClosingReadingsActions.UpdateRegisterFile(
      {
        registerTouKey: $event.registerTouKey,
        file: file
      }));
  }

  // Replace equipment step

  getPhotoUrl(file: any, photoUrl: string) {
    const fr = new FileReader();
    fr.onload = () => {
      photoUrl = fr.result as string;
    };
    fr.readAsDataURL(file);
  }

  onActualPhotoChange($event) {
    const file = $event[0] || null;

    if (file) {
      this.store.dispatch(new replaceEquipmentActions.UpdateActualPhoto(file));
      const fr = new FileReader();
      fr.onload = () => {
        this.actualPhotoUrl = fr.result as string;
      };
      fr.readAsDataURL(file);
    } else if (!this.actualPhotoUrl && !file) {
      this.actualPhotoUrl = this.defaultUrl;
    }
  }

  onAttributePhotoChange($event) {
    const file = $event.files[0] || null;
    if (file) {
      const fr = new FileReader();
      fr.onload = () => {
        const photoUrl = fr.result as string;
        this.store.dispatch(new replaceEquipmentActions.UpdateAttributePhoto({
          photo: file,
          photoUrl: photoUrl,
          attributeId: $event.attributeId
        }));
      };
      fr.readAsDataURL(file);
    }
  }

  onAddRegister($event) {
    this.store.dispatch(new replaceEquipmentActions.AddRegister($event));
  }

  onRemoveRegister($event) {
    this.store.dispatch(new replaceEquipmentActions.RemoveRegister($event));
  }

  onComboSettingsChange(event) {
    this.store.dispatch(new replaceEquipmentActions.ComboSettingsChange({value: event}));
  }

  onDeviceChanges($event) {
    this.store.dispatch(new replaceEquipmentActions.EquipmentTemplateChanged($event));
  }

  onRegisterFileChange($event) {
    const file = $event.files[0] || null;

    if (file) {
      this.store.dispatch(new replaceEquipmentActions.AddRegisterFile(
        {
          registerId: $event.registerId,
          file: file
        }));
    }
  }

  onRegisterScaleChange($event) {
    this.store.dispatch(new replaceEquipmentActions.ChangeRegisterScale(
      {
        index: $event.index,
        scaleId: $event.scaleId
      }));
  }

  onRegisterSequenceChange(event: CdkDragDrop<MeterRegisterViewModel[]>) {
    this.store.dispatch(new replaceEquipmentActions.ChangeRegisterSequence({
      from: event.previousIndex,
      to: event.currentIndex
    }));
  }

  onParentMeterChange($event) {
    this.store.dispatch(new replaceEquipmentActions.ChangeParentMeter($event));
  }

  // Node tariff

  onUpdateTariff($event) {
    this.store.dispatch(new replaceNodeTariffActions.UpdateTariff($event));
  }

  onToggleLineItemIsActive($event) {
    this.store.dispatch(new replaceNodeTariffActions.ToggleLineItemIsActive($event));
  }

  onUpdateLineItemCategory($event) {
    this.store.dispatch(new replaceNodeTariffActions.UpdateLineItemCategory($event));
  }

  // Replace wizard

  onNextStep($event) {
    this.store.dispatch(new replaceWizardActions.TryNextStep($event));
  }

  onCloseWizard() {
    this.onCancel();
    this.store.dispatch(new replaceWizardActions.ToggleWizard());
    if (this.isLocationWizard) {
      this.store.dispatch(new locationEquipmentActions.ReloadLocationData());
    } else {
      this.store.dispatch(new equipmentActions.RequestEquipmentList());
    }
  }

  onCancel() {
    this.activeModal.dismiss();
    this.resetForm();
  }

  resetForm() {
    this.store.dispatch(new replaceWizardActions.ResetWizard());
  }
}
