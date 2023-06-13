import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { DxPivotGridComponent } from 'devextreme-angular';

@Component({
  selector: 'report-result-shop',
  templateUrl: './report-result-shop.component.html',
  styleUrls: ['./report-result-shop.component.scss']
})
export class ReportResultShopComponent implements OnInit {

  dataSource: any;
  results = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('pivotGrid', { static: false }) pivotGrid: DxPivotGridComponent;
  
  constructor(private reportService: DXReportService, private cdr: ChangeDetectorRef) {
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
        { groupName: "PeriodDate", groupInterval: "year", expanded: true},
        { groupName: "PeriodDate", groupInterval: "month"},
        { groupName: "PeriodDate", groupInterval: "quarter", visible: false },
        {
          dataField: 'UsageValue',
          area: 'data',
          dataType: 'number',
          summaryType: 'avg',
          format: { type: 'fixedPoint', precision: 0 },
          caption: 'Average'
        },
        {
          dataField: 'Variance',
          area: 'data',
          dataType: 'number',
          caption: 'Variance',
          summaryType: 'avg',
          showValues: false,
          format: { type: 'percent', precision: 2},
          // format: { type: 'fixedPoint', precision: 2},
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
            item.Variance = item.Variance.replace('%', '');
            item.Variance = Number(item.Variance.replace(',', '.')) / 100;

            return item;
          });
          if(this.pivotGrid) {
            this.pivotGrid.instance.option('dataSource', this.dataSource);
          }
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
