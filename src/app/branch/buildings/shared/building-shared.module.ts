import {NgModule} from '@angular/core';
import {MeterRegisterNamePipe} from '@app/branch/buildings/manage-building/shared/pipes/meter-register-name.pipe';
import {MeterUnitPipe} from '@app/branch/buildings/manage-building/shared/pipes/meter-unit.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {BuildingComponent} from '../page-building/building.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {AddressModule} from '@app/widgets/module/address.module';
import {BuildingMapComponent} from '../components/building-map/building-map.component';
import {BankAccountModule} from 'app/branch/shared/bank-accounts/bank-account.module';
import {OperationsAgreementComponent} from 'app/branch/buildings/components/operations-agreement/operations-agreement.component';
import {OperationsAgreementContactsComponent} from 'app/branch/buildings/components/operations-agreement-contacts/operations-agreement-contacts.component';
import {PopupFilesListModule} from 'app/popups/popup.files.list/shared/popup-files-list.module';
import {BuildingsMapComponent} from '../components/buildings-map/buildings-map.component';
import {PopupMapinfoComponent} from '../components/popup.mapinfo/popup.mapinfo.component';
import {BuildingServicesComponent} from 'app/branch/buildings/building-services/building-services.component';
import {ServiceTreeModule} from 'app/widgets/service-tree/shared/service-tree.module';
import {PackageCustomizationComponent} from 'app/branch/buildings/building-services/package-customization/package-customization.component';
import {PackageInfoPopupComponent} from '../building-services/package-info-popup/package-info-popup.component';

import * as buildingServices from '../building-services/shared/store/reducers';
import {BuildingServicesEffects} from 'app/branch/buildings/building-services/shared/store/effects/building-services.effects';
import {BuildingServicesService} from 'app/branch/buildings/building-services/shared/building-services.service';
import {MeterInfoPopupComponent} from '../building-services/meter-info-popup/meter-info-popup.component';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {DirectivesModule} from '@app/shared/directives/directives.module';
import {RegisterUnitPipe} from '../manage-building/shared/pipes/register-unit.pipe';
import {SearchFormComponent} from '../manage-building/building-equipment/shared/components/search-form/search-form.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {CheckVirtualRegisterPipe} from '@app/branch/buildings/manage-building/shared/pipes/check-virtual-register.pipe';
import {ConflictsComponent} from "../manage-building/building-equipment/shared/components/conflicts/conflicts.component";
import {CheckTypeOfRegisterPipe} from "@app/branch/buildings/manage-building/shared/pipes/check-type-of-register.pipe";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsModule,
    DunamisInputsModule,
    AddressModule,
    NgSelectModule,
    BankAccountModule,
    PopupFilesListModule,
    NgbModule,
    PipesModule,
    DirectivesModule,
    ServiceTreeModule,
    StoreModule.forFeature('buildingServices', buildingServices.reducers, {metaReducers: buildingServices.metaReducers}),
    EffectsModule.forFeature([BuildingServicesEffects])
  ],
  declarations: [
    BuildingComponent,
    BuildingMapComponent,
    OperationsAgreementComponent,
    OperationsAgreementContactsComponent,
    BuildingsMapComponent,
    PopupMapinfoComponent,
    BuildingServicesComponent,
    PackageCustomizationComponent,
    PackageInfoPopupComponent,
    MeterInfoPopupComponent,
    RegisterUnitPipe,
    MeterRegisterNamePipe,
    CheckVirtualRegisterPipe,
    CheckTypeOfRegisterPipe,
    MeterUnitPipe,
    SearchFormComponent,
    ConflictsComponent
  ],
  exports: [
    BuildingComponent,
    BuildingsMapComponent,
    RegisterUnitPipe,
    MeterRegisterNamePipe,
    CheckTypeOfRegisterPipe,
    CheckVirtualRegisterPipe,
    MeterUnitPipe,
    SearchFormComponent,
    ConflictsComponent
  ],
  providers: [
    BuildingServicesService
  ]
})
export class BuildingSharedModule {
}
