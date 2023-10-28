import { Component, OnInit } from '@angular/core';
import { AllowedPageSizes } from '@core/helpers';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../dasboard.service';
import moment from 'moment';

@Component({
  selector: 'app-tenant-occupations',
  templateUrl: './tenant-occupations.component.html',
  styleUrls: ['./tenant-occupations.component.scss']
})
export class TenantOccupationsComponent implements OnInit {

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
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
    this.dashboardService.tenantOccupationsDashboard$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        console.log("fffff", res);
        if(res) this.dataSource = res;
      });
  }

  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY');
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyTenantOccupation();
  }

}
