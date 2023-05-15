import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AllowedPageSizes } from '@core/helpers';
import { UserNotificationScheduleService } from '@shared/services/user-notification-schedule.service';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notifications-popup',
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent implements OnInit {
  data: any;

  notifications: any;
  readonly allowedPageSizes = AllowedPageSizes;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _userNotificationScheduleService: UserNotificationScheduleService,
    public matDialogRef: MatDialogRef<NotificationsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    let userId = this.data.detail.Id;

    this._userNotificationScheduleService.triggeredNotifications$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        this.notifications = res;
      });

    this._userNotificationScheduleService.getActiveTriggeredAlarmNotificationsForUser(userId).subscribe();
  }

  onCustomizeDateTime(cellInfo) {
    return moment(new Date(cellInfo.value)).format('YYYY-MM-DD mm:hh:ss');
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  cancel() {
    this.matDialogRef.close();
  }
}
