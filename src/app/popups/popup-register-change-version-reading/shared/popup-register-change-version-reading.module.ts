import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {PipesModule} from '@app/shared/pipes/pipes.module';
import {PopupRegisterChangeVersionReadingDirective} from "../popup-register-change-version-reading.directive"
import {PopupRegisterChangeVersionReadingComponent} from '../popup-register-change-version-reading.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PipesModule
  ],
  declarations: [
    PopupRegisterChangeVersionReadingComponent,
    PopupRegisterChangeVersionReadingDirective
  ],
  exports: [
    PopupRegisterChangeVersionReadingComponent,
    PopupRegisterChangeVersionReadingDirective
  ],
  // entryComponents: [PopupRegisterChangeVersionReadingComponent]
})
export class PopupRegisterChangeVersionReadingModule { }
