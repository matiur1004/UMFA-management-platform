import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  BaseVirtualRegisterForm,
  VirtualRegisterDetail
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {UnitOfMeasurement} from '@models';

@Component({
  selector: 'meter-total-form',
  templateUrl: './meter-total-form.component.html',
  styleUrls: ['./meter-total-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeterTotalFormComponent implements OnInit, OnDestroy {
  @Input() selectedVirtualRegister: VirtualRegisterDetail;
  @Input() form: FormGroup;
  @Input() showAllErrors: boolean;
  @Output() updateAssignmentMeters: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() unitsOfMeasurement: UnitOfMeasurement[];
  meterTotalForm: BaseVirtualRegisterForm;

  constructor() {
  }

  ngOnInit(): void {
    this.setDefaultFormControls();
    this.updateAssignmentMeters.emit(true);
  }

  onUnitOfMeasurementChange() {
    this.updateAssignmentMeters.emit(true);
  }

  ngOnDestroy(): void {
    Object.keys(this.meterTotalForm).forEach(key => {
      this.form.removeControl(key);
    });
  }

  private isExistSelectedVR() {
    return !!this.selectedVirtualRegister;
  }

  private setDefaultFormControls() {

    if (this.isExistSelectedVR()) {
      const {description, unitOfMeasurement, name} = this.selectedVirtualRegister;
      this.meterTotalForm = {
        name: name,
        description: description,
        unitOfMeasurement: unitOfMeasurement
      };
    } else {
      this.meterTotalForm = {
        name: '',
        description: '',
        unitOfMeasurement: this.unitsOfMeasurement[0].unitType
      };
    }

    Object.keys(this.meterTotalForm).forEach(key => {
      this.form.setControl(key, new FormControl(this.meterTotalForm[key], key === 'name' ? [Validators.required] : []));
    });

    if (this.isExistSelectedVR()) {
      this.form.controls.unitOfMeasurement.disable();
    }
  }
}
