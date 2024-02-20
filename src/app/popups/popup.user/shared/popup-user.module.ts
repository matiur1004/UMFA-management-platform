import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupUserComponent} from '../popup.user.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [PopupUserComponent],
  exports: [PopupUserComponent]
})
export class PopupUserModule {
}
