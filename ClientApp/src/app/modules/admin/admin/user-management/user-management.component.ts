import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AllowedPageSizes } from '@core/helpers';
import { IopUser, Role } from '@core/models';
import { UserService } from '@shared/services';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RoleAddEditPopupComponent } from './role-add-edit-popup/role-add-edit-popup.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users: IopUser[] = [];
  roles: Role[] = [];
  
  readonly allowedPageSizes = AllowedPageSizes;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(
    private _userService: UserService,
    private _matDialog: MatDialog
  ) {
    this.onEdit = this.onEdit.bind(this);
   }

  ngOnInit(): void {
    this._userService.roles$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: Role[]) => {
        this.roles = res;
        console.log('roles', this.roles);
      })

    this._userService.users$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: IopUser[]) => {
        this.users = res.map(obj => {
          if(obj.RoleId) {
            let role = this.roles.find(item => item.RoleId == obj.RoleId);
            obj = {...obj, RoleName: role.RoleName};
          }
          return obj;
        });
        console.log('users', this.users);
      })
  }

  onEdit(e) {
    e.event.preventDefault();
    this.onAction('Edit', e.row.data);
  }

  onAction(actionType: string, item = null) {
    if(actionType == 'New' || actionType == 'Edit') {
      this._matDialog.open(RoleAddEditPopupComponent, {autoFocus: false, data: {detail: item, roleItems: this.roles}})
        .afterClosed()
        .subscribe((res) => {
          if(res) {
            let data = {user: item, roleId: res['RoleId']};
            this._userService.onUpdatePortalUserRole(data)
              .subscribe(() => {
                //this._service.getList(this.siteId).subscribe();
              })
          }
        });
    }
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
