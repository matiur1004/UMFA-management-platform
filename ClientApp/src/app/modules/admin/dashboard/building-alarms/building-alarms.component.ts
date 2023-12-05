import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-building-alarms',
  templateUrl: './building-alarms.component.html',
  styleUrls: ['./building-alarms.component.scss']
})
export class BuildingAlarmsComponent implements OnInit {

  readonly allowedPageSizes = AllowedPageSizes;
  
  applyFilterTypes: any;
  currentFilter: any;
  dataSource: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dashboardService: DashboardService,
  ) { 
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {
    this.dashboardService.buildingAlarms$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.dataSource = res;
        }
      })
  }

  onRowClick(event) {
    console.log(event);
    this.dashboardService.showTriggeredAlarms({buildingId: event.data.BuildingId, partnerId: event.data.PartnerId});
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
