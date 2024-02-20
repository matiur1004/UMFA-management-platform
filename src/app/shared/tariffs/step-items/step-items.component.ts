import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {TariffStepRangeModel, UnitOfMeasurement} from '@models';
import {TariffStepService} from './tariff-step.service';

export const SupplierFeatureName = 'supplier';

@Component({
  selector: 'step-items',
  templateUrl: './step-items.component.html',
  styleUrls: ['./step-items.component.less']
})
export class StepItemsComponent implements OnInit {

  unitsOfMeasurement$: Observable<UnitOfMeasurement[]>;

  @Input() formState: any;
  @Input() isVersionSprecific = false;

  constructor(
    private stepService: TariffStepService
  ) {
  }

  ngOnInit() {
    this.onInitData();
  }

  onNewStepAdd(): void {
    this.stepService.tariffStepAdd(this.isVersionSprecific);
  }

  onNewRangeAdd(stepId: string): void {
    this.stepService.tariffStepRangeAdd(stepId);
  }

  onStepDelete(id: string): void {
    this.stepService.tariffStepDelete(id);
  }

  onRangeDelete(payload: { stepId: string, rangeId: string }): void {
    this.stepService.tariffStepRangeDelete(payload);
  }

  onChangeRange(payload: { rangeData: TariffStepRangeModel, stepId: string, rangeId: string }): void {
    this.stepService.tariffStepRangeChange(payload);
  }

  onInitData() {
    this.unitsOfMeasurement$ = this.stepService.getUnitsOfMeasurement();
  }

  trackByIndex(index: number) {
    return index;
  }

  togle() {
    this.formState.controls.stepsEnabled.value = !this.formState.controls.stepsEnabled.value;
  }
}
