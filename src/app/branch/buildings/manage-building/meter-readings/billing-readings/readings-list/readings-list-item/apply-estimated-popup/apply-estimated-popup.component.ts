import {EstimationData} from './../../../shared/store/reducers/billing-readings.store';
import {
  MeterRegisterDailyEstimateViewModel,
  MeterRegisterMonthlyBasedEstimateViewModel,
  MeterRegisterYearBasedEstimateViewModel,
  PeriodSummary
} from './../../../shared/models/meter-register-daily-estimate.model';
import {Component, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';
import * as fromMeterReadings from '../../../shared/store/reducers';
import {BuildingPeriodViewModel} from '../../../../../shared/models/building-period.model';
import {OptionViewModel} from '@app/shared/models/option-view.model';
import * as Constants from '../../../shared/billing-reading-constants';
import * as billingReadingsAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
import {
  BillingReadingChartUsagesEnum,
  ColorsStatus,
  MeterReadingChartViewModel,
  ReadingStatus,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {ApplyEstimatedModel} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/apply-estimated.model';
import {SingleBarConfigurations} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/bar-chart.model';
import {ApplyEstimatedOptionTypeEnum} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models/apply-estimated.model';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {ReadingSource} from '@app/shared/models';
import * as enterReadingFormActions from '../../../shared/store/actions/enter-reading-form.actions';
import {PopupConfirmRolloverComponent} from "@app/popups/popup.confirm-rollover/popup.confirm-rollover.component";

@Component({
  selector: 'apply-estimated-popup',
  templateUrl: './apply-estimated-popup.component.html',
  styleUrls: ['./apply-estimated-popup.component.less']
})
export class ApplyEstimatedPopupComponent implements OnInit, OnDestroy {
  public currentPeriodData = [];
  public configurations: SingleBarConfigurations;
  public customColors: IDataChart[] = [];
  public selectedRegister: RegisterInfoViewModel;
  destroyed$ = new Subject();
  readingStatus = ReadingStatus;
  isSubmitted = false;
  previousReading: number;
  dailyEstimates$: Observable<MeterRegisterDailyEstimateViewModel[]>;
  monthlyEstimates: MeterRegisterMonthlyBasedEstimateViewModel;
  yearOnYearEstimates: MeterRegisterYearBasedEstimateViewModel;
  selectedBuildingPeriod$: Observable<BuildingPeriodViewModel>;
  estimatedReasons$: Observable<OptionViewModel[]>;
  allEstimates$: Observable<EstimationData>;
  periodDuration: number;
  dialCount: number;
  currentReadingDate: Date;
  minReadingDate: Date;
  readingConsecutiveCounter: Observable<number>;
  monthlyEstimatedSelectedPeriods: string[];
  consecutiveEstimatedLimit = Constants.CONSECUTIVE_ESTIMATED_LIMIT;
  applyEstimatedOptionTypeEnum = ApplyEstimatedOptionTypeEnum;
  estimatedReadingExists: boolean;
  @Input() registerId: string;
  @Input() meterId: string;
  @Input() readingDate;
  rDate: any;
  form: FormGroup;
  // Estimated reading reason with value 'Other'
  private readonly ESTIMATED_REASON_OTHER = 'Other';
  private dailyBasedEstimates: MeterRegisterDailyEstimateViewModel[];
  private estimatedReading: number;
  private isRollover?: boolean;

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private renderer: Renderer2,
              private modalService: NgbModal,
              private store: Store<fromMeterReadings.State>) {
    this.allEstimates$ = store.select(fromMeterReadings.getEstimates)
      .pipe(takeUntil(this.destroyed$));

    this.dailyEstimates$ = this.allEstimates$.pipe(takeUntil(this.destroyed$), map(estimateOptions => {
      return estimateOptions?.dailyBasedEstimates && estimateOptions.dailyBasedEstimates
        .map((o, ind) => {
          return {...o, optionId: `${this.applyEstimatedOptionTypeEnum.DAILY}${ind}`};
        });
    }));

    this.allEstimates$.pipe(takeUntil(this.destroyed$)).subscribe(estimate => {
      if (!estimate) {
        return;
      }

      this.dailyBasedEstimates = estimate.dailyBasedEstimates;
      this.dialCount = estimate.dialCount;

      if (estimate.yearBasedEstimates) {
        this.yearOnYearEstimates = {...estimate.yearBasedEstimates, optionId: this.applyEstimatedOptionTypeEnum.YEARLY};
      }

      if (estimate.monthlyBasedEstimates) {
        this.monthlyEstimatedSelectedPeriods = estimate.monthlyBasedEstimates.periods.map(t => t.periodId);
        this.monthlyEstimates = {
          ...estimate.monthlyBasedEstimates,
          optionId: this.applyEstimatedOptionTypeEnum.MONTHLY
        };
      }

      if (estimate.periodDuration) {
        this.periodDuration = estimate.periodDuration;
      }

      this.currentReadingDate = this.readingDate !== undefined ? this.readingDate : estimate.currentBpEndDate;
      this.minReadingDate = estimate.currentBpStartDate;

      const endDate = new Date(estimate.currentBpEndDate);
      this.store.dispatch(new enterReadingFormActions.RequestReadingsForDate({
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate(),
        readingSource: ReadingSource.Estimate
      }));
    });

    this.estimatedReasons$ = store.select(fromMeterReadings.getEstimatedReasons);

    store.select(fromMeterReadings.getPreviousReadingForEstimates)
      .pipe(takeUntil(this.destroyed$)).subscribe((val) => this.previousReading = val);
    this.selectedBuildingPeriod$ = store.select(fromMeterReadings.getSelectedBuildingPeriod);

    this.setEstimatedReadingExistingStatus();
  }

  get estimationOption() {
    return this.form.get('estimationOption');
  }

  get estimateReason() {
    return this.form.controls.reason;
  }

  get customEstimatedUsage() {
    if (this.estimationOption.value !== 'custom' || this.customEstimatedValue.invalid) {
      this.isRollover = null;
      return null;
    }

    if (this.isRollover) {
      return this.doRollover(Number(this.customEstimatedValue.value), this.previousReading, this.dialCount);
    }
    return Number(this.customEstimatedValue.value) - this.previousReading;
  }

  get customEstimatedValue() {
    return this.form.get('customEstimatedValue');
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      estimationOption: [null, [Validators.required]],
      customEstimatedValue: [{value: '', disabled: true}, [Validators.required]],
      reason: [null, [Validators.required]],
      notes: ['']
    });

    if (this.readingDate != undefined) {
      this.rDate = this.readingDate;
    }

    this.store.pipe(select(fromMeterReadings.getMeterReadingChart)).pipe(takeUntil(this.destroyed$))
      .subscribe(readings => {
        if (readings.length) {
          const selectedRegister = this.getSelectedRegister(readings);
          this.onCreateApplyEstimatedChart(selectedRegister);
          this.selectedRegister = {...selectedRegister};
        }

      });

    this.store.dispatch(new billingReadingsAction.GetMeterReadingsChart({
      chartUsage: BillingReadingChartUsagesEnum.YearOnYear,
      isCall: false
    }));

    this.store.select(fromMeterReadings.getSelectedEstimatedReason)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(reason => this.form.controls.reason.setValue(reason));

    this.estimateReason.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((estimatedReasonVal: OptionViewModel) => {
      if (estimatedReasonVal) {
        if (estimatedReasonVal.name === this.ESTIMATED_REASON_OTHER) {
          this.form.controls.notes.setValidators(Validators.required);
        } else {
          this.form.controls.notes.clearValidators();
        }

        this.form.controls.notes.updateValueAndValidity();
      }

    });

    this.estimationOption.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((estimationOption: string) => {
      switch (estimationOption) {
        case this.applyEstimatedOptionTypeEnum.CUSTOM:
          this.estimatedReading = this.form.value.customEstimatedValue;
          const customOptionModel = {
            estimatedUsage: this.customEstimatedUsage
          };
          this.updateChartData(customOptionModel);
          break;

        case this.applyEstimatedOptionTypeEnum.MONTHLY:
          this.estimatedReading = this.monthlyEstimates.estimatedReading;
          this.updateChartData(this.monthlyEstimates);

          break;
        case this.applyEstimatedOptionTypeEnum.YEARLY:
          this.estimatedReading = this.yearOnYearEstimates.estimatedReading;
          this.updateChartData(this.yearOnYearEstimates);
          break;

        // Daily
        default:
          const idx = +estimationOption.replace(this.applyEstimatedOptionTypeEnum.DAILY, '');
          this.estimatedReading = this.dailyBasedEstimates[idx].estimatedReading;
          this.updateChartData(this.dailyBasedEstimates, idx);
          break;
      }

      if (estimationOption === this.applyEstimatedOptionTypeEnum.CUSTOM) {
        this.customEstimatedValue.enable();
      } else {
        this.customEstimatedValue.disable();
      }
      this.customEstimatedValue.updateValueAndValidity();
    });

    this.readingConsecutiveCounter = this.store.pipe(
      select(fromMeterReadings.getConsecutiveEstimatedCounter, {meterId: this.meterId, registerId: this.registerId})
    );
  }

  onChangeChecked(event: MouseEvent) {
    if (this.customEstimatedValue.disabled) {
      this.renderer.setAttribute(event.currentTarget, 'checked', 'true');
      return;
    }
    this.renderer.setAttribute(event.currentTarget, 'checked', 'false');
  }

  onClose() {
    this.activeModal.dismiss();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onApply() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      return;
    }

    this.activeModal.close({
      value: this.estimatedReading,
      notes: this.form.value.notes,
      reason: this.estimateReason.value.id,
      isRollover: this.isRollover
    });
  }

  monthlyEstimatedNumberOfPeriodsChange(value: number) {
    const selectedPeriods = this.monthlyEstimates.periods.slice(0, value);

    this.monthlyEstimatedSelectedPeriods = selectedPeriods.map(t => t.periodId);
    this.monthlyEstimates = this.getMonthlyEstimate(selectedPeriods);

    this.updateChartData(this.monthlyEstimates);
  }

  monthlyEstimaterPeriodsSelectionChange(selectedPeriodsIds: string[]) {
    const selectedPeriods = this.monthlyEstimates.periods.filter(t => selectedPeriodsIds.includes(t.periodId));

    this.monthlyEstimates = this.getMonthlyEstimate(selectedPeriods);
    this.updateChartData(this.monthlyEstimates);
  }

  onChangeCustomEstimate(): void {
    this.estimatedReading = this.form.value.customEstimatedValue;

    const customOptionModel = {
      estimatedUsage: this.customEstimatedUsage
    };

    this.updateChartData(customOptionModel);
  }

  onBlurCustomEstimate(): void {
    if (this.customEstimatedUsage < 0 && this.isRollover == null) {
      let modalRef = this.modalService.open(PopupConfirmRolloverComponent, {
        backdrop: 'static',
        windowClass: 'confirm-dialog-modal'
      });

      modalRef.result.then(
        () => {
          this.isRollover = true;
        },
        () => this.isRollover = false
      );
    }
  }

  private doRollover(currentReading: number, previousReading: number, dialCount: number) {
    let dialStr = '';
    for (let i = 0; i < dialCount; i++) {
      dialStr += '9';
    }

    let dilNumber = +dialStr;

    let usage = currentReading + dilNumber - previousReading;

    return usage.toFixed(5);
  }

  private setEstimatedReadingExistingStatus() {
    this.store.select(fromMeterReadings.getReadingsForDate)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(readings => {
        if (!readings || !readings.map(r => r.meterId).includes(this.meterId)) {
          this.estimatedReadingExists = false;
          return;
        }

        const registersIds = readings.find(r => r.meterId === this.meterId).registersIds;

        if (registersIds.includes(this.registerId)) {
          this.estimatedReadingExists = true;
        }
      });
  }

  private getSelectedRegister(readings: MeterReadingChartViewModel[]) {
    return readings.find(r => r.meterId === this.meterId).registersInfo
      .find(r => r.registerId === this.registerId);
  }

  private getMonthlyEstimate(selectedPeriods: PeriodSummary[]) {
    const sumDays = selectedPeriods.map(t => t.days).reduce((prev, curr) => curr + prev, 0);
    const sumUsage = selectedPeriods.map(t => t.usage).reduce((prev, curr) => curr + prev, 0);
    const dailyUsage = sumUsage / sumDays;
    const estimatedReading = (dailyUsage * this.periodDuration) + this.monthlyEstimates.openingReading;
    const estimatedUsage = estimatedReading - this.monthlyEstimates.openingReading;

    return {
      ...this.monthlyEstimates,
      periodsNumber: selectedPeriods.length,
      usage: sumUsage || 0,
      dailyUsage: dailyUsage || 0,
      durationDays: sumDays,
      estimatedUsage: estimatedUsage || 0,
      estimatedReading: estimatedReading || 0
    };
  }

  private onCreateApplyEstimatedChart(register: RegisterInfoViewModel): void {
    const singleBarChartModel = new ApplyEstimatedModel({minHeight: '150px', barPadding: 10, yAxis: true});
    this.currentPeriodData = singleBarChartModel.generateApplyEstimatedChartData(register).currentPeriodStatsData;
    this.customColors = singleBarChartModel.generateApplyEstimatedChartData(register).customColors;
    this.configurations = singleBarChartModel.getBarConfigurations;
  }

  private updateChartData(model: any, idx?: number) {
    let usage;

    usage = (idx || idx === 0) ? (model[idx].estimatedUsage || 0) : (model.estimatedUsage || model.averageUsage);

    if (usage === undefined) {
      return;
    }

    const lastElement = this.currentPeriodData[this.currentPeriodData.length - 1];
    const lastElementIdx = this.currentPeriodData.length - 1;
    const customColorLength = this.customColors.length;
    this.currentPeriodData.splice(lastElementIdx, 1);

    this.currentPeriodData = [...this.currentPeriodData, {...lastElement, value: usage}];
    this.customColors[customColorLength - 1] = {
      ...this.customColors[customColorLength - 1],
      value: ColorsStatus[this.readingStatus.Custom]
    };

    // update for the last reading usage
    const lastReadingIdx = this.selectedRegister.readingsInfo.length - 1;
    this.selectedRegister.readingsInfo[lastReadingIdx].currentReadingUsage = {
      ...this.selectedRegister.readingsInfo[lastReadingIdx].currentReadingUsage,
      usage: usage
    };

  }
}
