import {Component, OnInit} from '@angular/core';
import {UserDetailViewModel} from '../../shared/model/user.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.less']
})
export class UserContainerComponent implements OnInit {

  isNew: boolean = true;
  model: UserDetailViewModel;
  tabId: string = 'tab-0'

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onCancel() {
    this.activeModal.close(false);
  }

}
