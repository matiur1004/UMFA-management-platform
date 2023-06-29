import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
// import { AmrChartsComponent } from './amr-charts/amr-charts.component';
// import { AmrGraphSelectionComponent } from './amr-charts/amr-graph-selection/amr-graph-selection.component';
// import { AmrGraphCriteriaComponent } from './amr-charts/amr-graph-criteria/amr-graph-criteria.component';
// import { AmrGraphResultComponent } from './amr-charts/amr-graph-result/amr-graph-result.component';

//import DevExtreme components
import { DxDateBoxModule, DxChartModule, DxSelectBoxModule, DxFormModule, DxValidatorModule, DxButtonModule, DxPivotGridModule, DxDataGridModule, DxDropDownBoxModule, DxTreeViewModule } from 'devextreme-angular';
// import { DxReportViewerComponent } from './dx-report-viewer/dx-report-viewer.component';

// import { ReportSelectionComponent } from './dx-report-viewer/report-selection/report-selection.component';
// import { ReportCriteriaComponent } from './dx-report-viewer/report-criteria/report-criteria.component';
// import { ReportResultComponent } from './dx-report-viewer/report-result/report-result.component';
import { DxReportViewerModule } from 'devexpress-reporting-angular'
import { DxReportViewerComponent } from './dx-report-viewer/dx-report-viewer.component';
import { ReportSelectionComponent } from './dx-report-viewer/report-selection/report-selection.component';
import { ReportCriteriaComponent } from './dx-report-viewer/report-criteria/report-criteria.component';
import { ReportResultComponent } from './dx-report-viewer/report-result/report-result.component';
import { AmrChartsComponent } from './amr-charts/amr-charts.component';
import { AmrGraphSelectionComponent } from './amr-charts/amr-graph-selection/amr-graph-selection.component';
import { AmrGraphCriteriaComponent } from './amr-charts/amr-graph-criteria/amr-graph-criteria.component';
import { AmrGraphResultComponent } from './amr-charts/amr-graph-result/amr-graph-result.component';
import { MatButtonModule } from '@angular/material/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReportCriteriaShopComponent } from './dx-report-viewer/report-criteria-shop/report-criteria-shop.component';
import { ReportResultShopComponent } from './dx-report-viewer/report-result-shop/report-result-shop.component';
import { ReportResultShopCostComponent } from './dx-report-viewer/report-result-shop-cost/report-result-shop-cost.component';
import { ReportCriteriaUtilityComponent } from './dx-report-viewer/report-criteria-utility/report-criteria-utility.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReportResultUtilityComponent } from './dx-report-viewer/report-result-utility/report-result-utility.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReportCriteriaConsumptionComponent } from './dx-report-viewer/report-criteria-consumption/report-criteria-consumption.component';
import { ReportResultConsumptionComponent } from './dx-report-viewer/report-result-consumption/report-result-consumption.component';
@NgModule({
  declarations: [
    DxReportViewerComponent,
    ReportSelectionComponent,
    ReportCriteriaComponent,
    ReportResultComponent,
    AmrChartsComponent,
    AmrGraphSelectionComponent,
    AmrGraphCriteriaComponent,
    AmrGraphResultComponent,
    ReportCriteriaShopComponent,
    ReportResultShopComponent,
    ReportResultShopCostComponent,
    ReportCriteriaUtilityComponent,
    ReportResultUtilityComponent,
    ReportCriteriaConsumptionComponent,
    ReportResultConsumptionComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxTreeViewModule,
    DxDropDownBoxModule,
    DxButtonModule,
    DxReportViewerModule,
    DxChartModule,
    DxDataGridModule,
    DxPivotGridModule,
    DxFormModule,
    DxDateBoxModule,
    MatCheckboxModule,
    MatButtonModule,
    NgSelectModule,
    MatFormFieldModule,
    NgApexchartsModule
    // DxValidatorModule,
  ],
  exports: [
    DxReportViewerModule
  ],
  providers: [
  ]
})
export class ReportsModule { }
