import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {BankAccountComponent} from "./bank-account/bank-account.component";
import {BankAccountsComponent} from "./bank-accounts/bank-accounts.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {WidgetsModule} from "app/widgets/module/widgets.module";
import {DunamisInputsModule} from "app/widgets/inputs/shared/dunamis-inputs.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    WidgetsModule,
    DunamisInputsModule
  ],
  declarations: [
    BankAccountsComponent,
    BankAccountComponent
  ],
  exports: [BankAccountsComponent],
  // entryComponents: [BankAccountComponent]
})
export class BankAccountModule {
}
