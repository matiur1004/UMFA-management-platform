import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {FormGroupState} from 'ngrx-forms';
import {numberMask} from '@shared-helpers';
import {
  InfinityRange,
  TariffStepApplyPerTypeTextList,
  TariffStepModel,
  TariffStepRangeModel,
  TariffStepType,
  UnitOfMeasurement
} from '@models';

const stepApplyTypeDescription = {
  [TariffStepType.Day]: 'Step ranges will be multiplied by period duration in days',
  [TariffStepType.DayWithMonthRanges]: 'Step ranges will be multiplied by 12/365.25 and by period duration in days',
  [TariffStepType.Month]: 'Step ranges will be applied as provided'
};

@Component({
  selector: 'step-item',
  templateUrl: './step-item.component.html',
  styleUrls: ['./step-item.component.less']
})
export class StepItemComponent implements OnInit {

  numberMask = numberMask({allowNegative: true});
  InfinityRange = InfinityRange;

  stepTypeOptions = Object.keys(TariffStepType).filter(k => isNaN(TariffStepType[k])).map(t => ({
    value: +t,
    label: TariffStepApplyPerTypeTextList[t],
    description: stepApplyTypeDescription[t]
  }));

  @Input() step: FormGroupState<TariffStepModel>;
  @Input() stepIndex: number;
  @Input() units: UnitOfMeasurement[];

  @Output() newStepAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() stepDeleted: EventEmitter<string> = new EventEmitter<string>();
  @Output() newRangeAdded: EventEmitter<string> = new EventEmitter<string>();
  @Output() rangeDeleted: EventEmitter<{ stepId: string, rangeId: string }> = new EventEmitter<{ stepId: string, rangeId: string }>();
  @Output() rangeChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  onDeleteStep(id: string): void {
    this.stepDeleted.emit(id);
  }

  onDeleteRange(stepId: string, rangeId: string): void {
    this.rangeDeleted.emit({stepId, rangeId});
  }

  onAddNewStep(): void {
    this.newStepAdded.emit();
  }

  onAddNewRange(stepId: string): void {
    this.newRangeAdded.emit(stepId);
  }

  onSetInfinity(
    range: string,
    currentRange: TariffStepRangeModel,
    newValue: number | string,
    stepId: string,
    rangeId: string
  ): void {
    const value = currentRange[range] === newValue ? null : newValue;
    this.onSetValueRange(range, currentRange, value, stepId, rangeId);
  }

  onSetValueRange(range: string, currentRange: TariffStepRangeModel, newValue: number | string, stepId: string, rangeId: string): void {
    const rangeData = {...currentRange};
    rangeData[range] = newValue;
    this.rangeChanged.emit({rangeData, stepId, rangeId});
  }

  isLastInfinity(ranges: TariffStepRangeModel[]): boolean {
    return ranges.length > 0 ? (ranges[ranges.length - 1].to === InfinityRange.MAX) : true;
  }

  showInfinity(
    range: string,
    ranges: TariffStepRangeModel[],
    currentRange: TariffStepRangeModel
  ): boolean {
    switch (range) {
      case 'from': {
        return ranges.indexOf(currentRange) === 0;
      }
      case 'to': {
        return ranges.lastIndexOf(currentRange) + 1 === ranges.length;
      }
      default: {
        return false;
      }
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
