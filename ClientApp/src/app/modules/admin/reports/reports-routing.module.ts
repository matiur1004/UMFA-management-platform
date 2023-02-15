import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule, Routes } from '@angular/router';
import { UserDataResolver } from 'app/shared/resolvers/user.resolver';
import { AmrChartsComponent } from './amr-charts/amr-charts.component';
// import { AmrChartsComponent } from './amr-charts/amr-charts.component';
import { DxReportViewerComponent } from './dx-report-viewer/dx-report-viewer.component';

const routes: Route[] = [
  {
    path: 'dxreports',
    component: DxReportViewerComponent,
    resolve: {
      data: UserDataResolver
    }
  },
  { 
    path: 'amrgraphs', 
    component: AmrChartsComponent,
    resolve: {
      data: UserDataResolver
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)],
  exports: [
    RouterModule
  ]
})
export class ReportsRoutingModule { }
