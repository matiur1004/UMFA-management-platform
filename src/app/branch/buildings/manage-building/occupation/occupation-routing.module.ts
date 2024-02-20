import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OccupationComponent} from './occupation-create/page-occupation/occupation.component';
import {ViewOccupationComponent} from './occupation-view/page-view-occupation/view-occupation.component';

export const occupationRoutes: Routes = [
  {
    path: '', component: ViewOccupationComponent, data: {tabOccupation: 'tabOccupation-0'}
  },
  {
    path: 'shops', component: ViewOccupationComponent, data: {tabOccupation: 'tabOccupation-1'}
  },
  {
    path: 'common-areas', component: ViewOccupationComponent, data: {tabOccupation: 'tabOccupation-2'}
  },
  {
    path: 'floor-plans', component: ViewOccupationComponent, data: {tabOccupation: 'tabOccupation-3'}
  },
  {
    path: ':versionId', component: ViewOccupationComponent
  }
];

export const createOccupationRouter: Routes = [
  {
    path: '', component: OccupationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(occupationRoutes)],
  exports: [RouterModule]
})
export class OccupationRoutingModule {
}
