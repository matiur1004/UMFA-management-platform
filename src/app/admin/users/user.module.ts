import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserRoutingModule} from './user-routing.module';
import {UsersComponent} from 'app/admin/users/users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddressModule} from '../../widgets/module/address.module';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {WidgetsModule} from '../../widgets/module/widgets.module';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserComponent} from './user.component';
import {RolesComponent} from './roles/roles.component';
import {UserService} from './shared/user.service';
import {ResetPasswordComponent} from './user-detail/reset-password.component';
import {UserContainerComponent} from './user-detail/user-container/user-container.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';


@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    AddressModule,
    PopupExternalLinkModule,
    WidgetsModule,
    NgSelectModule,
    DunamisInputsModule
  ],
  providers: [UserService],
  declarations: [
    UsersComponent,
    UserContainerComponent,
    UserDetailComponent,
    RolesComponent,
    UserComponent,
    ResetPasswordComponent
  ],
  // entryComponents: [UserDetailComponent, ResetPasswordComponent, UserContainerComponent]
})
export class UserModule {
}
