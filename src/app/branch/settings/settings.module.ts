import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';

import {BranchSettingsRoutingModule} from './settings-routing.module';
import {WidgetsModule} from '../../widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {BranchSettingsComponent} from './page-branch-settings/settings.component';
import {BankAccountDetailComponent} from './bank-account-detail/bank-account.component';
import {MeterReadingAccountDetailComponent} from './reading-account-detail/reading-account-detail.component';


@NgModule({
  imports: [
    CommonModule,
    BranchSettingsRoutingModule,
    NgbModule,
    WidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    DunamisInputsModule
  ],
  declarations: [
    BranchSettingsComponent,
    BankAccountDetailComponent,
    MeterReadingAccountDetailComponent
  ],
  // entryComponents: [
  //   BankAccountDetailComponent,
  //   MeterReadingAccountDetailComponent
  // ]
})
export class BranchSettingsModule {
}
