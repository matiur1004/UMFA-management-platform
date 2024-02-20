import {Component, Input, ViewChild} from '@angular/core';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel,
  usagesText
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {SingleLineChartConfiguration} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/line-chart.model';
import {
  abnormalityLevel,
  calculateReadingByUsage,
  percentUsage,
  periodName
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/reading.calulcation.helper';
import {
  IDataChart,
  LineType
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';

@Component({
  selector: 'linear-chart',
  templateUrl: './linear-chart.component.html',
  styleUrls: ['./linear-chart.component.less']
})
export class LinearChartComponent {
  @Input() registerInfo: RegisterInfoViewModel;
  @Input() isYearOnYearLineBar: boolean = false;
  @Input() customColors: IDataChart[];
  @Input() lineType: LineType;
  @Input() configurations: SingleLineChartConfiguration;
  @Input() data: Array<{ name: string; value: number }>;
  @ViewChild('chart') chart: any;
  selectedColor: IDataChart[];
  selectedReadingInfo: ReadingInfoViewModel;
  trendUpValue = 20;
  trendDownValue = -20;
  averageReading: ReadingInfoViewModel;

  constructor() {
  }

  get readingUsage(): number {
    const reading = this.selectedReadingInfo && this.selectedReadingInfo;

    return reading.currentReadingUsage.usage;
  }

  get previousUsage(): number {
    const reading = this.selectedReadingInfo && this.selectedReadingInfo;

    return reading.previousReadingUsage.usage;
  }

  get averageUsage(): number {
    return this.selectedReadingInfo.currentReadingUsage.averageUsage;
  }

  get previousReadingDate() {
    return this.selectedReadingInfo.previousReadingUsage.readingDate;
  }

  get readingDate(): Date {
    return this.selectedReadingInfo.currentReadingUsage.readingDate;
  }

  percentUsage(usage: number, prevUsage: number) {
    const reading = this.selectedReadingInfo && this.selectedReadingInfo;

    return percentUsage(usage, prevUsage);
  }

  calculateReadingByUsage(usage: number, prevUsage: number) {
    const reading = this.selectedReadingInfo && this.selectedReadingInfo;

    return calculateReadingByUsage(usage, prevUsage);
  }

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  periodName(model: { name: string, value: number, series: string }) {
    this.getReadingInfoViewModel(model);
    return this.selectedReadingInfo && this.selectedReadingInfo.currentReadingUsage.periodName;
  }

  hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  abnormalityLevel(usage: number, previousUsage: number) {
    return abnormalityLevel(usage, previousUsage);
  }

  private getReadingInfoViewModel(model: { name: string; value: number; series: string }) {
    this.selectedColor = this.customColors.filter(color => color.name.includes(model.name));
    // for average
    this.selectedReadingInfo = this.registerInfo.readingsInfo.find(rInfo => {
      this.checkIfAverageExist(model);
      if (model.name !== model.series) {
        const rPeriod = periodName(rInfo.currentReadingUsage.periodName);
        const graphPeriod = periodName(model.name);
        return rPeriod === graphPeriod;
      }
      return periodName(rInfo.currentReadingUsage.periodName) === model.name;
    });
  }

  private checkIfAverageExist(model: { name: string; value: number; series: string }) {
    const [_, avgUsg] = usagesText;

    if (this.data.some(d => d.name === avgUsg)) {
      const idx = this.registerInfo.readingsInfo.findIndex(r => periodName(r.currentReadingUsage.periodName) === model.name);
      const avg = this.registerInfo.readingsInfo[idx];
      this.averageReading = {...avg};
    }
  }
}
