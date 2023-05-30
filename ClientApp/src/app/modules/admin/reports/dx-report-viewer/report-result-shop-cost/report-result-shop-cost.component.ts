import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';

@Component({
  selector: 'report-result-shop-cost',
  templateUrl: './report-result-shop-cost.component.html',
  styleUrls: ['./report-result-shop-cost.component.scss']
})
export class ReportResultShopCostComponent implements OnInit {

  dataSource: any;
  results = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService) {
    this.dataSource = {
      fields: [
        {
          dataField: 'Tenants',
          area: 'row',
          caption: 'Tenants',
          expanded: true,
          width: 120
        },
        {
          dataField: 'Shop',
          area: 'row',
          caption: 'Shop',
          expanded: true,
          width: 120
        },
        {
          dataField: 'GroupName',
          area: 'row',
          caption: 'Group Name',
          expanded: true,
          width: 120
        },
        {
          dataField: 'PeriodDate',
          area: 'column',
          dataType: "date",
          allowSorting: true,
        },
        { groupName: "PeriodDate", groupInterval: "month", groupIndex: 0 },
        { groupName: "PeriodDate", groupInterval: "year", visible: false },
        { groupName: "PeriodDate", groupInterval: "quarter", visible: false },
        {
          dataField: 'Average',
          area: 'data',
          dataType: 'number',
          summaryType: 'avg',
          format: { type: 'fixedPoint', precision: 0 }
        },
        {
          dataField: 'Variance',
          area: 'data',
          dataType: 'percent',
          caption: 'Variance',
          summaryType: 'avg',
          showValues: false,
          format: { type: 'fixedPoint', precision: 2 },
        }
      ],
      store: []
    }
  }

  ngOnInit(): void {
    this.reportService.shopCostVariance$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
        this.results = data;
        if(data.length > 0)
          this.dataSource['store'] = data.map(item => {
            item.PeriodDate = new Date(item.PeriodName);
            item.Variance = item.Variance.replace('%', '');
            item.Variance = Number(item.Variance.replace(',', '.'));

            return item;
          });
          console.log(this.dataSource['store']);
      })
  }

  exportGrid(e) {
    const workbook = new Workbook(); 
        const worksheet = workbook.addWorksheet('ShopUsageVariance'); 
        exportPivotGrid({ 
            worksheet: worksheet, 
            component: e.component
        }).then(function() {
            workbook.xlsx.writeBuffer().then(function(buffer: BlobPart) { 
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ShopUsageVariance.xlsx"); 
            }); 
        }); 
        e.cancel = true; 
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
