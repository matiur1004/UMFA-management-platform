import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {RoleViewModel, UserProfileUserViewModel, UserProfileViewModel} from '@models';
import {UserProfileService} from '@services';

@Component({
  selector: 'manage-profile-users',
  templateUrl: './manage-profile-users.component.html',
  styleUrls: ['./manage-profile-users.component.less']
})
export class ManageProfileUsersComponent implements OnInit {

  @Input() model: UserProfileViewModel = new UserProfileViewModel();
  @Input() allRoles: RoleViewModel[] = new Array<RoleViewModel>();
  @Input() allUsers: UserProfileUserViewModel[] = new Array<UserProfileUserViewModel>();
  @Input() searchedUsers: UserProfileUserViewModel[] = new Array<UserProfileUserViewModel>();
  @Input() isNew: boolean;
  @Input() id: string;

  showTitle = 'All users';
  showAll = true;
  checkAll = false;
  usersAssigned = 0;
  isSubmited = false;

  constructor(private activeModal: NgbActiveModal, private userProfileService: UserProfileService) {
  }

  ngOnInit() {
    this.updateUserList();
    this.updateCheckAll();
    this.searchedUsers = this.allUsers;
  }

  updateCheckAll() {
    this.checkAll = this.usersAssigned === this.allUsers.length;
  }

  updateUserList() {
    this.allUsers.forEach(user => {

      const userProfileUser = this.model.users.find(us => us.id == user.id);
      if (userProfileUser) {
        user.roles = userProfileUser.roles;
        user.isAssigned = true;
      } else {
        user.roles = [];
      }

      if (user.isAssigned) {
        this.usersAssigned++;
      }
    });
  }

  onUserAssigned(user) {
    user.isAssigned = !user.isAssigned;
    if (user.isAssigned) {
      this.usersAssigned++;
      this.updateCheckAll();
      const newUser = new UserProfileUserViewModel();
      newUser.id = user.id;
      newUser.roles = user.roles;
      newUser.fullName = user.fullName;
      newUser.email = user.email;

      this.model.users.push(newUser);
    } else {
      this.usersAssigned--;
      this.updateCheckAll();
      user = this.model.users.find(u => u.id === user.id);
      const idx = this.model.users.indexOf(user);
      if (idx != -1) {
        this.model.users.splice(idx, 1);
      }
    }
  }

  onRoleChanged(user, event) {
    if (user.isAssigned) {
      const userProfileUser = this.model.users.find(u => u.id == user.id);
      if (userProfileUser) {
        userProfileUser.roles = user.roles;
      }
    }
  }

  dismiss() {
    this.activeModal.close({shouldReload: false});
  }

  save() {
    this.isSubmited = true;
    const usersWithRoles = this.model.users.filter(user => user.roles.length);
    if (this.model.users.length !== usersWithRoles.length) {
      return;
    }

    if (this.isNew) {
      this.userProfileService.createUserProfile(this.model).subscribe((response) => {
        this.activeModal.close({shouldReload: true, id: response.id});
      });
    } else {
      this.userProfileService.updateUserProfile(this.id, this.model).subscribe((response) => {
        this.activeModal.close({shouldReload: true});
      });
    }
  }

  onShowAll(showAll: boolean) {
    if (this.showAll === showAll) {
      return;
    }

    this.showAll = showAll;

    if (showAll) {
      this.showTitle = 'All users';
    } else {
      this.showTitle = 'Only assigned users';
    }
  }

  onCheckAll() {
    this.checkAll = !this.checkAll;

    this.allUsers.forEach(user => {
      user.isAssigned = this.checkAll;

      if (this.checkAll) {
        const newUser = new UserProfileUserViewModel();
        newUser.id = user.id;
        newUser.roles = user.roles;
        newUser.fullName = user.fullName;
        newUser.email = user.email;

        this.model.users.push(newUser);
      } else {
        this.model.users = [];
      }
    });

    if (this.checkAll) {
      this.usersAssigned = this.allUsers.length;
    } else {
      this.usersAssigned = 0;
    }
  }

  search(term: string) {
    if (!term) {
      this.searchedUsers = this.allUsers;
      return;
    }
    term = term.toLowerCase();
    this.searchedUsers = this.allUsers.filter(user => user.fullName.toLowerCase().includes(term));
  }
}
