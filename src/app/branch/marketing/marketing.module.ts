import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select'
import {DateValueAccessorModule} from 'angular-date-value-accessor';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {BankAccountService, BuildingService} from '@services';

import {BuildingSharedModule} from '../buildings/shared/building-shared.module';
import {BankAccountModule} from 'app/branch/shared/bank-accounts/bank-account.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';

import {MarketingListComponent} from './page-marketing/marketing-list.component';
import {MarketingRoutingModule} from './marketing-routing.module';

import {MarketingMapComponent} from './components/marketing-map/marketing-map.component';
import {MarketingViewComponent} from './components/marketing-view/marketing-view.component';

@NgModule({
  imports: [
    CommonModule,
    MarketingRoutingModule,
    BuildingSharedModule,
    BankAccountModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    WidgetsModule,
    DateValueAccessorModule,
  ],
  declarations: [
    MarketingListComponent,
    MarketingMapComponent,
    MarketingViewComponent
  ],
  providers: [
    {provide: BankAccountService, useClass: BuildingService}
  ]
})
export class MarketingModule {
}
