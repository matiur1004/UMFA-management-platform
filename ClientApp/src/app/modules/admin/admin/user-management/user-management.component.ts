import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { IopUser, Role } from '@core/models';
import { UserService } from '@shared/services';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  users$: Observable<IopUser[]>;
  roles: Role[] = [];
  
  readonly allowedPageSizes = AllowedPageSizes;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private _userService: UserService) {
    this.onEdit = this.onEdit.bind(this);
   }

  ngOnInit(): void {
    this._userService.roles$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any[]) => {
        this.roles = res;
        console.log('roles', this.roles);
      })
  }

  onEdit(e) {
    e.event.preventDefault();
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
