import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';

import {LayoutComponent} from './layout-tenant/layout.component';
import {WidgetsModule} from '../widgets/module/widgets.module';
import {NavMenuComponent} from './core/nav-menu/nav-menu.component';
import {TopBarComponent} from './core/top-bar/top-bar.component';
import {PipesModule} from '../shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {DashboardModule} from './dashboard/dashboard.module';
import {ProfilesModule} from './profiles/profiles.module';
import {QueriesModule} from './queries/queries.module';
import {SettingsModule} from './settings/settings.module';

import {routes} from './tenant-layout-routing.module';

@NgModule({
  declarations: [
    LayoutComponent,
    NavMenuComponent,
    TopBarComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    NgbModule,
    WidgetsModule,
    PipesModule,
    DunamisInputsModule,

    DashboardModule,
    ProfilesModule,
    QueriesModule,
    SettingsModule,

    RouterModule.forChild(routes)
  ]
})
export class TenantLayoutModule {
}
