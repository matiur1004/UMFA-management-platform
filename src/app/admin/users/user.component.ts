import {Component, OnInit, ViewChild} from '@angular/core';
import {MCAccessPermission} from '@models';
import {Subscription} from 'rxjs';
import {PermissionService} from '@services';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserContainerComponent} from './user-detail/user-container/user-container.component';
import {UserDetailViewModel} from './shared/model/user.model';
import {UsersComponent} from './users.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  accessPermission: MCAccessPermission;
  permissionChangedSubject: Subscription;
  tabId: string = 'tabId-0'
  @ViewChild(UsersComponent, {static: false}) usersComponent: UsersComponent;

  constructor(private permissionService: PermissionService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.accessPermission = this.permissionService.mcAccessPermission;
    this.permissionChangedSubject = this.permissionService.getMCPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });
  }

  ngOnDestroy(): void {
    this.permissionChangedSubject.unsubscribe();
  }

  onCreate() {
    const modalRef = this.modalService.open(UserContainerComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = new UserDetailViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.result.then(shouldReload => {
      if (shouldReload) {
        this.usersComponent.loadData();
      }
    }, () => {
    });
  }

}
