import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { AmrUserComponent } from './amr-user/amr-user.component';
import { AmrMeterComponent } from './amr-meter/amr-meter.component';
import { AmrUserDetailComponent } from './amr-user/amr-user-detail.component';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AmrUserEditComponent } from './amr-user/amr-user-edit/amr-user-edit.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AMRMeterDetailComponent } from './amr-meter/amr-meter-detail.component';
import { AmrMeterEditComponent } from './amr-meter/amr-meter-edit/amr-meter-edit.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReportsRoutingModule } from '../reports/reports-routing.module';
import { SharedModule } from 'app/shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { DxButtonModule, DxDataGridModule } from 'devextreme-angular';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { AmrUserPasswordComponent } from './amr-user/amr-user-password/amr-user-password.component';
import { PasswordMatchDirective } from 'app/shared/validators/password-match.directive';
import { MeterMappingComponent } from './meter-mapping/meter-mapping.component';
import { UserManagementComponent } from './user-management/user-management.component';

@NgModule({
  declarations: [
    AdminComponent,
    AmrUserComponent,
    AmrMeterComponent,
    AmrUserDetailComponent,
    AmrUserEditComponent,
    AMRMeterDetailComponent,
    AmrMeterEditComponent,
    AmrUserPasswordComponent,
    PasswordMatchDirective,
    MeterMappingComponent,
    UserManagementComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    DxDataGridModule,
    DxButtonModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class AdminModule { }
