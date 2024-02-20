import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-user-roles',
  templateUrl: './popup.user.roles.component.html',
  styleUrls: ['./popup.user.roles.component.less']
})
export class PopupUserRolesComponent implements OnInit {

  @Input() userProfiles: any;
  roleCount: number = 0;

  constructor() {
  }

  ngOnInit() {

    let roles = new Set();

    this.userProfiles.forEach(userProfile => {
      userProfile.roles.forEach(role => {
        roles.add(role);
      });
    });

    this.roleCount = roles.size;
  }

}
