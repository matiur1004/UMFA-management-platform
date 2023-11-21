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
import { DxButtonModule, DxChartModule, DxDataGridModule, DxDateBoxModule, DxSelectBoxModule, DxTreeListModule } from 'devextreme-angular';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgSelectModule } from '@ng-select/ng-select';
import { AmrUserPasswordComponent } from './amr-user/amr-user-password/amr-user-password.component';
import { PasswordMatchDirective } from 'app/shared/validators/password-match.directive';
import { UserManagementComponent } from './user-management/user-management.component';
import { RoleAddEditPopupComponent } from './user-management/role-add-edit-popup/role-add-edit-popup.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AmrScheduleComponent } from './amr-schedule/amr-schedule.component';
import { AmrScheduleEditComponent } from './amr-schedule/amr-schedule-edit/amr-schedule-edit.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AmrMeterAssignmentsComponent } from './amr-schedule/amr-meter-assignments/amr-meter-assignments.component';
import { AmrMeterAssignmentEditComponent } from './amr-schedule/amr-meter-assignment-edit/amr-meter-assignment-edit.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';
import { SetUserNotificationComponent } from './user-notifications/set-user-notification/set-user-notification.component';
import { NotificationsPopupComponent } from './user-management/notifications-popup/notifications-popup.component';
import { MeterAlarmDetailModule } from './meter-alarm-detail/meter-alarm-detail.module';

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
    UserManagementComponent,
    RoleAddEditPopupComponent,
    AmrScheduleComponent,
    AmrScheduleEditComponent,
    AmrMeterAssignmentsComponent,
    AmrMeterAssignmentEditComponent,
    UserNotificationsComponent,
    SetUserNotificationComponent,
    NotificationsPopupComponent
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
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    NgSelectModule,
    DxDataGridModule,
    DxTreeListModule,
    DxDateBoxModule,
    DxChartModule,
    DxSelectBoxModule,
    DxButtonModule,
    MeterAlarmDetailModule,
    SharedModule
  ],
  exports: [
    RouterModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MeterAlarmDetailModule,
  ]
})
export class AdminModule { }
