import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EquipmentGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/equipment.guard';
import {CreateVirtualRegisterComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/pages/create-virtual-register/create-virtual-register.component';
import {VirtualRegistersDetailsGuard} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/guards/virtual-registers-details.guard';
import {BuildingEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/page-building-equipment/building-equipment.component';
import {DisableVersionGuardService} from '@app/branch/buildings/manage-building/disable-version-guard.service';
import {EquipmentDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-details/equipment-details.component';
import {NodeDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/node-details.component';
import {NodeDetailsGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/node-details.guard';
import {ViewEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/view-equipment.component';
import {LocationDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/location-details/location-details.component';
import {AttributesGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/attributes.guard';
import {PageEditNodeSetComponent} from '@app/branch/buildings/manage-building/building-equipment/set-of-nodes/page-edit-node-set/page-edit-node-set.component';
import {RegistersGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/registers.guard';
import {PageCreateNodeSetComponent} from '@app/branch/buildings/manage-building/building-equipment/set-of-nodes/page-create-node-set/page-create-node-set.component';
import {AddNodeComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/add-node/add-node.component';
import {SuppliesGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/supplies.guard';

export const buildingEquipmentRoutes: Routes = [
  {path: '', component: BuildingEquipmentComponent, data: {tabEquip: 'tabEquip-0'}},

  {path: 'locations', component: ViewEquipmentComponent, data: {tabEquip: 'tabEquip-1'}},
  {path: 'locations/:locationId', component: LocationDetailsComponent, canActivate: [DisableVersionGuardService]},
  {
    path: 'locations/:locationId/:equipmentId',
    component: EquipmentDetailsComponent,
    canActivate: [DisableVersionGuardService]
  },

  {path: 'equipment-templates', component: ViewEquipmentComponent, data: {tabEquip: 'tabEquip-3'}},
  {path: 'equipment-tree', component: ViewEquipmentComponent, data: {tabEquip: 'tabEquip-4'}},
  {path: 'virtual-registers', component: ViewEquipmentComponent, data: {tabEquip: 'tabEquip-5'}},
  {
    path: 'virtual-registers/new',
    component: CreateVirtualRegisterComponent,
    canActivate: [DisableVersionGuardService]
  },

  {
    path: 'virtual-registers/:id',
    component: CreateVirtualRegisterComponent,
    canActivate: [VirtualRegistersDetailsGuard, DisableVersionGuardService],
    runGuardsAndResolvers: 'always'
  },

  {path: 'nodes/set/new', component: PageCreateNodeSetComponent, canActivate: [DisableVersionGuardService]},
  {path: 'nodes/set/:setId', component: PageEditNodeSetComponent, canActivate: [DisableVersionGuardService]},
  {path: 'nodes', component: ViewEquipmentComponent, data: {tabEquip: 'tabEquip-2'}},
  {path: 'nodes/new', component: AddNodeComponent, canActivate: [SuppliesGuard, DisableVersionGuardService]},
  {
    path: 'nodes/:nodeId',
    component: NodeDetailsComponent,
    canActivate: [AttributesGuard, DisableVersionGuardService, RegistersGuard, NodeDetailsGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: ':equipmentId',
    component: EquipmentDetailsComponent,
    canActivate: [EquipmentGuard, DisableVersionGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild([]/*buildingEquipmentRoutes*/)],
  exports: [RouterModule]
})
export class BuildingEquipmentRoutingModule {
}
