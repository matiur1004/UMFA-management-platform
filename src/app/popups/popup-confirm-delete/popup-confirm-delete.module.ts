import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DialogConfirmDeleteComponent} from './dialog-confirm-delete/dialog-confirm-delete.component';
import {ConfirmDeleteBindDialogDirective} from './confirm-delete-bind-dialog.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule
  ],
  declarations: [
    DialogConfirmDeleteComponent,
    ConfirmDeleteBindDialogDirective
  ],
  exports: [
    ConfirmDeleteBindDialogDirective
  ],
  // entryComponents: [DialogConfirmDeleteComponent]
})
export class PopupConfirmDeleteModule {
}
