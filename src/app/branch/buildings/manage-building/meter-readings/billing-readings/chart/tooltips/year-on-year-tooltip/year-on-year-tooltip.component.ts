import {DateMediumFormatPipe} from '@app/shared/pipes/date-medium.pipe';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {
  ReadingInfoViewModel,
  RegisterInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {IDataChart} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {BaseTooltipComponent} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/tooltips/base-tooltip/base-tooltip.component';

@Component({
  selector: 'year-on-year-tooltip',
  templateUrl: './year-on-year-tooltip.component.html',
  styleUrls: ['./year-on-year-tooltip.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class YearOnYearTooltipComponent extends BaseTooltipComponent implements OnInit {
  // @Input() public registerInfo: RegisterInfoViewModel;
  @Input() public selectedColor: IDataChart[] = [];
  @Input() public isStats: boolean;
  // @Input() public selectedReadingInfo: ReadingInfoViewModel;

  constructor(public dateMediumFormatPipe: DateMediumFormatPipe) {
    super(dateMediumFormatPipe);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
