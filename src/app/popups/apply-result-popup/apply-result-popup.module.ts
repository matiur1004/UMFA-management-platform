import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ApplyResultPopupComponent} from './apply-result-popup.component';
import {ApplyResultService} from './apply-result.service';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {PipesModule} from '@app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    PipesModule
  ],
  providers: [ApplyResultService],
  declarations: [ApplyResultPopupComponent],
  // entryComponents: [ApplyResultPopupComponent],
  exports: [ApplyResultPopupComponent]
})
export class ApplyResultPopupModule {
}
