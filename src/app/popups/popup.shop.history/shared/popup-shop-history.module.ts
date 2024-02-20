import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupShopHistoryComponent} from '../popup-shop-history.component';
import {PipesModule} from '@app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [PopupShopHistoryComponent],
  exports: [PopupShopHistoryComponent]
})
export class PopupShopHistoryModule {
}
