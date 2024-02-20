import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

import {UserProfileService} from '@services';
import {CreateClientContactComponent} from '../create-client-contact.component';

import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {PopupSocialListModule} from 'app/popups/popup.social.list/shared/popup-social-list.module';
import {PopupUserModule} from 'app/popups/popup.user/shared/popup-user.module';
import {PopupUsersListModule} from 'app/popups/popup.users.list/shared/popup-users-list.module';
import {PopupUsersRolesModule} from 'app/popups/popup.user.roles/shared/popup-users-roles.module';
import {AddressModule} from 'app/widgets/module/address.module';
import {WidgetsModule} from '../../../widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    PopupExternalLinkModule,
    PopupSocialListModule,
    PopupUserModule,
    PopupUsersListModule,
    PopupUsersRolesModule,
    WidgetsModule,
    AddressModule,
    DunamisInputsModule
  ],
  declarations: [CreateClientContactComponent],
  providers: [UserProfileService],
  exports: [CreateClientContactComponent],
  // entryComponents: [CreateClientContactComponent]
})
export class CreateClientContactModule {
}
