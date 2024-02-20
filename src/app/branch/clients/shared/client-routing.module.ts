import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientsComponent} from '../clients.component';
import {ClientComponent} from '../client.component';
import {BranchAuthGuardService} from 'app/shared/infrastructures/branch.permission.auth.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [BranchAuthGuardService],
    component: ClientsComponent,
    data: {roles: ['canViewClients', 'canManageClients']}
  },
  {path: ':id', component: ClientComponent},
  {path: 'new', component: ClientComponent},
  {path: ':id/contact/:contact', component: ClientComponent},
  {path: ':id/portfolios/:clientPortfolio', component: ClientComponent},
  {path: ':id/bankAccount/:bankAccount', component: ClientComponent},
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {
}
