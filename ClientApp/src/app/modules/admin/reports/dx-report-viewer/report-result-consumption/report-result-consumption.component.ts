import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'report-result-consumption',
  templateUrl: './report-result-consumption.component.html',
  styleUrls: ['./report-result-consumption.component.scss']
})
export class ReportResultConsumptionComponent implements OnInit {
  dataSource: any;
  resultsForGrid: any[] = [];

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService) { }

  ngOnInit(): void {
    this.reportService.consumptionSummary$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        console.log(data);
        if(data) {
          this.resultsForGrid = data['Details'];
          this.dataSource = data['Details'];
        }
      })
  }

  onExport($event) {

  }
  
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
