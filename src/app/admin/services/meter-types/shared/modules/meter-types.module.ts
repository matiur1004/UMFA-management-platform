import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../store/reducers';
import {MeterTypesEffects} from '../store/effects/meter-types.effects';
import {EffectsModule} from '@ngrx/effects';
import {NgrxFormsModule} from 'ngrx-forms';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {MeterTypesListComponent} from '../../meter-types-list/meter-types-list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {WidgetsModule} from '../../../../../widgets/module/widgets.module';
import {RouterModule} from '@angular/router';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('mcMeterTypes', reducers, {metaReducers}),
    EffectsModule.forFeature([MeterTypesEffects]),
    NgrxFormsModule,
    PipesModule,
    NgbModule,
    NgSelectModule,
    WidgetsModule,
    RouterModule,
    DunamisInputsModule
  ],
  declarations: [
    MeterTypesListComponent
  ],
  // entryComponents: [],
  exports: [
    MeterTypesListComponent
  ]
})
export class McMeterTypesModule {
}
