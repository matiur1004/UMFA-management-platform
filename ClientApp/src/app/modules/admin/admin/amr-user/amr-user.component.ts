import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllowedPageSizes } from 'app/core/helpers';
import { IopUser } from 'app/core/models';
import { UserService } from 'app/shared/services/user.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: './amr-user.component.html',
  styleUrls: ['./amr-user.component.scss']
})
export class AmrUserComponent implements OnInit {

  user = this.userService.userValue;
  user$: Observable<IopUser>;
  readonly allowedPageSizes = AllowedPageSizes;

  constructor(private userService: UserService, private _router: Router) {
    this.onEdit = this.onEdit.bind(this);
  }

  ngOnInit(): void {
    this.user$ = this.userService.user$;
    this.userService.getUser(this.user.Id).subscribe();
  }

  onEdit(e) {
    e.event.preventDefault();
    this._router.navigate([`/admin/amrUser/edit/${this.user.Id}/${e.row.data.Id}`]);
  }

}
