import {NgModule} from '@angular/core';
import {StepItemsComponent} from '../step-items/step-items.component';
import {StepItemComponent} from '../step-items/step-item/step-item.component';
import {NgrxFormsModule} from 'ngrx-forms';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {TextMaskModule} from 'angular2-text-mask';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';

const components = [
  StepItemsComponent,
  StepItemComponent
];


@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    NgSelectModule,
    //TextMaskModule,
    NgxMaskModule,
    WidgetsModule,
    NgbModule,
    DunamisInputsModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class TariffStepsModule {
}
