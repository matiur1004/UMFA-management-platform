import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {DropdownEnumInputComponent} from '../dropdown-enum-input/dropdown-enum-input.component';
import {DropdownInputComponent} from '../dropdown-input/dropdown-input.component';
import {NumberInputComponent} from '../number-input/number-input.component';
import {TextInputComponent} from '../text-input/text-input.component';
import {DirectivesModule} from '../../../shared/directives/directives.module';
import { NgrxFormsModule } from 'ngrx-forms';

@NgModule({
  declarations: [
    DropdownEnumInputComponent,
    DropdownInputComponent,
    NumberInputComponent,
    TextInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    NgbModule,
    DirectivesModule
  ],
  exports: [
    DropdownEnumInputComponent,
    DropdownInputComponent,
    NumberInputComponent,
    TextInputComponent
  ]
})
export class DunamisInputsModule {
}
