import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from 'app/client/layout/layout.component';
import {DashboardComponent} from 'app/client/dashboard/dashboard.component';
import {ClientResolver} from './client.resolver';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {path: '', component: DashboardComponent},
      {
        path: 'buildings',
        loadChildren: () => import('app/client/buildings/shared/modules/buildings.module').then(m => m.BuildingsModule)
      },
      {
        path: 'queries',
        loadChildren: () => import('app/client/queries/shared/modules/queries.module').then(m => m.QueriesModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('app/client/settings/shared/modules/settings.module').then(m => m.SettingsModule)
      }
    ],
    resolve: {
      clientId: ClientResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ClientResolver]
})
export class ClientLayoutRoutingModule {
}
