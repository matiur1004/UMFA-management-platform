import {UnitsOfMeasurementGuard} from './manage-building/shared/guards/units-of-measurement.guard';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BuildingsComponent} from './page-buildings/buildings.component';
import {BuildingComponent} from './page-building/building.component';
import {BranchAuthGuardService} from 'app/shared/infrastructures/branch.permission.auth.guard';
import {ManageBuildingComponent} from './manage-building/layout-manage-building/manage-building.component';
import {PackageCustomizationComponent} from 'app/branch/buildings/building-services/package-customization/package-customization.component';
import {BuildingIdGuard} from './manage-building/building-equipment/shared/guards/building-id.guard';

import {createOccupationRouter, occupationRoutes} from './manage-building/occupation/occupation-routing.module';
import {tenantsRoutes} from './manage-building/tenants/tenants.module';
import {tariffsRoutes} from './manage-building/tariffs/tariffs-assignment.module';
import {buildingEquipmentRoutes} from './manage-building/building-equipment/building-equipment-routing.module';
import {reportsRoutes} from './manage-building/reports/reports.module';
import {meterReadingsRoutes} from './manage-building/meter-readings/meter-readings.module';
import {historyRoutes} from './manage-building/history/history.module';
import {LayoutSelectingVersionComponent} from './manage-building/layout-selecting-version/layout-selecting-version.component';
import {VersionGuardService} from './manage-building/version-guard.service';
import {AllocatedTariffsComponent} from './manage-building/tariffs/page-allocated-tariffs/allocated-tariffs.component';
import {EnableVersionGuardService} from './manage-building/enable-version-guard.service';
import {RegistersGuard} from './manage-building/building-equipment/shared/guards/registers.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [BranchAuthGuardService],
    component: BuildingsComponent,
    data: {roles: ['canViewBuildings', 'canCreateBuildings', 'canUpdateBuildings']}
  },
  {path: ':id/edit', component: BuildingComponent},
  {path: ':id/operations-agreement/:versionId', component: BuildingComponent},
  {path: ':id/package-customization/:packageId', component: PackageCustomizationComponent},
  {
    path: ':id', component: ManageBuildingComponent, canActivate: [BuildingIdGuard],
    children: [
      {
        path: '', redirectTo: 'version/0/occupation', pathMatch: 'full'
      },
      {
        path: 'version', redirectTo: 'version/0/occupation', pathMatch: 'full'
      },
      {
        path: 'version/null',
        component: LayoutSelectingVersionComponent,
        canActivate: [VersionGuardService, EnableVersionGuardService],
        runGuardsAndResolvers: 'always',
        children: [
          {path: 'occupation', children: createOccupationRouter}
        ]
      },
      {
        path: 'version/:vid',
        component: LayoutSelectingVersionComponent,
        canActivate: [VersionGuardService, EnableVersionGuardService],
        runGuardsAndResolvers: 'always',
        children: [
          {path: 'occupation', children: occupationRoutes},
          {
            path: 'equipment',
            children: buildingEquipmentRoutes,
            canActivate: [RegistersGuard, UnitsOfMeasurementGuard]
          },
          {path: 'tariffs/allocated-tariffs', component: AllocatedTariffsComponent},
          {path: '', redirectTo: 'occupation'},
        ]
      },
      {path: 'tariffs', children: tariffsRoutes},
      {path: 'tenants', children: tenantsRoutes},
      {path: 'meter-readings', children: meterReadingsRoutes, canActivate: [RegistersGuard, UnitsOfMeasurementGuard]},
      {path: 'reports', children: reportsRoutes},
      {path: 'history', children: historyRoutes}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule {
}
