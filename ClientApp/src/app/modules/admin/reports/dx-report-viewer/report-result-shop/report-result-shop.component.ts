import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

@Component({
  selector: 'report-result-shop',
  templateUrl: './report-result-shop.component.html',
  styleUrls: ['./report-result-shop.component.scss']
})
export class ReportResultShopComponent implements OnInit {

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
          dataField: 'InvGroup',
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
          dataField: 'UsageValue',
          area: 'data',
          dataType: 'number',
          summaryType: 'avg',
          format: { type: 'fixedPoint', precision: 0 }
        },
        {
          dataField: 'UsageValue',
          area: 'data',
          dataType: 'number',
          caption: 'Variance',
          showValues: false,
          format: { type: 'fixedPoint', precision: 2 },
        }
      ],
      store: []
    }
  }

  ngOnInit(): void {
    this.reportService.shopUsageVariance$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
        this.results = data;
        if(data.length > 0)
          this.dataSource['store'] = data.map(item => {
            item.PeriodDate = new Date(item.PeriodName);
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
