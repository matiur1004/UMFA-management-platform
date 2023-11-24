import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleType } from '@core/models';
import { MeterService, UserService } from '@shared/services';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-smart-meters',
  templateUrl: './smart-meters.component.html',
  styleUrls: ['./smart-meters.component.scss']
})
export class SmartMetersComponent implements OnInit {

  selectedTab: number = 0;
  roleId: number;
  roleType = RoleType;
  
  detailsList: any[] = [];
  minimalTabLength = 1;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private router: Router, private _userService: UserService, private _meterService: MeterService, private _alarmConfigurationService: AlarmConfigurationService) { }

  ngOnInit(): void {
    if(location.pathname.includes('meterMapping')) this.selectedTab = 0;
    if(location.pathname.includes('alarm-configuration')) this.selectedTab = 1;

    //this.selectedTab = 6;
    this.roleId = this._userService.userValue.RoleId;

    this._meterService.detailMeterAlarm$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.detailsList.push(data);
          this.selectedTab = this.detailsList.length - 1 + 2;
        }
      });
  }

  onChange(event) {    
    this.selectedTab = event.index;
    if(event.index == 0) {
      this.router.navigate(['/smart-meters/meterMapping']);
    }
    if(event.index == 1) {
      this.router.navigate(['/smart-meters/alarm-configuration']);
    }
  }

  removeTab(index) {
    this.detailsList.splice(index, 1);
    this.selectedTab = this.roleId == this.roleType.UMFAOperator ? 1 : 3;
    //this._cdr.markForCheck();
  }

  ngOnDestroy() {
    this.detailsList = [];
    this._meterService.onSelectMeterAlarm(null);
    this._alarmConfigurationService.destroy();
    this._alarmConfigurationService.destroyAlarmDetails();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
