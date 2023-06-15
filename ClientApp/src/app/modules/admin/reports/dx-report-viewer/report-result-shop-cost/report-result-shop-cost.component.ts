import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

@Component({
  selector: 'report-result-shop-cost',
  templateUrl: './report-result-shop-cost.component.html',
  styleUrls: ['./report-result-shop-cost.component.scss']
})
export class ReportResultShopCostComponent implements OnInit {

  dataSource: any;
  periodList = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService) {
  }

  ngOnInit(): void {
    this.reportService.shopCostVariance$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
        if(data) {
          this.periodList = data['PeriodList'];
          this.dataSource = data['TenantShopInvoiceGroupings'].filter(item => item['Average'] && item['Variance']).map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodCostDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Cost'];
              else item[period] = 0;
            })
            return item;
          })
          let totalRows = data['Totals'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodCostDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Cost'];
              else item[period] = 0;
            })
            item['Group'] = item['GroupName'];
            return item;
          })
          this.dataSource = this.dataSource.concat(totalRows);
        } else {this.dataSource = null;}
      })
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('ShopCostVariance');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ShopCostVariance.xlsx');
      });
    });
    e.cancel = true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
