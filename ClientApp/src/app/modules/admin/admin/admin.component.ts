import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleType } from '@core/models';
import { MeterService, UserService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  selectedTab: number = 0;
  roleId: number;
  roleType = RoleType;
  
  detailsList: any[] = [];
  minimalTabLength = 6;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private router: Router, private _userService: UserService, private _meterService: MeterService) { }

  ngOnInit(): void {
    if(location.pathname.includes('amrUser')) this.selectedTab = 0;
    if(location.pathname.includes('user-management')) this.selectedTab = 1;
    if(location.pathname.includes('amrMeter')) this.selectedTab = 2;
    if(location.pathname.includes('amrSchedule')) this.selectedTab = 3;
    if(location.pathname.includes('user-notifications')) this.selectedTab = 4;

    //this.selectedTab = 6;
    this.roleId = this._userService.userValue.RoleId;
  }

  onChange(event) {    
    this.selectedTab = event.index;
    if(this.roleId == this.roleType.UMFAOperator) {
      if(event.index == 0) {
        this.router.navigate(['/admin/amrMeter']);
      }
      if(event.index == 1) {
        this.router.navigate(['/admin/amrSchedule']);
      }
      if(event.index == 2) {
        this.router.navigate(['/admin/user-notifications']);
      }  
    } else {
      if(event.index == 0) {
        this.router.navigate(['/admin/amrUser']);
      }
      if(event.index == 1) {
        this.router.navigate(['/admin/user-management']);
      }
      if(event.index == 2) {
        this.router.navigate(['/admin/amrMeter']);
      }
      if(event.index == 3) {
        this.router.navigate(['/admin/amrSchedule']);
      }
      if(event.index == 4) {
        this.router.navigate(['/admin/user-notifications']);
      }
    }
  }

  removeTab(index) {
    this.detailsList.splice(index, 1);
    this.selectedTab = this.roleId == this.roleType.UMFAOperator ? 3 : 5;
  }

  ngOnDestroy() {
    this.detailsList = [];
    this._meterService.onSelectMeterAlarm(null);
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
