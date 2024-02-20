import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NgrxFormsModule} from 'ngrx-forms';
import {QueriesComponent} from '../../queries.component';
import {QueriesRoutingModule} from '../modules/queries-routing.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    WidgetsModule,
    NgrxFormsModule,
    QueriesRoutingModule,
    DunamisInputsModule
  ],
  providers: [],
  declarations: [
    QueriesComponent
  ],
})
export class QueriesModule {
}
