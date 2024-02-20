import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MeterReading} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {
  BillingReadingChartUsagesEnum,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {
  BarChartModel,
  SingleBarConfigurations
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/bar-chart.model';
import {Dictionary} from '@models';

@Component({
  selector: 'reading-item-chart-view',
  templateUrl: './reading-item-chart-view.component.html',
  styleUrls: ['./reading-item-chart-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingItemChartViewComponent implements OnChanges {
  @Input() virtualRegistersReadings: Array<MeterReading>;
  @Input() registersInfo: Array<RegisterInfoViewModel>;
  @Input() registersReadings: Array<MeterReading>;
  @Output() toggleFilter: EventEmitter<MeterReading> = new EventEmitter<MeterReading>();
  customColors: { [key: string]: number };
  customVRColors: { [key: string]: number };
  public billingReadingChartEnum = BillingReadingChartUsagesEnum;
  public configurations: SingleBarConfigurations;
  public currentPeriodData: Dictionary<number>;
  public currentPeriodVRData: Dictionary<number>;
  public yearOnYearPeriodData: Dictionary<number>;
  public yearOnYearPeriodVRData: Dictionary<number>;
  _virtualRegisters: RegisterInfoViewModel[];

  _isShowVirtualRegisters: boolean;

  @Input() set isShowVirtualRegisters(vr: boolean) {
    this._isShowVirtualRegisters = vr;
    if (vr && this.virtualRegistersReadings) {
      const registersInfo = [...this.registersInfo];
      this._virtualRegisters = registersInfo.filter(r => this.virtualRegistersReadings
        .find(vr => vr.registerId === r.registerId));

      if (this.currentUsageChart === this.billingReadingChartEnum.CurrentPeriod) {
        this.createCurrentPeriodVRChart();
      }

      if (this.currentUsageChart === this.billingReadingChartEnum.YearOnYear) {
        this.createYearOnYearVRChart();
      }
    }
  };

  private _currentUsageChart: BillingReadingChartUsagesEnum;

  get currentUsageChart(): BillingReadingChartUsagesEnum {
    return this._currentUsageChart;
  }

  @Input() set currentUsageChart(currentUsageChart: BillingReadingChartUsagesEnum) {
    this._currentUsageChart = currentUsageChart;
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.registersInfo) {
      if (this.currentUsageChart === this.billingReadingChartEnum.YearOnYear) {
        this.createYearOnYearDataChart();
      }

      if (this.currentUsageChart === this.billingReadingChartEnum.CurrentPeriod) {
        this.createCurrentPeriodDataChart();
      }
    }
  }

  onToggleFilter(register: MeterReading) {
    this.toggleFilter.emit(register);
  }

  private createYearOnYearVRChart() {
    const singleBarChartModel = new BarChartModel(this._virtualRegisters, {minHeight: '150px', barPadding: 10});
    this.yearOnYearPeriodVRData = singleBarChartModel.generateYearOnYear().currentPeriodData;
    this.customVRColors = singleBarChartModel.generateYearOnYear().customColors;
  }

  private createCurrentPeriodVRChart() {
    const singleBarChartVRModel = new BarChartModel(this._virtualRegisters, {minHeight: '150px', barPadding: 20});
    this.currentPeriodVRData = singleBarChartVRModel.generateChartData().currentPeriodData;
    this.customVRColors = singleBarChartVRModel.generateChartData().customColors;
  }

  private createCurrentPeriodDataChart() {
    const singleBarChartModel = new BarChartModel(this.registersInfo, {minHeight: '150px', barPadding: 20});
    this.currentPeriodData = {...singleBarChartModel.generateChartData().currentPeriodData};
    this.configurations = singleBarChartModel.getBarConfigurations;
    this.customColors = {...singleBarChartModel.generateChartData().customColors};
  }

  private createYearOnYearDataChart() {
    const singleBarChartModel = new BarChartModel(this.registersInfo, {minHeight: '250px', barPadding: 5});
    this.yearOnYearPeriodData = {...singleBarChartModel.generateYearOnYear().currentPeriodData};
    this.customColors = {...singleBarChartModel.generateYearOnYear().customColors};
    this.configurations = singleBarChartModel.getBarConfigurations;
  }
}
