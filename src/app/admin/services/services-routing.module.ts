import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ServicesComponent} from './page-services/services.component';
import {PackageDetailComponent} from './packages/package-detail/package-detail.component';

export const servicesRoutes: Routes = [
  {
    path: '', component: ServicesComponent, data: {tab: 'tab-0'}
  },
  {
    path: 'packages', component: ServicesComponent, data: {tab: 'tab-1'}
  },
  {
    path: 'meter-types', component: ServicesComponent, data: {tab: 'tab-2'}
  },
  {
    path: 'packages/:packageId', component: PackageDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild([]/*servicesRoutes*/)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {
}
