import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserNotificationsService } from '@shared/services/user-notifications.service';

@Component({
  selector: 'app-set-user-notification',
  templateUrl: './set-user-notification.component.html',
  styleUrls: ['./set-user-notification.component.scss']
})
export class SetUserNotificationComponent implements OnInit {

  form: FormGroup;
  data: any;

  alarmTypes = [
    {id: 1, name: 'Night Flow'},
    {id: 2, name: 'Burst Pipe'},
    {id: 3, name: 'Leak'},
    {id: 4, name: 'Daily Usage'},
    {id: 5, name: 'Peak'},
    {id: 6, name: 'Average'},
  ];
  constructor(
    public matDialogRef: MatDialogRef<SetUserNotificationComponent>,
    private _formBuilder: FormBuilder,
    private userNotificationService: UserNotificationsService,
    @Inject(MAT_DIALOG_DATA) data
  ) { 
    this.data = data;
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      'Night Flow': [],
      'Burst Pipe': [],
      'Leak': [],
      'Daily Usage': [],
      'Peak': [],
      'Average': []
    })

    this.form.patchValue(this.data.detail);
  }

  onAlarmChange(event, type) {
    console.log(event.checked);
    let alarm = this.alarmTypes.find(item => item.name == type);
    let formData = {
      AlarmTypeId: alarm['id'],
      Enabled: event.checked,
      AMRMeterId: this.data['AMRMeterId'],
      UserId: this.data['UserId']
    };
    this.userNotificationService.setUserAlarmNotification(formData).subscribe();
  }

  close() {
    this.matDialogRef.close();
  }
}
