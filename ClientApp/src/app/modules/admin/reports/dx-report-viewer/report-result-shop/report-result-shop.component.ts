import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { AllowedPageSizes } from '@core/helpers';

@Component({
  selector: 'report-result-shop',
  templateUrl: './report-result-shop.component.html',
  styleUrls: ['./report-result-shop.component.scss']
})
export class ReportResultShopComponent implements OnInit {
  
  readonly allowedPageSizes = AllowedPageSizes;

  dataSource: any;
  periodList = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.reportService.shopUsageVariance$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.periodList = data['PeriodList'];
          this.dataSource = data['TenantShopInvoiceGroupings'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodUsageDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Usage'];
              else item[period] = 0;
            })
            return item;
          })
          let totalRows = data['Totals'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodUsageDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Usage'];
              else item[period] = 0;
            })
            return item;
          })
          this.dataSource = this.dataSource.concat(totalRows);
        } else {this.dataSource = null;}
      })
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('ShopUsageVariance');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ShopUsageVariance.xlsx');
      });
    });
    e.cancel = true;
  }
  
  onContentReady(e) {
    e.component.option('loadPanel.enabled', false);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
