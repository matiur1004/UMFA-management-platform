import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from 'app/shared/infrastructures/auth.guard';
import {AdminAuthGuard} from 'app/shared/infrastructures/admin.auth.guard';
import {TenantAuthGuard} from 'app/shared/infrastructures/tenant.auth.guard';
import {ClientAuthGuard} from 'app/shared/infrastructures/client.auth.guard';


const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    loadChildren: () => import('app/admin/admin-layout.module').then(m => m.AdminLayoutModule)
  },
  {
    path: 'tenant',
    canActivate: [TenantAuthGuard],
    loadChildren: () => import('./tenant/tenant-layout.module').then(m => m.TenantLayoutModule)
  },
  {
    path: 'client',
    canActivate: [ClientAuthGuard],
    loadChildren: () => import('app/client/layout/shared/client-layout.module').then(m => m.ClientLayoutModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('app/branch/branch-layout.module').then(m => m.BranchLayoutModule)
  },
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
