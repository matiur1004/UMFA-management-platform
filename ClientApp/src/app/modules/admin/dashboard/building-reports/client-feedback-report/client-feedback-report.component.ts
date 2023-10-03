import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../dasboard.service';
import { AllowedPageSizes } from '@core/helpers';

@Component({
  selector: 'app-client-feedback-report',
  templateUrl: './client-feedback-report.component.html',
  styleUrls: ['./client-feedback-report.component.scss']
})
export class ClientFeedbackReportComponent implements OnInit {

  @Input() buildingId;
  
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
    this.onDownload = this.onDownload.bind(this);
  }

  ngOnInit(): void {
    this.dashboardService.getClientFeedbackReports(this.buildingId).subscribe();
    this.dashboardService.clientFeedbackReports$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) this.dataSource = res;
      });
  }

  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY HH:mm:ss');
  }

  onDownload(e) {
    e.event.preventDefault();
    console.log(e.row.data.Url);
    window.open(e.row.data.Url, "_blank");
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyShopOccupation();
  }

}
