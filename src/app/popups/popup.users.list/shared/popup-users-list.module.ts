import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupUsersListComponent} from '../popup.users.list.component';
import {WidgetsModule} from '../../../widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    WidgetsModule,
    DunamisInputsModule
  ],
  declarations: [PopupUsersListComponent],
  exports: [PopupUsersListComponent]
})
export class PopupUsersListModule {
}
