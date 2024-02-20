import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AdminLayoutComponent} from './adminLayout/admin-layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import {adminSettingsRoutes} from './settings/settings.module';
import {suppliersRoutes} from './suppliers/suppliers-routing.module';
import {equipmentRoutes} from './equipment/equipment-routing.module';
import {servicesRoutes} from './services/services-routing.module';
import {usersRoutes} from './users/user-routing.module';
import {adminBranchesRoutes} from './branches/branches.module';

const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent, children: [
      {path: '', component: DashboardComponent},
      {path: 'branches', children: adminBranchesRoutes},
      {path: 'users', children: usersRoutes},
      {path: 'suppliers', children: suppliersRoutes},
      {path: 'equipment', children: equipmentRoutes},
      {path: 'services', children: servicesRoutes},
      {path: 'settings', children: adminSettingsRoutes}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {
}
