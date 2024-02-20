import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {UserAccountRoutingModule} from './user-account-routing.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';

import {UserAccountComponent} from 'app/branch/user-account/user-account.component';
import {UserGeneralInfoComponent} from 'app/branch/user-account/user-general-info/user-general-info.component';
import {UserNotificationsComponent} from 'app/branch/user-account/user-notifications/user-notifications.component';
import {UserPasswordComponent} from 'app/branch/user-account/user-password/user-password.component';
import {UserAccountService} from '../../../shared/services/user-account.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {AddressModule} from '../../../widgets/module/address.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    UserAccountRoutingModule,
    WidgetsModule,
    NgSelectModule,
    AddressModule,
    PipesModule,
    DunamisInputsModule
  ],
  declarations: [
    UserAccountComponent,
    UserGeneralInfoComponent,
    UserNotificationsComponent,
    UserPasswordComponent,
  ],
  // entryComponents: [UserAccountComponent],
  providers: [UserAccountService]
})
export class UserAccountModule {
}
