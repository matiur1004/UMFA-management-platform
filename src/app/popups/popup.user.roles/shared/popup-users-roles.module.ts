import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupUserRolesComponent} from '../popup.user.roles.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PopupUserRolesComponent],
  exports: [PopupUserRolesComponent]
})
export class PopupUsersRolesModule {
}
