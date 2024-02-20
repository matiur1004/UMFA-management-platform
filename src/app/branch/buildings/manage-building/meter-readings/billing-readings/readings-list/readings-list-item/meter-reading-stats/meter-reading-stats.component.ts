import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  BillingReadingChartUsagesEnum,
  ColorsStatus,
  MeterReadingChartViewModel,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {
  ChartView,
  IMeterReadingStats,
  MeterReading,
  MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {
  BarChartModel,
  SingleBarConfigurations
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/bar-chart.model';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {
  LineChartModel,
  SingleLineChartConfiguration
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/line-chart.model';
import {
  DEFAULT_GROUP_CONFIG,
  IDataChart,
  LineType
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {
  ComboChartConfigurations,
  ComboChartModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/combo-chart.model';
import {ReadingSourceText} from '@models';

@Component({
  selector: 'meter-reading-stats',
  templateUrl: './meter-reading-stats.component.html',
  styleUrls: ['./meter-reading-stats.component.less']
})
export class MeterReadingStatsComponent implements OnInit {
  @Input() registers: Array<MeterReading> = [];
  @Input() isShowRegister: boolean = true;
  @Output() changeTab: EventEmitter<{ meterId: string, tabId: number }> = new EventEmitter<{ meterId: string; tabId: number }>();
  customColors: Array<IDataChart> | IDataChart;
  singleBarEnabled: boolean;
  lineType: LineType = LineType.Single;
  lineChartData = [];
  colorsStatus = ColorsStatus;
  readingStatusText = ReadingSourceText;
  comboChartData = [];
  comboChartConfigurations: ComboChartConfigurations;
  allComboData = [];
  @Output() changeChartView = new EventEmitter();
  @Output() changeRegister: EventEmitter<{ meterId: string, register: MeterReading }>
    = new EventEmitter<{ meterId: string; register: MeterReading }>();
  @Output() changeAverage: EventEmitter<{ meterId: string }> = new EventEmitter<{ meterId: string }>();
  chartView = ChartView;
  tabId: BillingReadingChartUsagesEnum = BillingReadingChartUsagesEnum.CurrentPeriod;
  billingReadingUsageEnum = BillingReadingChartUsagesEnum;
  public chartData = [];
  public isSingleBarChart: boolean;
  selectedRegister: RegisterInfoViewModel;
  public configurations: SingleBarConfigurations;
  public lineConfigurations: SingleLineChartConfiguration;
  isComboEnabled: boolean;

  private _meter: MeterReadingDetails;

  get meter(): MeterReadingDetails {
    return this._meter;
  }

  @Input() set meter(meter: MeterReadingDetails) {
    this._meter = meter;
  }

  _meterReadingStatsChart: MeterReadingChartViewModel;

  get meterReadingStatsChart(): MeterReadingChartViewModel {
    return this._meterReadingStatsChart;
  }

  @Input() set meterReadingStatsChart(meterReadingStatsChart: MeterReadingChartViewModel) {
    this._meterReadingStatsChart = Array.isArray(meterReadingStatsChart) ? meterReadingStatsChart[0] : meterReadingStatsChart;

    const meterDetails = this.meter?.meterDetails;
    if (!meterDetails || !meterDetails.meterReadingStats) {
        // Handle the case where meterDetails or meterReadingStats is undefined
        return;
    }
    const {
      register,
      averageUsage,
      chartView
    } = meterDetails.meterReadingStats;

    if (this._meterReadingStatsChart) {
      const [firstRegister] = this._meterReadingStatsChart.registersInfo;

      this.selectedRegister = !register
        ? firstRegister
        : this._meterReadingStatsChart.registersInfo
          .find(r => r.registerId === register.registerId);
    }

    const {activeTabId} = this.meter?.meterDetails.meterReadingStats;

    switch (activeTabId) {
      case this.billingReadingUsageEnum.CurrentPeriod:
        this.currentPeriod(averageUsage, chartView, meterReadingStatsChart);
        break;

      case this.billingReadingUsageEnum.YearOnYear:
        this.yearOnYear(averageUsage, chartView, meterReadingStatsChart);
        break;
    }
  }

  get meterReadingStats(): IMeterReadingStats {
    return this.meter && this.meter?.meterDetails.meterReadingStats;
  }

  onSetAverageUsage() {
    this.changeAverage.emit({meterId: this.meter?.meterDetails.meterId});
  }

  onChangeRegister(register: MeterReading) {
    this.changeRegister.emit({register, meterId: this.meter?.meterDetails.meterId});
  }

  setActiveChart(chart: ChartView) {
    this.changeChartView.emit({chartView: chart, meterId: this.meter?.meterDetails.meterId});
  }

  onChangeNav(nav: NgbNavChangeEvent) {
    
    this.changeTab.emit({meterId: this.meter?.meterDetails.meterId, tabId: nav.nextId});
  }

  //TODO: Temp solution
  ngOnInit(): void {
    let scroll = window.scrollY;
    let interval = setInterval(() => {
      if (window.scrollY < scroll) {
        window.scrollTo(0, scroll);
        clearInterval(interval);
      }
    });
  }

  readingTypeByRegId(registerId: string) {
    if (this.registers.length) {
      return this.registers.find(x => x.registerId === registerId);
    }
  }

  private createSingleBarChart(meterReadingStatsChart: MeterReadingChartViewModel) {
    const singleBarChartModel = new BarChartModel(meterReadingStatsChart.registersInfo, {
      minHeight: '450px',
      yAxis: true,
      barPadding: 40,
      showDataLabel: false,
    });

    this.configurations = singleBarChartModel.getBarConfigurations;
    this.chartData = singleBarChartModel.generateChartDataBySingleRegister(this.selectedRegister).currentPeriodStatsData;
    this.customColors = singleBarChartModel.generateChartDataBySingleRegister(this.selectedRegister).customColors;
  }

  private currentPeriod(averageUsage: boolean, chartView: ChartView, meterReadingStatsChart: MeterReadingChartViewModel) {
    if (chartView === this.chartView.BAR) {
      this.lineType = LineType.Combo_Chart;
      !averageUsage ? this.createSingleBarChart(meterReadingStatsChart) : this.createComboChart(meterReadingStatsChart, true);
      this.singleBarEnabled = !averageUsage;
      this.isComboEnabled = averageUsage;
    } else if (chartView === this.chartView.LINE) {
      this.lineType = !averageUsage ? LineType.Single : LineType.Average;
      this.createChartLine(meterReadingStatsChart);
    }
  }

  private yearOnYear(averageUsage: boolean, chartView: ChartView, meterReadingStatsChart: MeterReadingChartViewModel) {
    if (chartView === this.chartView.BAR) {
      this.lineType = LineType.Combo_Chart;
      !averageUsage ? this.createGroupBarChart(meterReadingStatsChart) : this.createComboChart(meterReadingStatsChart, false);
      this.isSingleBarChart = !averageUsage;
      this.isComboEnabled = averageUsage;
    } else if (chartView === this.chartView.LINE) {
      this.lineType = !averageUsage ? LineType.Multiple : LineType.Multiple_Average;
      this.createChartLine(meterReadingStatsChart);
    }
  }

  private createChartLine(meterReadingStatsChart: MeterReadingChartViewModel) {
    const lineChartModel = new LineChartModel(meterReadingStatsChart.registersInfo, {
      minHeight: DEFAULT_GROUP_CONFIG.minHeight,
      yAxis: true,
      showDataLabel: false,
      gradient: true,
    });

    this.lineConfigurations = lineChartModel.getLineConfigurations;
    this.lineChartData = lineChartModel.generateLineChart(this.selectedRegister, this.lineType).chartData;
    this.customColors = lineChartModel.generateLineChart(this.selectedRegister, this.lineType).customColors;
  }

  private createComboChart(meterReadingStatsChart: MeterReadingChartViewModel, isCurrPeriod: boolean) {
    const comboChart = new ComboChartModel(meterReadingStatsChart.registersInfo, {
      minHeight: DEFAULT_GROUP_CONFIG.minHeight,
      yAxis: true,
      showDataLabel: false,
      gradient: true,
    });
    this.comboChartConfigurations = comboChart.getComboConfigurations;
    this.lineChartData = comboChart.generateComboChartData(this.selectedRegister, isCurrPeriod).lineData;
    this.comboChartData = comboChart.generateComboChartData(this.selectedRegister, isCurrPeriod).chartData;
    this.allComboData = [...this.lineChartData, ...this.comboChartData];
    this.customColors = comboChart.generateComboChartData(this.selectedRegister, isCurrPeriod).customColors;
  }

  private createGroupBarChart(meterReadingStatsChart: MeterReadingChartViewModel) {
    const singleBarChartModel = new BarChartModel(meterReadingStatsChart.registersInfo, {
      minHeight: '450px',
      yAxis: true,
      barPadding: 10,
      showDataLabel: false,
    });

    this.configurations = singleBarChartModel.getBarConfigurations;
    this.chartData = singleBarChartModel.generateYearOnYearBySingleRegister(this.selectedRegister).currentPeriodStatsData;
    this.customColors = singleBarChartModel.generateYearOnYearBySingleRegister(this.selectedRegister).customColors;
  }
}
