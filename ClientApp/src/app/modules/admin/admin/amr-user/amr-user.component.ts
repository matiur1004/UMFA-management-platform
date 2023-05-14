import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllowedPageSizes } from 'app/core/helpers';
import { IopUser } from 'app/core/models';
import { UserService } from 'app/shared/services/user.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  templateUrl: './amr-user.component.html',
  styleUrls: ['./amr-user.component.scss']
})
export class AmrUserComponent implements OnInit {

  user = this.userService.userValue;
  user$: Observable<IopUser>;
  scadaUsers: any[];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;

  constructor(private userService: UserService, private _router: Router) {
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {
    this.userService.scadaUsers$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: []) => {
        this.scadaUsers = data;
        console.log(this.scadaUsers);
      })

    this.userService.getAllScadaUsers().subscribe();
    
  }

  onEdit(e) {
    e.event.preventDefault();
    this._router.navigate([`/admin/amrUser/edit/${this.user.Id}/${e.row.data.Id}`]);
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
