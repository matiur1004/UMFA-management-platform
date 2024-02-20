import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EquipmentComponent} from './page-equipment/equipment.component';
import {LoadUnitsOfMeasurementGuard} from '../shared/common-data/guards';

export const equipmentRoutes: Routes = [
  {
    path: '', component: EquipmentComponent, data: {tab: 'tab-0'}, canActivate: [LoadUnitsOfMeasurementGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild([]/*equipmentRoutes*/)],
  exports: [RouterModule]
})
export class EquipmentRoutingModule {
}
