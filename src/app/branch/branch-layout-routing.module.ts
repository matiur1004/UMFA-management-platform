import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BranchLayoutComponent} from './layout/layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {PageBranchDetectComponent} from './page-branch-detect/page-branch-detect.component';
import {BranchesGuard} from './branches.guard';

const routes: Routes = [
  {path: '', component: PageBranchDetectComponent, pathMatch: 'full'},
  {
    path: 'branch/:branchid', component: BranchLayoutComponent, canActivate: [BranchesGuard], children: [
      {path: '', component: DashboardComponent},
      {
        path: 'buildings',
        loadChildren: () => import('app/branch/buildings/building.module').then(m => m.BuildingModule)
      },
      {
        path: 'marketing',
        loadChildren: () => import('app/branch/marketing/marketing.module').then(m => m.MarketingModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('app/branch/clients/shared/client.module').then(m => m.ClientModule)
      },
      {
        path: 'user-profiles',
        loadChildren: () => import('app/branch/user-profiles/shared/user-profile.module').then(m => m.UserProfileModule)
      },

      {
        path: 'settings',
        loadChildren: () => import('app/branch/settings/settings.module').then(m => m.BranchSettingsModule)
      },
      {
        path: 'suppliers',
        loadChildren: () => import('app/branch/suppliers/shared/modules/suppliers.module').then(m => m.SuppliersModule)
      },
    ]
  },
  {
    path: '', component: BranchLayoutComponent, children: [
      {
        path: 'user-account',
        loadChildren: () => import('app/branch/user-account/shared/user-account.module').then(m => m.UserAccountModule)
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchLayoutRoutingModule {
}
