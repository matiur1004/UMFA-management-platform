import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserProfilesPageComponent} from '../user-profiles-page.component';
import {ProfileDetailComponent} from '../profile-detail/profile-detail.component';
import {BranchAuthGuardService} from 'app/shared/infrastructures/branch.permission.auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserProfilesPageComponent,
    canActivate: [BranchAuthGuardService],
    data: {roles: ['canManageRoles', 'canManageUserProfiles']}
  },
  {
    path: 'users/:userId',
    component: UserProfilesPageComponent,
    canActivate: [BranchAuthGuardService],
    data: {roles: ['canManageRoles', 'canManageUserProfiles']}
  },
  {
    path: ':id',
    component: ProfileDetailComponent,
    canActivate: [BranchAuthGuardService],
    data: {roles: ['canManageRoles', 'canManageUserProfiles']}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule {
}
