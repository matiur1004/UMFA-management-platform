import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {PopupExternalLinkComponent} from '../popup.external.link.component';

@NgModule({
  imports: [
    CommonModule,
    PipesModule
  ],
  declarations: [PopupExternalLinkComponent],
  exports: [PopupExternalLinkComponent]
})
export class PopupExternalLinkModule {
}
