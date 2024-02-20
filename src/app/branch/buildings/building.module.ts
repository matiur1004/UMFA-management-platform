import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {BankAccountService, BuildingService} from '@services';
import {DateValueAccessorModule} from 'angular-date-value-accessor';
import {CreateBranchContactModule} from 'app/branch/create-branch-contact/shared/create-branch-contact.module';
import {CreateClientContactModule} from 'app/branch/create-client-contact/shared/create-client-contact.module';
import {BankAccountModule} from 'app/branch/shared/bank-accounts/bank-account.module';
import {ApplyResultPopupModule} from 'app/popups/apply-result-popup/apply-result-popup.module';

import {PopupBranchListModule} from 'app/popups/popup.branch/shared/popup-branch.module';
import {PopupCommentModule} from 'app/popups/popup.comment/shared/popup-comment.module';
import {PopupRegisterChangeVersionReadingModule} from '@app/popups/popup-register-change-version-reading/shared/popup-register-change-version-reading.module';
import {PopupFilesListModule} from 'app/popups/popup.files.list/shared/popup-files-list.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {ServiceTreeModule} from 'app/widgets/service-tree/shared/service-tree.module';
import {ImageCropperModule} from 'ngx-image-cropper';
import {AddressModule} from '@app/widgets/module/address.module';
import {BuildingRoutingModule} from './building-routing.module';
import {BuildingIdGuard} from './manage-building/building-equipment/shared/guards/building-id.guard';
import {BuildingsPopupComponent} from './manage-building/buildings-popup/buildings-popup.component';
import {HistoryModule} from './manage-building/history/history.module';
import {ManageBuildingComponent} from './manage-building/layout-manage-building/manage-building.component';
import {LayoutSelectingVersionComponent} from './manage-building/layout-selecting-version/layout-selecting-version.component';
import {MeterReadingsModule} from './manage-building/meter-readings/meter-readings.module';

import {OccupationModule} from './manage-building/occupation/occupation.module';
import * as fromEffects from './manage-building/occupation/shared/store/effects';
import {OccupationEffects} from './manage-building/occupation/shared/store/effects/occupation.effects';
import * as occupation from './manage-building/occupation/shared/store/reducers';
import {ReportsModule} from './manage-building/reports/reports.module';
import {BuildingVersionHistoryService} from './manage-building/shared/services/building-version-history.service';
import {CommonDataEffects as BuildingCommonDataEffects} from './manage-building/shared/store/effects/common-data.effects';
import {reducer as buildingCommonDataReducer} from './manage-building/shared/store/reducers/common-data.reducer';
import {TariffsAssignmentModule} from './manage-building/tariffs/tariffs-assignment.module';
import {TenantsModule} from './manage-building/tenants/tenants.module';
import {VersionGuardService} from './manage-building/version-guard.service';

import {BuildingsComponent} from './page-buildings/buildings.component';
import {BuildingSharedModule} from './shared/building-shared.module';
import {ShopHelper} from '@app/branch/buildings/manage-building/occupation/shared/helpers/shop.helper';
import {PopupConfirmReportModule} from '@app/popups/popup.confirm-report/shared/popup.confirm-report.module';
import {PopupCreateFilterComponent} from '@app/popups/popup.create.filter/popup.create.filter.component';
import {BuildingEquipmentModule} from '@app/branch/buildings/manage-building/building-equipment/building-equipment.module';
import {NodeTariffsPopup} from "./manage-building/shared/components/node-tariffs-popup/node-tariffs-popup.component";
import {NodeTariffsAppliedPopup} from "./manage-building/shared/components/node-tariffs-applied-popup/node-tariffs-applied-popup.component";
import { BuildingPeriodsService } from './manage-building/shared/services/building-periods.service';

@NgModule({
  imports: [
    CommonModule,
    BuildingRoutingModule,
    ImageCropperModule,
    BankAccountModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    WidgetsModule,
    PipesModule,
    DunamisInputsModule,
    AddressModule,
    NgbNavModule,
    PopupBranchListModule,
    CreateBranchContactModule,
    CreateClientContactModule,
    PopupFilesListModule,
    PopupCommentModule,
    PopupRegisterChangeVersionReadingModule,
    ApplyResultPopupModule,
    PopupConfirmReportModule,
    DateValueAccessorModule,
    ServiceTreeModule,
    StoreModule.forFeature('building', buildingCommonDataReducer),
    StoreModule.forFeature('occupation', occupation.reducers, {metaReducers: occupation.metaReducers}),
    EffectsModule.forFeature([OccupationEffects, BuildingCommonDataEffects, ...fromEffects.effects]),
    BuildingSharedModule,
    MeterReadingsModule,
    OccupationModule,
    TenantsModule,
    TariffsAssignmentModule,
    ReportsModule,
    HistoryModule,
    BuildingEquipmentModule
  ],
  declarations: [
    BuildingsComponent,
    ManageBuildingComponent,
    PopupCreateFilterComponent,
    BuildingsPopupComponent,
    LayoutSelectingVersionComponent,
    NodeTariffsPopup,
    NodeTariffsAppliedPopup
  ],
  providers: [
    ShopHelper,
    BuildingIdGuard,
    VersionGuardService,
    BuildingVersionHistoryService,
    BuildingPeriodsService,
    {provide: BankAccountService, useClass: BuildingService}
  ]
})
export class BuildingModule {
}
