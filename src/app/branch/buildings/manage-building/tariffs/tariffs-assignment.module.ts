import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgrxFormsModule} from 'ngrx-forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

import {PipesModule} from 'app/shared/pipes/pipes.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {PopupCommentModule} from 'app/popups/popup.comment/shared/popup-comment.module';

import {
  TariffCategoriesModule,
  TariffCategoriesService,
  TariffsModule as SharedTariffsModule,
  TariffStepService,
  TariffStepsModule
} from 'app/shared/tariffs';

import {BuildingTariffSettingsComponent} from './page-tariff-settings/building-tariff-settings.component';
import {BuildingTariffsComponent} from './page-building-tariffs/building-tariffs.component';
import {BuildingTariffDetailsComponent} from './components/building-tariff-details/building-tariff-details.component';

import {BuildingTariffCategoriesService} from './services/building-tariff-categories.service';
import {BuildingTariffStepsService} from './services/building-tariff-step-service';
import {LoadAttributesGuard} from './guards/load-attributes.guard';
import {LoadRegistersGuard} from './guards/load-registers.guard';
import {TariffSettingsGuard} from './guards/tariff-settings.guard';

import {reducers} from './store/reducers';
import {effects} from './store/effects';

import {BuildingTariffsService} from './services/building-tariffs.service';
import {BuildingIdGuard} from './guards/building-id.guard';
import {TariffDetailsGuard} from './guards/tariff-details.guard';
import {BuildingCategoriesGuard} from './guards/building-categories.guard';
import {BuildingTariffValuesComponent} from './components/building-tariff-values/building-tariff-values.component';
import {TariffValuesGuard} from './guards/tariff-values.guard';
import {BuildingAllocatedTariffsGuard} from './guards/building-allocated-tariffs.guard';
import {AllocatedTariffsComponent} from './page-allocated-tariffs/allocated-tariffs.component';
import {AllocatedTariffsListComponent} from './components/allocated-tariffs-list/allocated-tariffs-list.component';
import {TariffItemComponent} from './components/tariff-item/tariff-item.component';
import {TariffsChooserComponent} from './components/tariffs-chooser/tariffs-chooser.component';
import {AdditionalChargesListComponent} from './components/additional-charges-list/additional-charges-list.component';
import {ChargeItemComponent} from './components/charge-item/charge-item.component';
import {ManageTariffsComponent} from './components/manage-tariffs-tabs/manage-tariffs.component';
import {TariffAssignmentService} from './services/tariff-assignment.service';
import {AddNewAllocatedTariffComponent} from './dialogs/add-new-allocated-tariff/add-new-allocated-tariff.component';
import {AddNewChargeVersionComponent} from './dialogs/add-new-charge-version/add-new-charge-version.component';
import {AddNewChargeValueComponent} from './dialogs/add-new-charge-value/add-new-charge-value.component';
import {AddChargeLineItemComponent} from './dialogs/add-charge-line-item/add-charge-line-item.component';
import {FiterBranchTariffsPipe} from './pipes/fiter-branch-tariffs.pipe';
import {AddNewAllocatedTariffBindDialogDirective} from './dialogs/add-new-allocated-tariff-bind-dialog.directive';
import {AddNewChargeVersionBindDialogDirective} from './dialogs/add-new-charge-version-bind-dialog.directive';
import {UnitsOfMeasurementGuard} from '../shared/guards/units-of-measurement.guard';
import {TariffVersionSettingsGuard} from "./guards/tariff-version-settings.guard";
import {TariffVersionSettingsComponent} from "./components/tariff-version-settings/tariff-version-settings.component";
import {ManageTariffVersionComponent} from "@app/branch/buildings/manage-building/tariffs/components/manage-tariff-version/manage-tariff-version.component";

// ManageTariffsComponent
export const tariffsRoutes: Routes = [
  {
    path: 'building-tariff-settings',
    component: BuildingTariffSettingsComponent,
    data: {tab: 'tab-trf-settings', buildingIdDepth: 3},
    canActivate: [BuildingIdGuard, LoadAttributesGuard, UnitsOfMeasurementGuard, TariffSettingsGuard]
  },
  {
    path: 'building-tariffs',
    component: BuildingTariffsComponent,
    canActivate: [BuildingIdGuard, BuildingCategoriesGuard],
    data: {tab: 'tab-trf-list'}
  },
  {
    path: 'building-tariffs/:tariffVersionId',
    component: ManageTariffVersionComponent,
    canActivate: [
      BuildingIdGuard,
      TariffSettingsGuard,
      BuildingCategoriesGuard,
      TariffDetailsGuard,
      LoadAttributesGuard,
      UnitsOfMeasurementGuard
    ],
    data: {buildingIdDepth: 2},
    children: [
      {
        path: '',
        component: BuildingTariffDetailsComponent,
        canActivate: [
          TariffDetailsGuard
        ],
        data: {tab: 'tab-0', buildingIdDepth: 3},
      },
      {
        path: 'settings',
        component: TariffVersionSettingsComponent,
        canActivate: [
          TariffVersionSettingsGuard
        ],
        data: {tab: 'tab-1', buildingIdDepth: 3},
      }
    ]
  },
  {
    path: 'building-tariffs/:tariffVersionId/values/:valueVersionId',
    component: BuildingTariffValuesComponent,
    data: {buildingIdDepth: 2},
    canActivate: [
      BuildingIdGuard, TariffDetailsGuard, TariffValuesGuard]
  }
];

@NgModule({
  declarations: [
    BuildingTariffDetailsComponent,
    BuildingTariffsComponent,
    BuildingTariffSettingsComponent,
    BuildingTariffValuesComponent,

    AllocatedTariffsComponent,
    AllocatedTariffsListComponent,
    TariffItemComponent,
    TariffsChooserComponent,
    AdditionalChargesListComponent,
    ChargeItemComponent,
    AddNewAllocatedTariffComponent,
    AddNewChargeVersionComponent,
    AddNewChargeValueComponent,
    AddChargeLineItemComponent,
    ManageTariffsComponent,
    FiterBranchTariffsPipe,
    AddNewAllocatedTariffBindDialogDirective,
    AddNewChargeVersionBindDialogDirective,
    TariffVersionSettingsComponent,
    ManageTariffVersionComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    NgrxFormsModule,
    WidgetsModule,
    PipesModule,
    PopupCommentModule,
    DunamisInputsModule,
    TariffCategoriesModule,
    TariffStepsModule,
    SharedTariffsModule,
    RouterModule.forChild([]/*tariffsRoutes*/),
    StoreModule.forFeature('building-tariffs', reducers),
    EffectsModule.forFeature([...effects])
  ],
  exports: [AddNewAllocatedTariffBindDialogDirective],
  // entryComponents: [
  //   AddNewAllocatedTariffComponent,
  //   AddNewChargeVersionComponent,
  //   AddNewChargeValueComponent,
  //   AddChargeLineItemComponent
  // ],
  providers: [
    {provide: TariffCategoriesService, useClass: BuildingTariffCategoriesService},
    {provide: TariffStepService, useClass: BuildingTariffStepsService},
    BuildingTariffsService,
    BuildingAllocatedTariffsGuard,
    LoadAttributesGuard,
    LoadRegistersGuard,
    TariffSettingsGuard,
    BuildingIdGuard,
    BuildingCategoriesGuard,
    TariffDetailsGuard,
    TariffValuesGuard,
    TariffAssignmentService,
    TariffVersionSettingsGuard
  ]
})
export class TariffsAssignmentModule {
}
