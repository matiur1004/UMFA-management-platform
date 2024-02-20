import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {ClientRoutingModule} from './client-routing.module';
import {WidgetsModule} from '../../../widgets/module/widgets.module';
import {ClientsComponent} from '../clients.component';
import {ClientComponent} from '../client.component';
import {BankAccountModule} from '../../shared/bank-accounts/bank-account.module';
import {ClientPortfoliosComponent} from '../client-portfolios/client-portfolios.component';
import {CreatePortfolioComponent} from '../client-portfolios/create-portfolio/create-portfolio.component';
import {ClientGeneralInfoComponent} from '../client-general-info/client-general-info.component';
import {ClientContactsComponent} from '../client-contacts/client-contacts.component';
import {CreateClientContactModule} from 'app/branch/create-client-contact/shared/create-client-contact.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClientService} from './client.service';
import {AddressModule} from 'app/widgets/module/address.module';
import {BankAccountService} from '@services';
import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {PopupSocialListModule} from 'app/popups/popup.social.list/shared/popup-social-list.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BankAccountModule,
    NgbModule,
    AddressModule,
    WidgetsModule,
    PopupExternalLinkModule,
    PopupSocialListModule,
    NgSelectModule,
    CreateClientContactModule,
    DunamisInputsModule
  ],
  declarations: [
    ClientsComponent,
    ClientComponent,
    ClientPortfoliosComponent,
    CreatePortfolioComponent,
    ClientGeneralInfoComponent,
    ClientContactsComponent,
  ],
  // entryComponents: [CreatePortfolioComponent],
  providers: [
    ClientService,
    {provide: BankAccountService, useClass: ClientService}
  ]
})
export class ClientModule {
}
