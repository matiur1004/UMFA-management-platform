import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgrxFormsModule} from 'ngrx-forms';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgSelectModule} from '@ng-select/ng-select';

import {reducers} from '../store/reducers';
import {SuppliersRoutingModule} from './suppliers-routing.module';
import {SuppliersComponent} from '../../suppliers.component';
import {WidgetsModule} from '../../../../widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import * as fromServices from '../services';
import * as fromGuards from '../guards';
import * as fromEffects from '../store/effects';
import * as fromManageSuppliersComponents from '../../manage-suppliers';
import * as fromModals from '../../modals';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    StoreModule.forFeature('suppliers', reducers),
    EffectsModule.forFeature([...fromEffects.effects]),
    NgrxFormsModule,
    SuppliersRoutingModule,
    WidgetsModule,
    DunamisInputsModule
  ],
  declarations: [
    SuppliersComponent,
    ...fromManageSuppliersComponents.components,
    ...fromModals.modals,
  ],
  // entryComponents: [
  //   fromModals.AddSupplierToBranchComponent,
  // ],
  providers: [
    ...fromServices.services,
    ...fromGuards.guards
  ]

})

export class SuppliersModule {
}
