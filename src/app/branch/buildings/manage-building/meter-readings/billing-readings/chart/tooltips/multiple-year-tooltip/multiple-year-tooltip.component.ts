import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel,
  usagesText
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {
  abnormalityLevel,
  calculateReadingByUsage,
  percentUsage,
  periodName
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/reading.calulcation.helper';

@Component({
  selector: 'multiple-year-tooltip-template',
  template: `
    <div class="custom-tooltip-wrapper enter-reading-modal">
      <div class="row">
        <div class="col">
          {{getData(model)}}
          <h3 *ngIf="isPrevYear"
              class="d-inline-block">{{periodName() | dateReadingFormat:readingDate:false:previousReadingDate}}</h3>
          <h3 *ngIf="!isPrevYear" class="d-inline-block">{{periodName() | dateReadingFormat:readingDate}}</h3>
        </div>
        <div class="col text-right">
          <div class="custom-tooltip-wrapper__right d-inline-block">
            <button type="button" class="dnm-btn rdng-list-btn"
                    [ngClass]="{'trend-up-icon' : abnormalityLevel(readingUsage, previousUsage) >= trendUpValue,
                              'trend-down-icon' : abnormalityLevel(readingUsage, previousUsage) <= trendDownValue}"
            ></button>
            <span>{{calculateReadingByUsage(readingUsage, previousUsage)}} {{registerInfo.registerId | registerUnit | async}}
              / {{percentUsage(readingUsage, previousUsage)}} %
              </span>
          </div>
        </div>
      </div>
      <div class="custom-tooltip-content">
        <div *ngIf="isPrevYear" class="row">
          <div class="col">
            <div class="content">
              <div [style.border-color]="selectedColor[0].value" class="current_usage circle"></div>
              <span
                class="content-title">Current usage {{previousReadingDate | date:'y'}}</span>
            </div>
          </div>
          <div class="col text-right">
            <div class="usages">
              <h4>{{previousUsage}} {{registerInfo.registerId | registerUnit | async}}</h4>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="content">
              <div [style.border-color]="selectedColor[1].value" class="current_usage circle"></div>
              <span
                class="content-title">Current usage {{readingDate | date:'y'}}</span>
            </div>
          </div>
          <div class="col text-right">
            <div class="usages">
              <h4>{{readingUsage}} {{registerInfo.registerId | registerUnit | async}}</h4>
            </div>
          </div>
        </div>
        <div *ngIf="averageReading" class="row">
          <div class="col">
            <div class="content">
              <div class="average_usage circle"></div>
              <span *ngIf="!isPrevYear"
                    class="content-title">Average usage</span>

              <span *ngIf="isPrevYear"
                    class="content-title">Average usage {{periodName(model) | dateReadingFormat:readingDate:false:previousReadingDate}}</span>
            </div>
          </div>
          <div class="col text-right">
            <div class="usages">
              <h4>{{averageReading.currentReadingUsage.averageUsage}} {{registerInfo.registerId | registerUnit | async}}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleYearTooltipComponent {
  @Input() registerInfo: RegisterInfoViewModel;
  @Input() model: any;
  @Input() allData: Array<{ name: string; value: number }>;
  @Input() customColors: Array<{ name: string, value: string }>;

  public isPrevYear: boolean = false;
  selectedColor: IDataChart[];
  selectedReadingInfo: ReadingInfoViewModel;
  trendUpValue = 20;
  trendDownValue = -20;
  averageReading: ReadingInfoViewModel;

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

  getData(model: { name: string, value: number, series: string }) {
    this.getReadingInfoViewModel(model);
  }

  periodName() {
    return this.selectedReadingInfo && this.selectedReadingInfo.currentReadingUsage.periodName;
  }

  calculateReadingByUsage(usage: number, prevUsage: number) {
    return calculateReadingByUsage(usage, prevUsage);
  }

  abnormalityLevel(usage: number, previousUsage: number) {
    return abnormalityLevel(usage, previousUsage);
  }

  percentUsage(usage: number, prevUsage: number) {
    return percentUsage(usage, prevUsage);
  }

  hasNumber(str: string): boolean {
    return /\d/.test(str);
  }

  private checkIfAverageExist(model: { name: string; value: number; series: string }) {
    const [_, avgUsg] = usagesText;

    if (this.allData.some(d => d.name === avgUsg)) {
      const idx = this.registerInfo.readingsInfo.findIndex(r => periodName(r.currentReadingUsage.periodName) === model.name);
      const avg = this.registerInfo.readingsInfo[idx];
      this.averageReading = {...avg};
    }
  }

  private getReadingInfoViewModel(model: { name: string; value: number; series: string }) {
    this.selectedColor = this.customColors.filter(color => color.name.includes(model.name));

    this.checkIfAverageExist(model);
    this.checkIfPrevYearExist();

    this.selectedReadingInfo = this.registerInfo.readingsInfo.find(rInfo => {
      if (model.name !== model.series) {
        const rPeriod = periodName(rInfo.currentReadingUsage.periodName);
        const graphPeriod = periodName(model.name);
        return rPeriod === graphPeriod;
      }
      return periodName(rInfo.currentReadingUsage.periodName) === model.name;
    });
  }

  private checkIfPrevYearExist() {
    this.isPrevYear = this.allData.some(d => this.hasNumber(d.name));
  }
}
