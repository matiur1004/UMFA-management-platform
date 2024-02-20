import {DateMediumFormatPipe} from '@app/shared/pipes/date-medium.pipe';
import {PipesModule} from './../../../../../../shared/pipes/pipes.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BarChartComponent} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/bar-chart/bar-chart.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {LinearChartComponent} from './linear-chart/linear-chart.component';
import {BuildingSharedModule} from '@app/branch/buildings/shared/building-shared.module';
import {DateReadingFormatPipe} from './pipe/date-reading-format.pipe';
import {CustomLineDirective} from './pipe/custom-line.directive';
import {
  ComboChartComponent,
  ComboSeriesVerticalComponent
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/combo-chart';
import {ComboChartContainerComponent} from './combo-chart-container/combo-chart-container.component';
import {MultipleYearTooltipComponent} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/tooltips/multiple-year-tooltip/multiple-year-tooltip.component';
import {CurrentPeriodTooltipComponent} from './tooltips/current-period-tooltip/current-period-tooltip.component';
import {BaseTooltipComponent} from './tooltips/base-tooltip/base-tooltip.component';
import {YearOnYearTooltipComponent} from './tooltips/year-on-year-tooltip/year-on-year-tooltip.component';
import {ReadingStatusTextPipe} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/pipe/reading-status-text';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    NgxChartsModule,
    BuildingSharedModule,
    NgbTooltipModule,
    PipesModule
  ],
  providers: [DateMediumFormatPipe],
  declarations: [
    BarChartComponent,
    LinearChartComponent,
    DateReadingFormatPipe,
    CustomLineDirective,
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    ComboChartContainerComponent,
    MultipleYearTooltipComponent,
    CurrentPeriodTooltipComponent,
    BaseTooltipComponent,
    YearOnYearTooltipComponent,
    ReadingStatusTextPipe
  ],
  exports: [
    BarChartComponent,
    ComboChartComponent,
    ComboSeriesVerticalComponent,
    LinearChartComponent,
    MultipleYearTooltipComponent,
    CustomLineDirective,
    ComboChartContainerComponent
  ]
})
export class ChartModule {
}
