import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {BuildingsComponent} from '../../buildings.component';
import {BuildingDetailsComponent} from '../../building-details/building-details.component';
import {ShopDetailsComponent} from '../../building-details/shop-details/shop-details.component';
import {SplitShopComponent} from '../../building-details/split-shop/split-shop.component';
import {RentDetailsComponent} from '../../building-details/rent-details/rent-details.component';

import {BuildingsRoutingModule} from '../modules/buildings-routing.module';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {TextMaskModule} from 'angular2-text-mask';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers, reducers} from '../store/reducers';
import {NgrxFormsModule} from 'ngrx-forms';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {ClientBuildingsService} from '../services/client-buildings.service';

import {BuildingsEffects} from '../store/effects/buildings.effects';
import {ShopEffects} from '../store/effects/shop.effects';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    WidgetsModule,
    NgrxFormsModule,
    BuildingsRoutingModule,
    StoreModule.forFeature('clientBuildings', reducers, {metaReducers}),
    EffectsModule.forFeature([BuildingsEffects, ShopEffects]),
    //TextMaskModule,
    NgxMaskModule,
    DirectivesModule,
    PipesModule,
    DunamisInputsModule
  ],
  declarations: [
    BuildingsComponent,
    BuildingDetailsComponent,
    ShopDetailsComponent,
    SplitShopComponent,
    RentDetailsComponent
  ],
  providers: [
    ClientBuildingsService
  ],
  // entryComponents: [
  //   SplitShopComponent,
  //   RentDetailsComponent
  // ]
})
export class BuildingsModule {
}
