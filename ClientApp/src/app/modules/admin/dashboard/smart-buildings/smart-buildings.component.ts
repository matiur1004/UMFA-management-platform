import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dasboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-smart-buildings',
  templateUrl: './smart-buildings.component.html',
  styleUrls: ['./smart-buildings.component.scss']
})
export class SmartBuildingsComponent implements OnInit {

  currentFilter: any;
  applyFilterTypes: any;

  dataSource: any;

  readonly allowedPageSizes = [10, 15, 20, 'All'];

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
    this.dashboardService.smartBuildings$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) {
          this.dataSource = res;
        }
      })
  }

  onRowPrepared(event) {
    if (event.rowType === "data") {}
  }

  onRowClick(event) {
    if(event.data) {
      this.dashboardService.showSmartBuildingDetails(event.data);
    }
  }
}
