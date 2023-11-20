import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmartMetersRoutingModule } from './smart-meters-routing.module';
import { SmartMetersComponent } from './smart-meters.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MeterAlarmDetailModule } from '../admin/meter-alarm-detail/meter-alarm-detail.module';
import { MeterMappingComponent } from './meter-mapping/meter-mapping.component';
import { AlarmConfigurationComponent } from './alarm-configuration/alarm-configuration.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { DxDataGridModule } from 'devextreme-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    SmartMetersComponent,
    MeterMappingComponent,
    AlarmConfigurationComponent
  ],
  imports: [
    CommonModule,
    SmartMetersRoutingModule,
    MatTabsModule,
    MatIconModule,
    MeterAlarmDetailModule,
    MatFormFieldModule,
    NgSelectModule,
    ReactiveFormsModule,
    DxDataGridModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule
  ],
  exports: [
    MeterAlarmDetailModule
  ]
})
export class SmartMetersModule { }
