import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClientViewModel, RoleViewModel, UserProfileUserViewModel, UserProfileViewModel} from '@models';

@Component({
  selector: 'manage-profile',
  templateUrl: './manage-profile.component.html',
  styleUrls: ['./manage-profile.component.less']
})
export class ManageProfileComponent implements OnInit {

  model: UserProfileViewModel = new UserProfileViewModel();
  allClients: ClientViewModel[] = new Array<ClientViewModel>();
  allUsers: UserProfileUserViewModel[] = new Array<UserProfileUserViewModel>();
  allRoles: RoleViewModel[] = new Array<RoleViewModel>();
  id: string;
  showAllClients: boolean = true;

  isNew: boolean;
  tabId: string = 'tab-0'

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
