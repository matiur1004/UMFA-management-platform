import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from '../store/reducers';
import {ServicesEffects} from '../store/effects/services.effects';
import {EffectsModule} from '@ngrx/effects';
import {NgrxFormsModule} from 'ngrx-forms';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {ServiceTreeModule} from 'app/widgets/service-tree/shared/service-tree.module';
import {ServicesListComponent} from '../../services-list/services-list.component';
import {CreateServiceComponent} from '../../create-service/create-service.component';
import {ServicePricesComponent} from '../../create-service/service-prices/service-prices.component';
import {DeleteServiceComponent} from '../../delete-service/delete-service.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DirectivesModule} from 'app/shared/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StoreModule.forFeature('mcServices', reducers, {metaReducers}),
    EffectsModule.forFeature([ServicesEffects]),
    NgrxFormsModule,
    PipesModule,
    ServiceTreeModule,
    NgbModule,
    DirectivesModule,
  ],
  declarations: [
    ServicesListComponent,
    CreateServiceComponent,
    ServicePricesComponent,
    DeleteServiceComponent
  ],
  // entryComponents: [
  //   CreateServiceComponent,
  //   DeleteServiceComponent
  // ],
  exports: [
    ServicesListComponent
  ]
})
export class McServicesModule {
}
