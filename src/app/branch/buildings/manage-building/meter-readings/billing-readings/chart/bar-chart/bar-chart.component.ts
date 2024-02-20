import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {SingleBarConfigurations} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/bar-chart.model';
import {periodName} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/reading.calulcation.helper';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {ReadingSourceText} from '@models';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarChartComponent {
  @Input() registerInfo: RegisterInfoViewModel;
  @Input() isYearOnYearBar: boolean = false;
  @Input() isStats: boolean = false;
  @Input() customColors: IDataChart[];
  @Input() configurations: SingleBarConfigurations;
  @Input() data: Array<IDataChart>;
  trendUpValue = 20;
  trendDownValue = -20;
  selectedReadingInfo: ReadingInfoViewModel;
  selectedColor: IDataChart[] = [];
  dataLabelFn = this.getDataLabel.bind(this);
  readingStatusText = ReadingSourceText;
  private readonly abbr = ['', 'K', 'M', 'B', 'T'];

  private static compareSelectedReading(period: string, graphPeriod: string) {
    return period === graphPeriod;
  }

  onSelectGroupItem(data): void {
    this.selectedReadingInfo = this.registerInfo.readingsInfo.find(rInfo => {
      let graphName = data.value.name;
      const isGroup = this.hasNumber(graphName) || graphName.includes('Av');

      // Current Period
      if (!this.isYearOnYearBar) {
        let rPeriod = periodName(rInfo.currentReadingUsage.periodName);
        this.selectedColor = this.customColors.filter(color => color.name === rPeriod);
        const graphPeriod = isGroup ? periodName(graphName) : graphName;

        return graphPeriod === rPeriod;
      }
      // Average, Prev, Current Year's
      if (isGroup) {
        const rPeriod = periodName(rInfo.currentReadingUsage.periodName);
        this.selectedColor = this.customColors.filter(color => color.name.includes(rPeriod));
        const graphPeriod = periodName(graphName);

        return BarChartComponent.compareSelectedReading(graphPeriod, rPeriod);
      } else {
        const rPeriod = periodName(rInfo.currentReadingUsage.periodName);
        this.selectedColor = this.customColors.filter(color => color.name.includes(rPeriod));

        return BarChartComponent.compareSelectedReading(graphName, rPeriod);
      }
    });
  }

  hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  formatUsage(usage) {
    let n = 0;
    while (usage > 1000) {
      usage /= 1000;
      n++;
    }
    return +usage.toFixed(1) + (this.abbr[n] || '');

  }

  getDataLabel(value: number) {
    if (!value) {
      return ''
    }
    const val = value.toString().length;
    if (val >= 6) {
      return this.formatUsage(value);
    }
    return value;
  }
}
