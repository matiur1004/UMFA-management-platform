import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartMetersComponent } from './smart-meters.component';
import { UserDataResolver } from 'app/user.resolver';
import { MeterMappingComponent } from './meter-mapping/meter-mapping.component';
import { MeterMappingResolver } from './meter-mapping/meter-mapping.resolver';
import { AlarmConfigurationComponent } from './alarm-configuration/alarm-configuration.component';
import { AlarmConfigurationResolver } from './alarm-configuration/alarm-configuration.resolver';
import { ClientAdministratorAuthGuard } from '@shared/infrastructures/client-administrator.auth.guard';

const routes: Routes = [
  {
    path: '', component: SmartMetersComponent, //redirectTo: 'amrUser', pathMatch: 'full'
    resolve: {
      data: UserDataResolver
    },
    children: [
      {
        path: '', redirectTo: 'meterMapping', pathMatch: 'full'
      },
      {
        path: 'meterMapping', component: MeterMappingComponent,
        canActivate: [ClientAdministratorAuthGuard],
        resolve  : {
          data: MeterMappingResolver
        } 
      },
      {
        path: 'alarm-configuration', component: AlarmConfigurationComponent,
        canActivate: [ClientAdministratorAuthGuard],
        resolve  : {
          data: AlarmConfigurationResolver
        }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartMetersRoutingModule { }
