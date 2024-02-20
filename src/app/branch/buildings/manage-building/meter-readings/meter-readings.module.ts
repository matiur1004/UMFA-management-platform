import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgSelectModule} from '@ng-select/ng-select';
// import {Ng5SliderModule} from 'ng5-slider';s
import {NgrxFormsModule} from 'ngrx-forms';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {ConfirmDialogModule} from 'app/popups/confirm-dialog/confirm-dialog.module';

import {BuildingPeriodsModule} from './building-periods/shared/modules/building-periods.module';

import {PopupModule} from './popups/popup.module';
import {MeterReadingsComponent} from './page-meter-readings/meter-readings.component';
import {ReadingsHistoryComponent} from './billing-readings/readings-history/readings-history.component';
import {BillingReadingsComponent} from './billing-readings/billing-readings.component';
import {ReadingsListComponent} from './billing-readings/readings-list/readings-list.component';
import {ReadingsListItemComponent} from './billing-readings/readings-list/readings-list-item/readings-list-item.component';
import {LocationMapPopupComponent} from './billing-readings/readings-list/readings-list-item/location-map-popup/location-map-popup.component';
import {ShopsListPopupComponent} from './billing-readings/readings-list/readings-list-item/shops-list-popup/shops-list-popup.component';
import {EnterReadingsComponent} from './billing-readings/enter-readings/enter-readings.component';
import {ReadingItemComponent} from './billing-readings/enter-readings/reading-item/reading-item.component';
import {UsageHistoryComponent} from './billing-readings/readings-list/readings-list-item/usage-history/usage-history.component';
import {ApplyEstimatedPopupComponent} from './billing-readings/readings-list/readings-list-item/apply-estimated-popup/apply-estimated-popup.component';
import {AbnormalityFilterComponent} from './billing-readings/filters/abnormality-filter/abnormality-filter.component';
import {HistoryReadingItemComponent} from './billing-readings/readings-history/history-reading-item/history-reading-item.component';
import {EnterReadingPopupComponent} from './billing-readings/enter-reading-popup/enter-reading-popup.component';
import {BuildingBillingReadingsService} from './billing-readings/shared/services/billing-readings.service';
import {ReadingsHistoryService} from './billing-readings/shared/services/readings-history.service';

import {BillingReadingsEffects} from './billing-readings/shared/store/effects/billing-readings.effects';
import {BuildingPeriodsEffects} from './building-periods/shared/store/effects/building-periods.effects';
import {EnterReadingEffects} from './billing-readings/shared/store/effects/enter-reading.effects';
import {ReadingsHistoryEffects} from './billing-readings/shared/store/effects/readings-history-effects/readings-history.effects';
import {metaReducers, reducers} from './billing-readings/shared/store/reducers';
import {ReadingDetailsPopupDirective} from './billing-readings/reading-details-popup/reading-details-popup.directive';
import {ReadingDetailsPopupComponent} from './billing-readings/reading-details-popup/reading-details-popup/reading-details-popup.component';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {PopupConfirmDeleteModule} from '@app/popups/popup-confirm-delete/popup-confirm-delete.module';
import {YearOnYearEstimatedComponent} from './billing-readings/readings-list/readings-list-item/apply-estimated-popup/year-on-year-estimated/year-on-year-estimated.component';
import {MonthlyEstimatedComponent} from './billing-readings/readings-list/readings-list-item/apply-estimated-popup/monthly-estimated/monthly-estimated.component';
import {ReadingDetailsPopupTitleComponent} from './billing-readings/reading-details-popup/reading-details-popup/reading-details-popup-title/reading-details-popup-title.component';
import {ReadingDetailsPopupPhotoComponent} from './billing-readings/reading-details-popup/reading-details-popup/reading-details-popup-photo/reading-details-popup-photo.component';
import {ImageOptionsComponent} from '@app/branch/buildings/manage-building/image-options/image-options.component';
import {BuildingSharedModule} from '@app/branch/buildings/shared/building-shared.module';
import {ReadingItemViewComponent} from './billing-readings/readings-list/readings-list-item/reading-item-view/reading-item-view.component';
import {ChartModule} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/chart.module';
import {ReadingItemChartViewComponent} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/readings-list/readings-list-item/reading-item-chart-view/reading-item-chart-view.component';
import {MeterReadingStatsComponent} from './billing-readings/readings-list/readings-list-item/meter-reading-stats/meter-reading-stats.component';
import {ReadingStatusDirective} from './billing-readings/shared/directives/reading-status.directive';
import {MeterReadingsDetailsGuard} from './billing-readings/guards/meter-readings-details.guard';
import {EnterReadingPopupDirective} from './billing-readings/enter-reading-popup/enter-reading-popup.directive';
import { NgxSliderModule } from 'ngx-slider-v2';

export const meterReadingsRoutes: Routes = [
  {path: '', component: MeterReadingsComponent},
  {
    path: 'readings-history/:meterId/:registerId/:timeOfUse',
    component: ReadingsHistoryComponent,
    canActivate: [MeterReadingsDetailsGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    WidgetsModule,
    PipesModule,
    NgSelectModule,
    NgxSliderModule,
    BuildingPeriodsModule,
    RouterModule.forChild([]/*meterReadingsRoutes*/),
    StoreModule.forFeature('meterReadings', reducers, {metaReducers}),
    EffectsModule.forFeature([BillingReadingsEffects, BuildingPeriodsEffects, EnterReadingEffects, ReadingsHistoryEffects]),
    NgrxFormsModule,
    FormsModule,
    ReactiveFormsModule,
    PopupModule,
    DunamisInputsModule,
    ConfirmDialogModule,
    DirectivesModule,
    ChartModule,
    PopupConfirmDeleteModule,
    BuildingSharedModule
  ],
  providers: [
    MeterReadingsDetailsGuard,
    BuildingBillingReadingsService,
    ReadingsHistoryService
  ],
  declarations: [
    MeterReadingsComponent,
    ImageOptionsComponent,
    BillingReadingsComponent,
    AbnormalityFilterComponent,
    ReadingsListComponent,
    ReadingsListItemComponent,
    LocationMapPopupComponent,
    ShopsListPopupComponent,
    EnterReadingsComponent,
    ReadingItemComponent,
    ReadingsHistoryComponent,
    UsageHistoryComponent,
    ApplyEstimatedPopupComponent,
    HistoryReadingItemComponent,
    EnterReadingPopupComponent,
    ReadingDetailsPopupDirective,
    ReadingDetailsPopupComponent,
    ReadingDetailsPopupTitleComponent,
    ReadingDetailsPopupPhotoComponent,
    YearOnYearEstimatedComponent,
    MonthlyEstimatedComponent,
    ReadingItemViewComponent,
    ReadingItemChartViewComponent,
    MeterReadingStatsComponent,
    ReadingStatusDirective,
    EnterReadingPopupDirective
  ],
  exports: [
    RouterModule,
  ],
  // entryComponents: [
  //   ApplyEstimatedPopupComponent,
  //   EnterReadingPopupComponent,
  //   ReadingDetailsPopupComponent
  // ]
})
export class MeterReadingsModule {
}
