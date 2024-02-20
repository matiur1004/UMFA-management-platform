import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'popup-users-list',
  templateUrl: './popup.users.list.component.html',
  styleUrls: ['./popup.users.list.component.less']
})
export class PopupUsersListComponent implements OnInit {

  @Input() model;

  constructor() {
  }

  ngOnInit() {
  }

  getUserRoles(user) {
    return user.roles.map(role => role.name).join(', ');
  }
}
