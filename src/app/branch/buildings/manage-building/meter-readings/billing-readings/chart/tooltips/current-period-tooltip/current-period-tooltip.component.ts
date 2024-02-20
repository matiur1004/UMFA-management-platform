import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {BaseTooltipComponent} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/tooltips/base-tooltip/base-tooltip.component';
import {DateMediumFormatPipe} from "@app/shared/pipes/date-medium.pipe";

@Component({
  selector: 'current-period-tooltip',
  template: `
    <div class="custom-tooltip-wrapper enter-reading-modal">
      <div class="row">
        <div class="col">
          <h3
            class="d-inline-block">{{periodName | dateReadingFormat:readingDate:true }}</h3>
        </div>
        <div class="col text-right">
          <div class="custom-tooltip-wrapper__right d-inline-block">
            <button type="button" class="dnm-btn rdng-list-btn"
                    [ngClass]="{'trend-up-icon' : abnormalityLevel(usage, averageUsage) >= trendUpValue,
                              'trend-down-icon' : abnormalityLevel(usage, averageUsage) <= trendDownValue}"
            ></button>
            <span>{{calculateReadingByUsage(usage, averageUsage)}} {{registerInfo.registerId | registerUnit | async}}
              / {{percentUsage(usage, averageUsage)}} %</span>
          </div>
        </div>
      </div>
      <div class="custom-tooltip-content">
        <div class="row">
          <div class="col">
            <div class="content">
              <div [style.border-color]="selectedColor[0].value" class="current_usage circle"></div>
              <span class="content-title">Current usage</span>
              <div *ngIf="!isStats" class="reading-status"
                   [ngClass]="'status-' + (selectedColor[0].key | readingStatusText | lowercase)"
                   placement="top"
                   [ngbTooltip]="(selectedColor[0].key | readingStatusText)">
              </div>
            </div>
          </div>
          <div class="col text-right">
            <div class="usages">
              <h4>{{usage}} {{registerInfo.registerId | registerUnit | async}}</h4>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="content">
              <div class="average_usage circle"></div>
              <span class="content-title">Average usage</span>
            </div>
          </div>
          <div class="col text-right">
            <div class="usages">
              <h4>{{averageUsage}} {{registerInfo.registerId | registerUnit | async}}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentPeriodTooltipComponent extends BaseTooltipComponent implements OnInit {
  // @Input() public registerInfo: RegisterInfoViewModel;
  @Input() public selectedColor: IDataChart[] = [];
  @Input() public isStats: boolean;
  // @Input() public selectedReadingInfo: ReadingInfoViewModel;

  constructor(public dateMediumFormatPipe: DateMediumFormatPipe) {
    super(dateMediumFormatPipe);
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
