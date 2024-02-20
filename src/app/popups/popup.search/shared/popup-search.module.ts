import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupSearchComponent} from '../popup.search.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PopupSearchComponent],
  exports: [PopupSearchComponent]
})
export class PopupSearchModule {
}
