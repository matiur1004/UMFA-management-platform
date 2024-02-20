import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {PopupConfirmRolloverComponent} from "@app/popups/popup.confirm-rollover/popup.confirm-rollover.component";


@NgModule({
  declarations: [
    PopupConfirmRolloverComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [PopupConfirmRolloverComponent]
})
export class PopupConfirmRolloverModule {
}
