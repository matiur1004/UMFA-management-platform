import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserProfileRoutingModule} from './user-profile-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserProfilesPageComponent} from '../user-profiles-page.component';
import {ContactsComponent} from '../contacts/contacts.component';
import {ProfileDetailComponent} from '../profile-detail/profile-detail.component';
import {ManageProfileComponent} from '../profile-detail/manage-profile/manage-profile.component';
import {ManageProfileClientsComponent} from '../profile-detail/manage-profile/manage-profile-clients/manage-profile-clients.component';
import {ManageProfileUsersComponent} from '../profile-detail/manage-profile/manage-profile-users/manage-profile-users.component';
import {UserProfileComponent} from '../user-profile/user-profile.component';
import {UsersComponent} from '../users/users.component';
import {RolesComponent} from '../roles/roles.component';
import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {PopupSocialListModule} from 'app/popups/popup.social.list/shared/popup-social-list.module';
import {PopupUserModule} from 'app/popups/popup.user/shared/popup-user.module';
import {PopupUsersListModule} from 'app/popups/popup.users.list/shared/popup-users-list.module';
import {PopupUsersRolesModule} from 'app/popups/popup.user.roles/shared/popup-users-roles.module';
import {UserProfileService} from '@services';
import {AddressModule} from 'app/widgets/module/address.module';
import {WidgetsModule} from '../../../widgets/module/widgets.module';
import {UserDetailComponent} from '../users/user-detail/user-detail.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {CreateBranchContactModule} from 'app/branch/create-branch-contact/shared/create-branch-contact.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    UserProfileRoutingModule,
    PopupExternalLinkModule,
    PopupSocialListModule,
    PopupUserModule,
    PopupUsersListModule,
    PopupUsersRolesModule,
    WidgetsModule,
    AddressModule,
    CreateBranchContactModule,
    DunamisInputsModule,
    PipesModule

  ],
  declarations: [
    UserProfilesPageComponent,
    UserProfileComponent,
    ContactsComponent,
    UsersComponent,
    RolesComponent,
    UserDetailComponent,
    ProfileDetailComponent,
    ManageProfileComponent,
    ManageProfileClientsComponent,
    ManageProfileUsersComponent,
  ],
  providers: [UserProfileService],
  // entryComponents: [
  //   UserDetailComponent,
  //   ManageProfileComponent
  // ]
})
export class UserProfileModule {
}
