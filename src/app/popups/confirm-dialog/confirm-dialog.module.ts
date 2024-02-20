import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmDialogDirective} from './confirm-dialog.directive';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogDirective,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ConfirmDialogDirective,
    ConfirmDialogComponent
  ],
  // entryComponents: [
  //   ConfirmDialogComponent
  // ]
})
export class ConfirmDialogModule {
}
