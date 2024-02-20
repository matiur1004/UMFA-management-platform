import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule, Routes} from '@angular/router';
import {NgSelectModule} from '@ng-select/ng-select';

import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {AddressModule} from 'app/widgets/module/address.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {BranchesComponent} from './page-branches/branches.component';
import {CreateBranchComponent} from './components/create-branch/create-branch.component';
import {CreateBranchGeneralInfoComponent} from './components/general-info/general-info.component';
import {CreateBranchAdminComponent} from './branch-admin.component';
import {CreateBranchBankAccountsComponent} from './bank-accounts.component';
import {EditBranchBankAccountsComponent} from './components/add-bank-accounts/add-bank-accounts.component';
import {CreateBranchShareholdersComponent} from './components/shareholders/shareholders.component';
import {BranchComponent} from './branch.component';

import {BranchService} from './branch.service';


export const adminBranchesRoutes: Routes = [
  {path: '', component: BranchesComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgbNavModule,
    RouterModule.forChild([]/*adminBranchesRoutes*/),
    NgSelectModule,
    WidgetsModule,
    AddressModule,
    DunamisInputsModule
  ],
  providers: [BranchService],
  declarations: [
    BranchesComponent,
    BranchComponent,
    CreateBranchComponent,
    CreateBranchGeneralInfoComponent,
    CreateBranchAdminComponent,
    CreateBranchBankAccountsComponent,
    EditBranchBankAccountsComponent,
    CreateBranchShareholdersComponent
  ]
})
export class BranchesModule {
}
