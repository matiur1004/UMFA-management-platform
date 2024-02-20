import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MarketingListComponent} from './page-marketing/marketing-list.component';
import {BuildingComponent} from '../buildings/page-building/building.component';
import {BranchAuthGuardService} from 'app/shared/infrastructures/branch.permission.auth.guard';
import {PackageCustomizationComponent} from 'app/branch/buildings/building-services/package-customization/package-customization.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [BranchAuthGuardService],
    component: MarketingListComponent,
    data: {roles: ['canViewBuildings', 'canCreateBuildings', 'canUpdateBuildings']}
  },
  {path: ':id/package-customization/:packageId', component: PackageCustomizationComponent},
  {path: ':id', component: BuildingComponent},
  {path: 'new', component: BuildingComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule {
}
