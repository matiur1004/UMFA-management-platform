import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BuildingsComponent} from '../../buildings.component';
import {BuildingDetailsComponent} from '../../building-details/building-details.component';

const routes: Routes = [
  {
    path: '', component: BuildingsComponent
  },
  {
    path: ':buildingId', component: BuildingDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingsRoutingModule {
}
