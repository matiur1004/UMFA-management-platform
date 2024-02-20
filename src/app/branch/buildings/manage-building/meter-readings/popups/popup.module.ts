import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NgSelectModule} from '@ng-select/ng-select';

import {ImportInfoComponent} from '../popups/import-info/import-info.component';
import {WarningInfoComponent} from '../popups/warning-info/warning-info.component';
import {SelectTariffsBindDialogDirective} from './select-tariffs-bind-dialog.directive';
import {DialogSelectTariffsComponent} from './dialog-select-tariffs/dialog-select-tariffs.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {SelectTariffForNodesBindDialogDirective} from './select-tariff-for-nodes-bind-dialog.directive';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetsModule,
    NgSelectModule,
    PipesModule
  ],
  declarations: [
    WarningInfoComponent,
    ImportInfoComponent,
    SelectTariffsBindDialogDirective,
    DialogSelectTariffsComponent,
    SelectTariffForNodesBindDialogDirective
  ],
  exports: [
    WarningInfoComponent,
    SelectTariffsBindDialogDirective,
    SelectTariffForNodesBindDialogDirective
  ],
  // entryComponents: [
  //   ImportInfoComponent,
  //   DialogSelectTariffsComponent
  // ]
})
export class PopupModule {
}
