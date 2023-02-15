import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AmrUserComponent } from './amr-user/amr-user.component';
import { AmrUserDetailComponent } from './amr-user/amr-user-detail.component';
import { AmrMeterComponent } from './amr-meter/amr-meter.component';
import { AmrUserEditComponent } from './amr-user/amr-user-edit/amr-user-edit.component';
import { AMRMeterDetailComponent } from './amr-meter/amr-meter-detail.component';
import { AmrMeterEditComponent } from './amr-meter/amr-meter-edit/amr-meter-edit.component';
import { UserDataResolver } from 'app/shared/resolvers/user.resolver';

const routes: Routes = [
  {
    path: '', component: AdminComponent, //redirectTo: 'amrUser', pathMatch: 'full'
    resolve: {
      data: UserDataResolver
    },
    children: [
      {
        path: '', redirectTo: 'amrUser', pathMatch: 'full'
      },
      {
        path: 'amrUser', component: AmrUserComponent,
      },
      {
        path: 'amrUser/:id', component: AmrUserDetailComponent
      },
      {
        path: 'amrMeter', component: AmrMeterComponent
      },
      {
        path: 'amrUser/edit/:opId/:asuId', component: AmrUserEditComponent
      },
      {
        path: 'amrMeter/:id', component: AMRMeterDetailComponent
      },
      {
        path: 'amrMeter/edit/:opId/:meterId', component: AmrMeterEditComponent
      }
    ]
  }
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
