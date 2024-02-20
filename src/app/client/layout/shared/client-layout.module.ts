import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ClientLayoutRoutingModule} from './client-layout-routing.module';
import {LayoutComponent} from 'app/client/layout/layout.component';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NavMenuComponent} from 'app/client/nav-menu/nav-menu.component';
import {TopBarComponent} from 'app/client/top-bar/top-bar.component';
import {DashboardComponent} from 'app/client/dashboard/dashboard.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './store/reducers';
import {NgrxFormsModule} from 'ngrx-forms';

import {CommonDataService} from '../shared/common-data.service';

@NgModule({
  declarations: [
    LayoutComponent,
    NavMenuComponent,
    TopBarComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    ClientLayoutRoutingModule,
    WidgetsModule,
    DunamisInputsModule,
    PipesModule,
    NgrxFormsModule,
    StoreModule.forFeature('clientCommonData', reducers, {metaReducers})
  ],
  providers: [
    CommonDataService
  ],
})
export class ClientLayoutModule {
}
