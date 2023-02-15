import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAmrUser, IopUser } from 'app/core/models';
import { UserService } from 'app/shared/services/user.service';

@Component({
  templateUrl: './amr-user-detail.component.html',
  styleUrls: ['./amr-user-detail.component.scss']
})
export class AmrUserDetailComponent implements OnInit {

  opUser: IopUser;
  amrUser: IAmrUser;
  errMessage: string;

  constructor(private route: ActivatedRoute, private usrService: UserService) { }

  ngOnInit(): void {
    const usrId = +this.route.snapshot.paramMap.get('id')
    this.opUser = this.usrService.userValue;
    this.amrUser = this.opUser.AmrScadaUsers.find(u => u.Id == usrId);
  }

}
