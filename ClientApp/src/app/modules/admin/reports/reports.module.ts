import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
// import { AmrChartsComponent } from './amr-charts/amr-charts.component';
// import { AmrGraphSelectionComponent } from './amr-charts/amr-graph-selection/amr-graph-selection.component';
// import { AmrGraphCriteriaComponent } from './amr-charts/amr-graph-criteria/amr-graph-criteria.component';
// import { AmrGraphResultComponent } from './amr-charts/amr-graph-result/amr-graph-result.component';

//import DevExtreme components
import { DxDateBoxModule, DxChartModule, DxSelectBoxModule, DxFormModule, DxValidatorModule, DxButtonModule } from 'devextreme-angular';
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
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxButtonModule,
    DxReportViewerModule,
    DxChartModule,
    DxFormModule,
    DxDateBoxModule,
    MatButtonModule,
    NgSelectModule,
    MatFormFieldModule,
    MatButtonModule
    // DxValidatorModule,
  ],
  exports: [
    DxReportViewerModule
  ],
  providers: [
  ]
})
export class ReportsModule { }
