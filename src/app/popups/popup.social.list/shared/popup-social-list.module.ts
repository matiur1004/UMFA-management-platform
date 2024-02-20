import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupSocialListComponent} from '../popup.social.list.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [PopupSocialListComponent],
  exports: [PopupSocialListComponent]
})
export class PopupSocialListModule {
}
