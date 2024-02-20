import {DateMediumFormatPipe} from '@app/shared/pipes/date-medium.pipe';
import {Component, OnInit, Input} from '@angular/core';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {
  abnormalityLevel,
  calculateReadingByUsage,
  percentUsage
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/reading.calulcation.helper';

@Component({
  selector: 'base-tooltip',
  template: ``
})
export class BaseTooltipComponent implements OnInit {
  @Input() public registerInfo: RegisterInfoViewModel;
  @Input() public selectedReadingInfo: ReadingInfoViewModel;
  public readonly trendUpValue = 20;
  public readonly trendDownValue = -20;
  public selectedColor: IDataChart[] = [];
  // public selectedReadingInfo: ReadingInfoViewModel;

  constructor(public dateMediumFormatPipe: DateMediumFormatPipe) {
  }

  get usage(): number {
    return this.selectedReadingInfo && this.selectedReadingInfo.currentReadingUsage.usage;
  }

  get averageUsage(): number {
    return this.selectedReadingInfo.currentReadingUsage.averageUsage;
  }

  get previousUsage(): number {
    return this.selectedReadingInfo && this.selectedReadingInfo.previousReadingUsage.usage;
  }

  get previousReadingDate() {
    return this.selectedReadingInfo.previousReadingUsage.readingDate;
  }

  get periodName(): string {
    return this.selectedReadingInfo.currentReadingUsage.periodName;
  }

  get readingDate() {
    return this.selectedReadingInfo.currentReadingUsage.readingDate;
  }

  get periodsDuration(): string {
    const daysPart = 'Days';
    return `Periods: ${this.selectedReadingInfo.previousReadingUsage.periodDurationDays} ${daysPart} / ${this.selectedReadingInfo.currentReadingUsage.periodDurationDays} ${daysPart}`
  }

  get periodsDates(): string {
    const previousPeriodDatesPlaceHolder = '{0}';
    const currentPeriodDatesPlaceHolder = '{1}';

    let result = `(${previousPeriodDatesPlaceHolder} / ${currentPeriodDatesPlaceHolder})`;

    result = result.replace(previousPeriodDatesPlaceHolder, this.getPeriodDateRange(this.selectedReadingInfo.previousReadingUsage));
    result = result.replace(currentPeriodDatesPlaceHolder, this.getPeriodDateRange(this.selectedReadingInfo.currentReadingUsage));

    return result;
  }

  calculateReadingByUsage(usage: number, averageUsage: number) {
    return calculateReadingByUsage(usage, averageUsage);
  }

  abnormalityLevel(usage: number, previousUsage: number) {
    return abnormalityLevel(usage, previousUsage);
  }

  percentUsage(usage: number, averageUsage: number) {
    return percentUsage(usage, averageUsage);
  }

  ngOnInit(): void {
  }

  getPeriodDateRange(readingUsageViewModel): string {
    if (readingUsageViewModel.isPeriodPredefined) {
      return '-';
    }

    return `${this.getFormattedDate(readingUsageViewModel.periodStartDate)} - ${this.getFormattedDate(readingUsageViewModel.periodEndDate)}`
  }

  getFormattedDate(value: string | Date): string {
    return this.dateMediumFormatPipe.transform(value)
  }
}
