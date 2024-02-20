import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {AdminAuthGuardService} from 'app/shared/infrastructures/admin.permission.auth.guard';

export const usersRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AdminAuthGuardService],
    data: {roles: ['canManageRoles', 'canManageUsers']}
  },
  {
    path: 'user-activation/:userId',
    component: UserComponent,
    canActivate: [AdminAuthGuardService],
    data: {roles: ['canManageUsers']}
  }
];

@NgModule({
  imports: [RouterModule.forChild([]/*usersRoutes*/)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
