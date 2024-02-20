import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SuppliersComponent} from '../../suppliers.component';

import * as fromGuards from '../guards';

const routes: Routes = [
  {
    path: '',
    component: SuppliersComponent,
    canDeactivate: [fromGuards.AllocatedSuppliersGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule {
}
