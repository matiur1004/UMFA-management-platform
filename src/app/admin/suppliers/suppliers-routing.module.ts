import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SuppliersComponent} from './page-suppliers/suppliers.component';
import {TariffDetailComponent} from './manage-supplier/supplier-tariffs/tariff-detail/tariff-detail.component';
import {AdminAuthGuardService} from 'app/shared/infrastructures/admin.permission.auth.guard';
import {ManageSupplierComponent} from './manage-supplier/manage-supplier.component';
import {TariffValuesComponent} from './manage-supplier/supplier-tariffs/tariff-values/tariff-values.component';

import * as fromGuards from './shared/guards';
import {SupplierGuard} from './shared/guards';
import {SupplierDetailsComponent} from './manage-supplier/supplier-details/supplier-details.component';
import {SupplierCategoriesComponent} from './manage-supplier/supplier-categories';
import {SupplierTariffsComponent} from './manage-supplier/supplier-tariffs/supplier-tariffs.component';
import {LoadUnitsOfMeasurementGuard} from '../shared/common-data/guards';
import {TariffVersionSettingsComponent} from "./manage-supplier/supplier-tariffs/tariff-version-settings/tariff-version-settings.component";
import {ManageTariffVersionComponent} from "./manage-supplier/supplier-tariffs/manage-tariff-version/manage-tariff-version.component";

export const suppliersRoutes: Routes = [
  {
    path: '',
    component: SuppliersComponent,
    canActivate: [AdminAuthGuardService],
    data: {roles: ['canManageSuppliers']}
  },
  {
    path: ':supplierId',
    component: ManageSupplierComponent,
    data: {tab: 'tab-0'},
    canActivate: [SupplierGuard, LoadUnitsOfMeasurementGuard],
    children: [
      {
        path: '',
        component: SupplierDetailsComponent,
        data: {tab: 'tab-0'},
      },
      {
        path: 'categories',
        component: SupplierCategoriesComponent,
        canActivate: [
          fromGuards.LoadAttributesGuard,
          fromGuards.LoadRegistersGuard,
          fromGuards.TariffSettingsGuard],
        data: {tab: 'tab-1', supplierIdDepth: 1}
      },
      {
        path: 'tariffs',
        component: SupplierTariffsComponent,
        data: {tab: 'tab-2'},
        canActivate: [fromGuards.BuildingCategoriesGuard]
      }
    ]
  },
  {
    path: ':supplierId/tariffs/:versionId',
    component: ManageTariffVersionComponent,
    canActivate: [
      fromGuards.SupplierGuard,
      fromGuards.TariffDetailsGuard,
      fromGuards.TariffSettingsGuard,
      fromGuards.BuildingCategoriesGuard,
      fromGuards.LoadAttributesGuard,
      LoadUnitsOfMeasurementGuard
    ],
    children: [
      {
        path: '',
        component: TariffDetailComponent,
        canActivate: [
          fromGuards.TariffDetailsGuard
        ],
        data: {tab: 'tab-0'},
      },
      {
        path: 'settings',
        component: TariffVersionSettingsComponent,
        canActivate: [
          fromGuards.TariffVersionSettingsGuard
        ],
        data: {tab: 'tab-1'},
      }
    ]
  },
  {
    path: ':supplierId/tariffs/:versionId/values/:valueVersionId',
    component: TariffValuesComponent,
    canActivate: [
      fromGuards.TariffValuesGuard,
      fromGuards.SupplierGuard,
      fromGuards.TariffDetailsGuard],
    canDeactivate: [fromGuards.TariffValuesGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild([]/*suppliersRoutes*/)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule {
}
