import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  MeterListFilterParameters,
  MeterRegisterViewModel,
  MeterViewModel,
  SignalMeterVirtualRegisterDetails,
  VirtualRegisterDetail
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {getMeterName} from '@app/branch/buildings/manage-building/building-equipment/shared/store/utilities/get-meter-name-func';
import {StringExtension} from '@shared-helpers';
import {PagingOptions} from '@app/shared/models/paging-options.model';

@Component({
  selector: 'signal-meter-form',
  templateUrl: './signal-meter-form.component.html',
  styleUrls: ['./signal-meter-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignalMeterFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() selectedVirtualRegister: VirtualRegisterDetail;
  @Input() showAllErrors: boolean;
  @Input() meterId: string;
  registers: MeterRegisterViewModel[];
  @Input() equipmentUnits: Array<string>;
  @Output() updateAssignmentMeters: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onChangeSignalMeter: EventEmitter<PagingOptions<MeterListFilterParameters>> = new EventEmitter<PagingOptions<MeterListFilterParameters>>();
  signalMeterForm: SignalMeterVirtualRegisterDetails;

  constructor() {
  }

  private _equipments: MeterViewModel[];

  get equipments() {
    return this._equipments;
  }

  @Input() set equipments(equipments) {
    if (equipments) {
      this._equipments = equipments.map(eq => (
        {
          ...eq,
          name: getMeterName(eq.serialNumber, eq.supplyType)
        }));

      if (this.meterId && this._equipments.length) {
        const eqIndex = this._equipments.findIndex(eq => eq.id === this.meterId);
        this._equipments.splice(eqIndex, 1);
      }

      if (this.selectedVirtualRegister && this.equipments.length) {
        const signalMeterEq = this._equipments.find(eq => eq.id === this.selectedVirtualRegister.signalMeterConfig.signalMeterId);
        if (signalMeterEq && signalMeterEq.hasOwnProperty('registers')) {
          this.registers = signalMeterEq.registers;
        }
      }
    }
  }

  get signalMeterConfig() {
    return this.form.controls['signalMeterConfig'] as FormGroup;
  }

  ngOnInit() {
    this.setDefaultFormControls();
    this.updateAssignmentMeters.emit(true);
  }

  ngOnDestroy(): void {
    Object.keys(this.signalMeterForm).forEach(key => {
      this.form.removeControl(key);
    });
  }

  onChangeMeter(meter: MeterViewModel) {
    this.registers = this.equipments.find(eq => eq.id === meter.id).registers;
    const payload: PagingOptions<MeterListFilterParameters> = {
      requestParameters: new MeterListFilterParameters(),
      skip: 0,
      take: 30
    };

    payload.requestParameters.excludeMeterIds = [meter.id];
    this.onChangeSignalMeter.emit(payload);
    this.signalMeterConfig.controls['signalRegisterId'].setValue(null);
    this.signalMeterConfig.controls['signalRegisterId'].enable();
  }

  private isExistSelectedVR() {
    return !!this.selectedVirtualRegister;
  }

  private setDefaultFormControls() {
    if (this.isExistSelectedVR()) {
      const {name, description, signalMeterConfig} = this.selectedVirtualRegister;

      this.signalMeterForm = {
        description,
        name,
        signalMeterConfig: {
          ...signalMeterConfig
        },
      };
    } else {
      this.signalMeterForm = {
        description: '',
        name: '',
        signalMeterConfig: {
          nameOn: '',
          nameOff: '',
          descriptionOn: '',
          descriptionOff: '',
          signalMeterId: '',
          triggerValue: null,
          signalRegisterId: '',
          registerOffId: StringExtension.NewGuid(),
          registerOnId: StringExtension.NewGuid()
        },
      };
    }

    this.form.setControl('name', new FormControl(this.signalMeterForm.name, [Validators.required]));
    this.form.setControl('description', new FormControl(this.signalMeterForm.description, []));
    const group = new FormGroup({});

    Object.keys(this.signalMeterForm.signalMeterConfig).forEach(key => {
      if (key === 'triggerValue') {
        group.setControl(key, new FormControl(this.signalMeterForm.signalMeterConfig[key], [Validators.required]));
      } else {
        group.setControl(key, new FormControl(this.signalMeterForm.signalMeterConfig[key], []));
      }
    });

    this.form.setControl('signalMeterConfig', group);
    if (this.isExistSelectedVR()) {
      this.signalMeterConfig.controls['signalMeterId'].disable();
    }
    this.signalMeterConfig.controls['signalRegisterId'].disable();
  }
}
