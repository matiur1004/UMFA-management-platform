import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../dasboard.service';
import { AllowedPageSizes } from '@core/helpers';
import { DatePipe } from '@angular/common';
import { DXReportService } from '@shared/services';

@Component({
  selector: 'app-building-feedback-report',
  templateUrl: './building-feedback-report.component.html',
  styleUrls: ['./building-feedback-report.component.scss']
})
export class BuildingFeedbackReportComponent implements OnInit {

  @Input() buildingId;
  
  periodId: any;
  periodList$ = this.reportService.obsPeriods;

  dataSource: any;
  applyFilterTypes: any;
  currentFilter: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  readonly allowedPageSizes = AllowedPageSizes;
  
  constructor(
    private dashboardService: DashboardService,
    private reportService: DXReportService
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
    this.reportService.loadPeriods(this.buildingId);
    this.dashboardService.buildingFeedbackReports$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        if(res) this.dataSource = res;
      });
  }

  custPeriodTemplate = (arg: any) => {
    const datepipe: DatePipe = new DatePipe('en-ZA');
    var ret = "<div class='custom-item' title='(" + datepipe.transform(arg.PeriodStart, 'yyyy/MM/dd') + " - " + datepipe.transform(arg.PeriodEnd, 'yyyy/MM/dd') + ")'>" + arg.PeriodName + "</div>";
    return ret;
  }
  
  onCustomizeDateTime(cellInfo) {
    if(!cellInfo.value) return 'N/A';
    return moment(new Date(cellInfo.value)).format('DD/MM/YYYY HH:mm:ss');
  }

  onDownload(e) {
    e.event.preventDefault();
    window.open(e.row.data.Url, "_blank");
  }

  requestReport() {
    this.dashboardService.submitClientFeedbackReport(this.buildingId, this.periodId).subscribe(res => {
      this.periodId = null;
    });
  }

  /**
     * On destroy
     */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
      this.dashboardService.destroyClientFeedbackReports();
  }

}
