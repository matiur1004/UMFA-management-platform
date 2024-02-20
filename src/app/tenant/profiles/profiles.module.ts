import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {EffectsModule} from '@ngrx/effects';

import {StoreModule} from '@ngrx/store';

import {PipesModule} from 'app/shared/pipes/pipes.module';

import {DirectivesModule} from '@app/shared/directives/directives.module';
import {DunamisInputsModule} from '@app/widgets/inputs/shared/dunamis-inputs.module';
import {WidgetsModule} from '@app/widgets/module/widgets.module';

import {TenantProfilesService} from '../shared/services/tenant-profiles.service';
import {AddNewProfileEffects} from '../store/effects/add-new-profile.effects';

import {ProfilesEffects} from '../store/effects/profiles.effects';
import {ShopDetailEffects} from '../store/effects/shop-detail.effects';
import {metaReducers, reducers} from '../store/reducers';
import {AllocatedEquipmentComponent} from './components/allocated-equipment/allocated-equipment.component';
import {CostsComponent} from './components/costs/costs.component';
import {EquipmentItemComponent} from './components/equipment-item/equipment-item.component';
import {EquipmentListComponent} from './components/equipment-list/equipment-list.component';
import {GeneralInfoComponent} from './components/general-info/general-info.component';
import {ReadingsComponent} from './components/readings/readings.component';
import {ShopDetsStatisticComponent} from './components/shop-dets-statistic/shop-dets-statistic.component';
import {SupplyTypeStatComponent} from './components/supply-type-stat/supply-type-stat.component';
import {AddNewProfileBindDialogDirective} from './dialogs/add-new-profile-bind-dialog.directive';
import {DialogAddNewProfileComponent} from './dialogs/dialog-add-new-profile/dialog-add-new-profile.component';

import {PageProfilesComponent} from './page-profiles/page-profiles.component';
import {PageShopDetailsComponent} from './page-shop-details/page-shop-details.component';
import { NgrxFormsModule } from 'ngrx-forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    GeneralInfoComponent,
    AllocatedEquipmentComponent,
    CostsComponent,
    ReadingsComponent,
    ShopDetsStatisticComponent,
    EquipmentItemComponent,
    EquipmentListComponent,
    SupplyTypeStatComponent,
    DialogAddNewProfileComponent,
    PageProfilesComponent,
    PageShopDetailsComponent,
    AddNewProfileBindDialogDirective
  ],
  providers: [
    TenantProfilesService
  ],
  // entryComponents: [
  //   DialogAddNewProfileComponent
  // ],
  exports: [
    EquipmentListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    StoreModule,
    EffectsModule,
    NgrxFormsModule,
    StoreModule.forFeature('tenantProfiles', reducers, {metaReducers}),
    EffectsModule.forFeature([ProfilesEffects, AddNewProfileEffects, ShopDetailEffects]),
    //TextMaskModule,
    NgxMaskModule,
    DunamisInputsModule,
    DirectivesModule,
    WidgetsModule,
    PipesModule
  ]
})
export class ProfilesModule {
}
