import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {AddressModule} from 'app/widgets/module/address.module';
import {SuppliersRoutingModule} from './suppliers-routing.module';
import {SuppliersComponent} from './page-suppliers/suppliers.component';
import {SupplierListComponent} from './supplier-list/supplier-list.component';
import {SupplierItemComponent} from './supplier-list/supplier-item/supplier-item.component';
import {StoreModule} from '@ngrx/store';
import {NgrxFormsModule} from 'ngrx-forms';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers, reducers} from './shared/store/reducers';
import {SupplierService} from './shared/services/supplier.service';
import {SupplierDetailsComponent} from './manage-supplier/supplier-details/supplier-details.component';
import {ManageSupplierComponent} from './manage-supplier/manage-supplier.component';
import {SupplierTariffsComponent} from './manage-supplier/supplier-tariffs/supplier-tariffs.component';
import {TariffDetailComponent} from './manage-supplier/supplier-tariffs/tariff-detail/tariff-detail.component';
import {TariffService} from './shared/services/tariff.service';
import {CreateSupplierComponent} from './create-supplier/create-supplier.component';
import {SupplierTouComponent} from './manage-supplier/supplier-tou/supplier-tou.component';
import {SupplierTouTableComponent} from './manage-supplier/supplier-tou/supplier-tou-table/supplier-tou-table.component';
import {SaveTariffComponent} from './manage-supplier/supplier-tariffs/tariff-detail/modals/save-tariff/save-tariff.component';
import {AddCategoryComponent} from './manage-supplier/supplier-tariffs/tariff-detail/modals/add-category/add-category.component';
import {AddSubcategoryComponent} from './manage-supplier/supplier-tariffs/tariff-detail/modals/add-subcategory/add-subcategory.component';

import * as fromEffects from './shared/store/effects';
import * as fromTariffValues from './manage-supplier/supplier-tariffs/tariff-values';
import * as fromGuards from './shared/guards';
import * as fromSupplierCategories from './manage-supplier/supplier-categories';

import {EquipmentService} from '@services';
import {TextMaskModule} from 'angular2-text-mask';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {TariffCoordinationService} from '@app/shared/tariffs/services/tariff-coordination.service';
import {SupplierTariffCoordinationService} from './shared/services/supplier-tariff-coordination.service';
import {
  TariffCategoriesModule,
  TariffCategoriesService,
  TariffStepService,
  TariffStepsModule
} from 'app/shared/tariffs';
import {SupplierTariffCategoriesService} from './shared/services/supplier-tariff-categories.service';
import {SupplierTariffStepService} from './shared/services/supplier-tariff-step.service';
import {TariffsModule} from 'app/shared/tariffs/modules/tariffs.module';
import {adminCommonGuards} from '../shared/common-data/guards';
import {TariffVersionSettingsComponent} from "./manage-supplier/supplier-tariffs/tariff-version-settings/tariff-version-settings.component";
import {ManageTariffVersionComponent} from "./manage-supplier/supplier-tariffs/manage-tariff-version/manage-tariff-version.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbNavModule,
    SuppliersRoutingModule,
    WidgetsModule,
    AddressModule,
    NgSelectModule,
    StoreModule.forFeature('supplier', reducers, {metaReducers}),
    EffectsModule.forFeature([...fromEffects.effects]),
    NgrxFormsModule,
    // TextMaskModule,
    DunamisInputsModule,
    TariffsModule,
    TariffCategoriesModule,
    TariffStepsModule
  ],
  declarations: [
    SuppliersComponent,
    SupplierListComponent,
    SupplierItemComponent,
    SupplierDetailsComponent,
    SupplierTariffsComponent,
    SupplierTouComponent,
    SupplierTouTableComponent,
    ManageSupplierComponent,
    TariffDetailComponent,
    CreateSupplierComponent,
    SaveTariffComponent,
    AddCategoryComponent,
    AddSubcategoryComponent,
    TariffVersionSettingsComponent,
    ManageTariffVersionComponent,
    ...fromTariffValues.components,
    ...fromSupplierCategories.components
  ],
  // entryComponents: [
  //   CreateSupplierComponent,
  //   SaveTariffComponent,
  //   AddCategoryComponent,
  //   AddSubcategoryComponent
  // ],
  providers: [
    SupplierService,
    {
      provide: TariffCoordinationService,
      useClass: SupplierTariffCoordinationService
    },
    {
      provide: TariffCategoriesService,
      useClass: SupplierTariffCategoriesService
    },
    {
      provide: TariffStepService,
      useClass: SupplierTariffStepService
    },
    TariffService,
    EquipmentService,
    ...fromGuards.guards,
    ...adminCommonGuards
  ]

})

export class SuppliersModule {
}
