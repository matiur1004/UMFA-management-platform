import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routing';
import { DxButtonModule, DxChartModule, DxDataGridModule, DxDropDownBoxModule, DxPivotGridModule, DxSelectBoxModule, DxSparklineModule, DxTextBoxModule, DxTreeMapModule, DxTreeViewModule } from 'devextreme-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { CommonModule, DecimalPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TenantSlipDetailComponent } from './tenant-slip-detail/tenant-slip-detail.component';
import { TenantSlipDashboardComponent } from './tenant-slip-dashboard/tenant-slip-dashboard.component';
import { TenantSlipDownloadsComponent } from './tenant-slip-downloads/tenant-slip-downloads.component';
import { BuildingReportsComponent } from './building-reports/building-reports.component';
import { ReportsModule } from '../reports/reports.module';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ShopBillingComponent } from './shop-billing/shop-billing.component';
import { ShopOccupationsComponent } from './shop-occupations/shop-occupations.component';
import { ShopAssignedMetersComponent } from './shop-assigned-meters/shop-assigned-meters.component';
import { ShopReadingsComponent } from './shop-readings/shop-readings.component';
import { TriggeredAlarmsComponent } from './triggered-alarms/triggered-alarms.component';
import { MeterAlarmDetailModule } from '../admin/meter-alarm-detail/meter-alarm-detail.module';
import { ClientFeedbackReportComponent } from './building-reports/client-feedback-report/client-feedback-report.component';
import { TenantsListComponent } from './tenants-list/tenants-list.component';
import { TenantDetailComponent } from './tenant-detail/tenant-detail.component';
import { TenantBillingDetailComponent } from './tenant-billing-detail/tenant-billing-detail.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    declarations: [
        DashboardComponent,
        BuildingDetailComponent,
        TenantSlipDetailComponent,
        TenantSlipDashboardComponent,
        TenantSlipDownloadsComponent,
        BuildingReportsComponent,
        ShopListComponent,
        ShopDetailComponent,
        ShopBillingComponent,
        ShopOccupationsComponent,
        ShopAssignedMetersComponent,
        ShopReadingsComponent,
        TriggeredAlarmsComponent,
        ClientFeedbackReportComponent,
        TenantsListComponent,
        TenantDetailComponent,
        TenantBillingDetailComponent
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(dashboardRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        MatTooltipModule,
        MatTableModule,
        MatExpansionModule,
        MatSlideToggleModule,
        NgApexchartsModule,
        DxTextBoxModule,
        ReportsModule,
        MeterAlarmDetailModule,
        DxDataGridModule,
        DxChartModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxButtonModule,
        DxSelectBoxModule,
        DxPivotGridModule,
        DxSparklineModule,
        NgApexchartsModule,
        MatTabsModule,
        NgSelectModule,
        DxTreeMapModule,
        SharedModule
    ],
    exports: [
        ReportsModule,
        MeterAlarmDetailModule
    ],
    providers: [DecimalPipe]
})
export class DashboardModule
{
}
