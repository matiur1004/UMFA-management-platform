import {Component, OnInit} from '@angular/core';
import {UserAccountNotificationViewModel} from '../../../shared/models/user-account-notification.model';
import {UserAccountService} from '../../../shared/services/user-account.service';

@Component({
  selector: 'user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.less']
})
export class UserNotificationsComponent implements OnInit {

  model: UserAccountNotificationViewModel;

  constructor(private userAccountService: UserAccountService) {
  }

  ngOnInit() {
    this.userAccountService.getNotifications().subscribe(response => {
      this.model = response;
    });
  }

  onValueChanged() {
    this.userAccountService.updateNotifications(this.model).subscribe();
  }
}
