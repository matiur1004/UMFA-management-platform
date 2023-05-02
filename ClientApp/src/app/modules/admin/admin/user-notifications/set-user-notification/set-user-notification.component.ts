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
    console.log('sdfsdfsdf', data);
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
    this.alarmTypes.forEach(alarm => {
      let name = alarm['name'];
      if(this.data.detail[name] == 0) this.form.get(name).disable();
      if(this.data.detail[name] == 1) this.form.get(name).setValue(false);
      if(this.data.detail[name] == 2) this.form.get(name).setValue(true);
    })
  }

  onAlarmChange(event, type) {
    let alarm = this.alarmTypes.find(item => item.name == type);
    let formData = {
      AlarmTypeId: alarm['id'],
      Enabled: event.checked,
      AMRMeterId: this.data['AMRMeterId'],
      UserId: this.data['UserId']
    };
    this.userNotificationService.setUserAlarmNotification(formData).subscribe();
  }

  onAlarmClick(event, type) {
    if(this.form.get(type).value == 1) {
      event.preventDefault();
    }    
  }

  close() {
    this.matDialogRef.close();
  }
}
