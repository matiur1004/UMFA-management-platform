import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgrxFormsModule} from 'ngrx-forms';

import {PipesModule} from 'app/shared/pipes/pipes.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';

import {BuildingPeriodsComponent} from '../../building-periods.component';
import {BuildingPeriodsService} from '../../../../shared/services/building-periods.service';
import {BldPeriodsPopupComponent} from '../../bld-periods-popup/bld-periods-popup.component';
import {ConfirmRollbackComponent} from '../../confirm-rollback/confirm-rollback.component';
import {EditBldPeriodComponent} from '../../edit-bld-period/edit-bld-period.component';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {BldPeriodsValidationPopupComponent} from '../../bld-periods-validation-popup/bld-periods-validation-popup.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    NgrxFormsModule,
    WidgetsModule,
    PipesModule,
    DunamisInputsModule
  ],
  declarations: [
    BuildingPeriodsComponent,
    BldPeriodsPopupComponent,
    BldPeriodsValidationPopupComponent,
    ConfirmRollbackComponent,
    EditBldPeriodComponent
  ],
  providers: [
    BuildingPeriodsService
  ],
  exports: [
    BuildingPeriodsComponent
  ],
  // entryComponents: [
  //   ConfirmRollbackComponent,
  //   EditBldPeriodComponent,
  //   BldPeriodsValidationPopupComponent,
  // ]

})
export class BuildingPeriodsModule {
}
