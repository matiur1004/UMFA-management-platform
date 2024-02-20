import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UnitOfMeasurement} from '@models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {StringExtension} from '@shared-helpers';
import {Observable, Subject, Subscription} from 'rxjs';
import {
  AssignedVirtualRegister,
  MeterListFilterParameters,
  MeterViewModel,
  SignalMeterAssignmentConfig,
  VirtualRegisterType,
  vrTypes
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {map} from 'rxjs/operators';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import * as equipmentActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/equipment.actions';
import {select, Store} from '@ngrx/store';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';

@Component({
  selector: 'app-popup.create-virtual-register',
  templateUrl: './popup.create-virtual-register.component.html',
  styleUrls: ['./popup.create-virtual-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupCreateVirtualRegisterComponent implements OnInit, OnDestroy {
  createVrForm: FormGroup;
  unitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  equipmentList$: Observable<MeterViewModel[]>;
  defaultRegister$: Observable<any>;
  showAllErrors: boolean;
  meterId: string;
  VirtualRegister = VirtualRegisterType;
  virtualRegisterType: VirtualRegisterType = VirtualRegisterType.MeterTotal;
  submitNotify = new Subject<any>();
  vrTypes = vrTypes;
  private createVRFormSub: Subscription;
  private registerId: string;
  private defaultRegisterSub: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private store: Store<fromEquipment.State>,
  ) {
    this.equipmentList$ = store.pipe(select(fromEquipment.getEquipmentList));

  }

  ngOnInit() {
    this.defaultRegisterSub = this.defaultRegister$.pipe(map(register => register.id)).subscribe(registerId => this.registerId = registerId);
    this.createVrForm = this.fb.group({
      type: this.fb.control(0, [Validators.required])
    });

    this.createVRFormSub = this.createVrForm.controls['type'].valueChanges.subscribe(type => this.checkFormTypeValue(type));

  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onSave() {
    if (this.createVrForm.invalid) {
      this.showAllErrors = true;
      return;
    }

    this.submitNotify.next();

    const vr: AssignedVirtualRegister = {
      ...this.createVrForm.getRawValue(),
      useForBilling: true,
      isExpanded: false,
      sequenceNumber: 0,
      id: StringExtension.NewGuid(),
      bulkRegisters: []
    };

    if (vr.type === VirtualRegisterType.MeterTotal) {
      vr.meterTotalAssignment = {assignedRegisters: []};
    } else if (vr.type === VirtualRegisterType.SignalMeter) {
      vr.signalMeterAssignment = <SignalMeterAssignmentConfig>{targetRegisterId: this.registerId ? this.registerId : null};
    }

    this.activeModal.close(vr);
  }

  ngOnDestroy(): void {
    if (this.createVRFormSub) {
      this.createVRFormSub.unsubscribe();
    }
  }

  requestEquipmentsFormSignalMeter() {
    const payload: PagingOptions<MeterListFilterParameters> = {
      requestParameters: new MeterListFilterParameters(),
      skip: 0,
      take: 0
    };

    if (this.createVrForm.controls['type'].value === VirtualRegisterType.SignalMeter) {
      payload.requestParameters.onlyAMRSource = true;
    }
    this.store.dispatch(new equipmentActions.RequestEquipmentList(payload));
  }

  private checkFormTypeValue(type: number) {
    switch (type) {
      case VirtualRegisterType.MeterTotal:
        this.virtualRegisterType = VirtualRegisterType.MeterTotal;
        break;

      case VirtualRegisterType.SignalMeter:
        this.virtualRegisterType = VirtualRegisterType.SignalMeter;
        this.requestEquipmentsFormSignalMeter();
        break;

      default:
        this.virtualRegisterType = VirtualRegisterType.MeterTotal;
        break;
    }
  }
}
