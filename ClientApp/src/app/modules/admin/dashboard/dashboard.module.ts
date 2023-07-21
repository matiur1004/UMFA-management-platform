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
import { DxButtonModule, DxChartModule, DxDataGridModule, DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TenantSlipDetailComponent } from './tenant-slip-detail/tenant-slip-detail.component';
import { TenantSlipDashboardComponent } from './tenant-slip-dashboard/tenant-slip-dashboard.component';
import { TenantSlipDownloadsComponent } from './tenant-slip-downloads/tenant-slip-downloads.component';
import { BuildingReportsComponent } from './building-reports/building-reports.component';
import { ReportsModule } from '../reports/reports.module';

@NgModule({
    declarations: [
        DashboardComponent,
        BuildingDetailComponent,
        TenantSlipDetailComponent,
        TenantSlipDashboardComponent,
        TenantSlipDownloadsComponent,
        BuildingReportsComponent
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
        NgApexchartsModule,
        DxTextBoxModule,
        ReportsModule,
        DxDataGridModule,
        DxChartModule,
        DxButtonModule,
        DxSelectBoxModule,
        MatTabsModule,
        SharedModule
    ],
    exports: [
        ReportsModule
    ]
})
export class DashboardModule
{
}
