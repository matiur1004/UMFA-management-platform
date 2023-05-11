import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AllowedPageSizes } from '@core/helpers';
import { IopUser, IUmfaBuilding, NotificationType, Role } from '@core/models';
import { BuildingService, UserService } from '@shared/services';
import { UserNotificationScheduleService } from '@shared/services/user-notification-schedule.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RoleAddEditPopupComponent } from './role-add-edit-popup/role-add-edit-popup.component';
import { NotificationsPopupComponent } from './notifications-popup/notifications-popup.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users: IopUser[] = [];
  roles: Role[] = [];
  notificationTypes: NotificationType[] = [];
  buildings: IUmfaBuilding[];
  senderTypes: any[] = [];
  summaryTypes: any[] = [];

  readonly allowedPageSizes = AllowedPageSizes;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _userService: UserService,
    private _matDialog: MatDialog,
    private _bldService: BuildingService,
    private _userNotificationScheduleService: UserNotificationScheduleService
  ) {
    this.onEdit = this.onEdit.bind(this);
    this.onGetUserNotifications = this.onGetUserNotifications.bind(this);

   }

  ngOnInit(): void {
    this._userService.roles$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: Role[]) => {
        this.roles = res;
      })

    this._userService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: IopUser[]) => {
        this.users = res.map(obj => {
          if(obj.RoleId) {
            let role = this.roles.find(item => item.RoleId == obj.RoleId);
            obj = {...obj, RoleName: role.RoleName};
          }
          return obj;
        });
      })

    this._userService.notificationTypes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: NotificationType[]) => {
        this.notificationTypes = res;
      });

    this._bldService.buildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: IUmfaBuilding[]) => {
          this.buildings = data;
      })

    this._userNotificationScheduleService.senderTypes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
          this.senderTypes = data;
      })
      
    this._userNotificationScheduleService.summaryTypes$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
          this.summaryTypes = data;
      })
  }

  onEdit(e) {
    e.event.preventDefault();
    this.onAction('Edit', e.row.data);
  }

  onGetUserNotifications(e) {
    e.event.preventDefault();
    this.onAction('UserNotification', e.row.data);
  }

  onAction(actionType: string, item = null) {
    if(actionType == 'New' || actionType == 'Edit') {
      this._matDialog.open(RoleAddEditPopupComponent, {autoFocus: false, data: 
        { detail: item, 
          roleItems: this.roles, 
          notificationTypeItems: this.notificationTypes, 
          buildings: this.buildings,
          senderTypes: this.senderTypes,
          summaryTypes: this.summaryTypes
        }})
        .afterClosed()
        .subscribe((res) => {
          this._userService.getAllUsers().subscribe();
        });
    } else if(actionType == 'UserNotification') {
      this._matDialog.open(NotificationsPopupComponent, {autoFocus: false})
        .afterClosed()
        .subscribe((res) => {
        });
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
