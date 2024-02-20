import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {FormGroupState, MarkAsSubmittedAction, ResetAction, SetValueAction} from 'ngrx-forms';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {InitState} from '../../../shared/store/reducers/registers-form.store';
import * as fromRegisters from '../../../shared/store/reducers';
import * as registersFormActions from '../../../shared/store/actions/registers-form.actions';
import {getUnitsOfMeasurement} from 'app/admin/shared/common-data/store/selectors';
import * as fromAdminCommonData from 'app/admin/shared/common-data/store/reducers';
import {EquipmentService} from '@services';
import {
  DropdownItem,
  RegisterEditViewModel,
  RegisterTypeDropdownItems,
  SupplyType,
  TimeOfUse,
  TimeOfUseMap,
  TimeOfUseName,
  ObisCodeViewModel
} from '@models';
import { Image } from 'konva/types/shapes/Image';

@Component({
  selector: 'app-register-settings',
  templateUrl: './register-settings.component.html',
  styleUrls: ['./register-settings.component.less']
})
export class RegisterSettingsComponent implements OnInit, OnDestroy {

  @Input() model: RegisterEditViewModel = {} as RegisterEditViewModel;

  destroyed = new Subject();
  formState: any;

  formState$: Observable<FormGroupState<any>>;
  unitsOfMeasurement: any[];
  isNew: boolean;
  selectedIcon: string = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
  selectedIconAlt = "Cumulative";
  formValue: RegisterEditViewModel;
  supplyType = SupplyType;
  supplyTypes: any[] = [
    {id: SupplyType.Electricity, name: SupplyType[SupplyType.Electricity]},
    {id: SupplyType.Water, name: SupplyType[SupplyType.Water]},
    {id: SupplyType.Sewerage, name: SupplyType[SupplyType.Sewerage]},
    {id: SupplyType.Gas, name: SupplyType[SupplyType.Gas]},
    {id: SupplyType.AdHoc, name: SupplyType[SupplyType.AdHoc]}
  ];
  registerTypes: any[] = RegisterTypeDropdownItems;

  obisCodes: ObisCodeViewModel[]= new Array<ObisCodeViewModel>();
  touItems = this.getTouItems();
  constructor(public activeModal: NgbActiveModal,
              private store$: Store<fromRegisters.State>,
              private commonDataStore$: Store<fromAdminCommonData.State>,
              private equipmentService: EquipmentService) {
    this.formState$ = store$.pipe(select(fromRegisters.getForm));
    this.commonDataStore$.pipe(select(getUnitsOfMeasurement))
      .subscribe(units => this.unitsOfMeasurement = units.map(unit => ({
        unitOfMeasurementType: unit.unitType,
        unitOfMeasurementName: unit.defaultName
      })));
  }

  changeIcon() {
    switch (this.formValue.registerType) {
      case 0: //cumulative
        this.selectedIcon = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
        this.selectedIconAlt = "Cumulative";
        break;
      case 1: //resetted max
        this.selectedIcon = "../../../../../../assets/images/icons/equipment/registerTypes/resetted-max.svg";
        this.selectedIconAlt = "Resetted Max";
        break;
      case 2: //resetted
        this.selectedIcon = "../../../../../../assets/images/icons/equipment/registerTypes/resetted.svg";
        this.selectedIconAlt = "Resetted";
        break;
    }
  };

  ngOnInit() {
    this.store$.select(fromRegisters.getIsNew).pipe(takeUntil(this.destroyed)).subscribe(isNew => {
      this.isNew = isNew;
    });
    this.store$.pipe(select(fromRegisters.getFormState)).pipe(takeUntil(this.destroyed)).subscribe(value => {
      this.formValue = value.formState.value;
      this.formState = value.formState;
    });
    console.log(this.model);
    if (this.model.name) {
      this.store$.dispatch(new registersFormActions.RegisterInitForEdit({model: this.model}));
    } else {
      this.store$.dispatch(new registersFormActions.RegisterInitForCreate());
    }
    this.equipmentService.getAllObisCodes('').subscribe((response) => {
    this.obisCodes = response;
    });
    this.changeIcon();
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  addRegister() {
    this.store$.dispatch(new registersFormActions.RegisterAdd());
  }

  // #region SupplyTypes
  selectSupplyType(event) {
    this.store$.dispatch(new registersFormActions.RegisterAddSupplyType({
      type: event.id
    }));
  }

  deleteSupplyType(event) {
    this.store$.dispatch(new registersFormActions.RegisterRemoveSupplyType({
      type: event.value.id
    }));
  }

  // #endregion

  // #region TOU

  getTouItems(): DropdownItem[] {
    const unusedTous: DropdownItem[] = [];
    Object.values(TimeOfUseMap).forEach(val => {
      unusedTous.push({label: TimeOfUseName[val], value: val});
    });
    return unusedTous;
  }

  changeTOU(tou: TimeOfUse) {
    this.store$.dispatch(new registersFormActions.RegisterEditTou({timeOfUse: tou}));
  }

  // #endregion

  save() {
    this.store$.dispatch(new MarkAsSubmittedAction(InitState.id));
    if (Object.keys(this.formState.errors).length > 0) {
      return;
    }
    if (this.isNew) {
      this.store$.dispatch(new registersFormActions.RegisterCreate({modal: this.activeModal}));
    } else {
      this.store$.dispatch(new registersFormActions.RegisterUpdate({modal: this.activeModal}));
    }
  }

  dismiss() {
    this.reset();
    this.activeModal.dismiss();
  }

  reset() {
    this.store$.dispatch(new SetValueAction(InitState.id, InitState.value));
    this.store$.dispatch(new ResetAction(InitState.id));
  }

  trackById(index, item) {
    return index;
  }
}
