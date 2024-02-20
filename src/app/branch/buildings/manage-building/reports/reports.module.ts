import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

import {DirectivesModule} from 'app/shared/directives/directives.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {ReportsComponent} from './page-reports/reports.component';
import {ConsumptionReportComponent} from './consumption-report/consumption-report.component';
import {TenantsListComponent} from './consumption-report/tenants-list/tenants-list.component';
import {CostTotalsComponent} from './consumption-report/cost-totals/cost-totals.component';
import {ConsumptionReportService} from './services/consumption-report.service';
import {NodeTariffSectionComponent} from './consumption-report/node-tariff-section/node-tariff-section.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DetailConsumptionReportComponent } from './detail-consumption-report/detail-consumption-report.component';
import { DetailConsumptionTenantsListComponent } from './detail-consumption-report/detail-consumption-tenants-list/detail-consumption-tenants-list.component';
import { DetailConsumptionItemComponent } from './detail-consumption-report/detail-consumption-item/detail-consumption-item.component';
import { TenantsNonRecoverableListComponent } from './consumption-report/tenants-non-recoverable-list/tenants-non-recoverable-list.component';
import { TenantSlipComponent } from './tenant-slip/tenant-slip.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MeterReadingChartComponent } from './tenant-slip/meter-reading-chart/meter-reading-chart.component';
import { TenantDetailComponent } from './consumption-report/tenant-detail/tenant-detail.component';
import { NodeOwnerliabilityDetailComponent } from './consumption-report/node-ownerliability-detail/node-ownerliability-detail.component';

export const reportsRoutes: Routes = [
  {path: '', component: ReportsComponent}
];

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    WidgetsModule,
    PipesModule,
    NgSelectModule,
    RouterModule.forChild([]/*reportsRoutes*/),
    FormsModule,
    DirectivesModule,
    DunamisInputsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxChartsModule
  ],
  providers: [
    ConsumptionReportService
  ],
  declarations: [
    ReportsComponent,
    ConsumptionReportComponent,
    TenantsListComponent,
    NodeTariffSectionComponent,
    CostTotalsComponent,
    DetailConsumptionReportComponent,
    DetailConsumptionTenantsListComponent,
    DetailConsumptionItemComponent,
    TenantsNonRecoverableListComponent,
    TenantSlipComponent,
    MeterReadingChartComponent,
    TenantDetailComponent,
    NodeOwnerliabilityDetailComponent
  ],
  exports: [RouterModule]
})
export class ReportsModule {
}
