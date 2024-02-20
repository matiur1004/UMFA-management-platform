import {NgModule} from '@angular/core';
import {SupplyTypeClassDirective} from './supply-type-class.directive';
import {DropdownAppendToBodyDirective} from './dropdown-append-to-body.directive';
import {ShowPasswordDirective} from './show-password.directive';
import {AutoFocusDirective} from './auto-focus.directive';
import {ShowMoreItemsDirective} from './show-more-items.directive';
import {AutoSelectDirective} from './auto-select.directive';
import {StoreFieldDirective} from './store-field.directive';
import {ImageOptionsDirective} from '@app/shared/directives/image-options.directive';

@NgModule({
  declarations: [
    SupplyTypeClassDirective,
    DropdownAppendToBodyDirective,
    ShowPasswordDirective,
    AutoFocusDirective,
    ShowMoreItemsDirective,
    AutoSelectDirective,
    StoreFieldDirective,
    ImageOptionsDirective
  ],
  exports: [
    SupplyTypeClassDirective,
    DropdownAppendToBodyDirective,
    ShowPasswordDirective,
    AutoFocusDirective,
    ShowMoreItemsDirective,
    AutoSelectDirective,
    StoreFieldDirective,
    ImageOptionsDirective
  ]
})
export class DirectivesModule {
}
