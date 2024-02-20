import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxFileDropModule } from 'ngx-file-drop';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PopupShopHistoryModule} from 'app/popups/popup.shop.history/shared/popup-shop-history.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {OccupationComponent} from './page-occupation/occupation.component';
import {CreateOccupationComponent} from './create-occupation/create-occupation.component';

import {OccupationFileUploadComponent} from './components/occupation-file-upload/occupation-file-upload.component';
import {ManageShopsDetComponent} from './components/manage-shops-det/manage-shops-det.component';
import {ManageCommonAreaComponent} from './components/manage-common-area/manage-common-area.component';
import {ManageCommonAreaShopComponent} from './components/manage-common-area-shop/manage-common-area-shop.component';
import {ManageLiabilityComponent} from './components/manage-liability/manage-liability.component';
import {LiabilityTabComponent} from './components/liability-tab/liability-tab.component';
import {ManageLocationsComponent} from './components/manage-locations/manage-locations.component';
import {ManageEquipTemplatesComponent} from './components/manage-equip-templates/manage-equip-templates.component';
import {ManageAllocateTariffsComponent} from './components/manage-allocate-tariffs/manage-allocate-tariffs.component';
import {ManageBuildingPeriodComponent} from './components/manage-building-period/manage-building-period.component';
import {TariffItemComponent} from './components/tariff-item/tariff-item.component';

import {RentDetailsComponent} from './dialogs/rent-details/rent-details.component';
import {NewCommonAreaComponent} from './dialogs/new-common-area/new-common-area.component';
import {SplitShopComponent} from './dialogs/split-shop/split-shop.component';
import {CreateOrEditLocationComponent} from './dialogs/create-or-edit-location/create-or-edit-location.component';
import {UploadDataModalComponent} from './dialogs/upload-data-modal/upload-data-modal.component';
import {CreateTenantComponent} from './dialogs/create-tenant/create-tenant.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    NgbModule,
    WidgetsModule,
    PopupShopHistoryModule,
    NgSelectModule,
    DirectivesModule,
    DunamisInputsModule,
    DragDropModule
  ],
  declarations: [
    OccupationComponent,
    CreateOccupationComponent,

    OccupationFileUploadComponent,
    ManageShopsDetComponent,
    RentDetailsComponent,
    SplitShopComponent,
    ManageCommonAreaComponent,
    ManageCommonAreaShopComponent,
    ManageLiabilityComponent,
    NewCommonAreaComponent,
    LiabilityTabComponent,

    ManageLocationsComponent,
    CreateOrEditLocationComponent,
    ManageEquipTemplatesComponent,
    ManageAllocateTariffsComponent,
    ManageBuildingPeriodComponent,
    TariffItemComponent,
    UploadDataModalComponent,
    CreateTenantComponent
  ],
  // entryComponents: [
  //   RentDetailsComponent,
  //   SplitShopComponent,
  //   NewCommonAreaComponent,
  //   CreateOrEditLocationComponent,
  //   UploadDataModalComponent
  // ]
})
export class OccupationCreateModule {
}
