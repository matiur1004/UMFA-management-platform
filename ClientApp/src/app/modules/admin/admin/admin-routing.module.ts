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
import { MeterMappingComponent } from './meter-mapping/meter-mapping.component';
import { MeterMappingResolver } from './meter-mapping/meter-mapping.resolver';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserManagementResolver } from './user-management/user-management.resolver';
import { UmfaAdministratorAuthGuard } from '@shared/infrastructures/umfa-administrator.auth.guard';
import { UmfaOperatorAuthGuard } from '@shared/infrastructures/umfa-operator.auth.guard';
import { AmrScheduleComponent } from './amr-schedule/amr-schedule.component';
import { AmrScheduleEditComponent } from './amr-schedule/amr-schedule-edit/amr-schedule-edit.component';
import { AmrScheduleResolver } from './amr-schedule/amr-schedule.resolver';
import { AmrScheduleEditResolver } from './amr-schedule/amr-schedule-edit/amr-schedule-edit.resolver';
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
        canActivate: [UmfaAdministratorAuthGuard]
      },
      {
        path: 'amrUser/:id', component: AmrUserDetailComponent,
        canActivate: [UmfaAdministratorAuthGuard]
      },
      {
        path: 'amrMeter', component: AmrMeterComponent,
        canActivate: [UmfaOperatorAuthGuard],
      },
      {
        path: 'amrUser/edit/:opId/:asuId', component: AmrUserEditComponent
      },
      {
        path: 'amrMeter/:id', component: AMRMeterDetailComponent
      },
      {
        path: 'amrMeter/edit/:opId/:meterId', component: AmrMeterEditComponent
      },
      {
        path: 'meterMapping', component: MeterMappingComponent,
        canActivate: [UmfaOperatorAuthGuard],
        resolve  : {
          data: MeterMappingResolver
        } 
      },
      {
        path: 'user-management', component: UserManagementComponent,
        canActivate: [UmfaAdministratorAuthGuard],
        resolve  : {
          data: UserManagementResolver
        }
      },
      {
        path: 'amrSchedule', component: AmrScheduleComponent,
        canActivate: [UmfaOperatorAuthGuard],
        resolve  : {
          data: AmrScheduleResolver
        }
      },
      {
        path: 'amrSchedule/edit/:id', component: AmrScheduleEditComponent,
        canActivate: [UmfaOperatorAuthGuard],
        resolve  : {
          data: AmrScheduleEditResolver
        }
      },
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
