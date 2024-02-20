import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './layout-tenant/layout.component';
import {DashboardPageComponent} from './dashboard/dashboard-page/dashboard-page.component';
import {PageProfilesComponent} from './profiles/page-profiles/page-profiles.component';
import {PageShopDetailsComponent} from './profiles/page-shop-details/page-shop-details.component';
import {PageQueriesComponent} from './queries/page-queries/page-queries.component';
import {PageSettingsComponent} from './settings/page-settings/page-settings.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', component: DashboardPageComponent},
      {path: 'profiles/:buildingId/shops/:shopId', component: PageShopDetailsComponent},
      {path: 'profiles', component: PageProfilesComponent},
      {path: 'queries', component: PageQueriesComponent},
      {path: 'settings', component: PageSettingsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantLayoutRoutingModule {
}
