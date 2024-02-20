import {StoreModule} from '@ngrx/store';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';

import {PipesModule} from '../shared/pipes/pipes.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {AddressModule} from '../widgets/module/address.module';

import {DashboardComponent} from './dashboard/dashboard.component';
import {AdminLayoutRoutingModule} from './admin-layout-routing.module';
import {AdminLayoutComponent} from './adminLayout/admin-layout.component';
import {NavMenuComponent} from './nav-menu/nav-menu.component';
import {AdminSettingsModule} from './settings/settings.module';
import {SuppliersModule} from './suppliers/suppliers.module';
import {EquipmentModule} from './equipment/equipment.module';
import {ServicesModule} from './services/services.module';
import {UserModule} from './users/user.module';
import {BranchesModule} from './branches/branches.module';
import {metaReducers, reducers} from './shared/common-data/store/reducers';

@NgModule({
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    WidgetsModule,
    AddressModule,
    PipesModule,
    AdminSettingsModule,
    SuppliersModule,
    EquipmentModule,
    ServicesModule,
    UserModule,
    BranchesModule,
    StoreModule.forFeature('adminCommonData', reducers, {metaReducers}),
  ],
  declarations: [
    AdminLayoutComponent,
    NavMenuComponent,
    DashboardComponent
  ],
  exports: []
})
export class AdminLayoutModule {
}
