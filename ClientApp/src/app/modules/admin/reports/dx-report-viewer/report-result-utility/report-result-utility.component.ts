import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';

@Component({
  selector: 'report-result-utility',
  templateUrl: './report-result-utility.component.html',
  styleUrls: ['./report-result-utility.component.scss']
})
export class ReportResultUtilityComponent implements OnInit {

  dataSource: any;
  results = [];
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private reportService: DXReportService) { 
    this.dataSource = {
      fields: [
        {
          dataField: 'RowHeader',
          area: 'row',
          caption: 'Service Type',
          expanded: true,
          width: 120,
          showTotals: false
        },
        {
          dataField: 'PeriodDate',
          area: 'column',
          dataType: "date",
          allowSorting: false,
        },
        { groupName: "PeriodDate", groupInterval: "month" },
        { groupName: "PeriodDate", groupInterval: "year", expanded: true},
        { groupName: "PeriodDate", groupInterval: "quarter", visible: false },
        {
          dataField: 'ColValue',
          area: 'data',
          dataType: 'number',
          caption: 'Total',
          summaryType: 'sum',
          filterValues: [null]
        }
      ],
      fieldPanel: {
        showColumnFields: true,
        showDataFields: true,
        showFilterFields: true,
        showRowFields: true,
        allowFieldDragging: true,
        visible: true,
      },
      store: []
    }
  }

  ngOnInit(): void {
    this.reportService.utilityRecoveryExpense$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        console.log('data', data);
        if(data) {
          this.results = data['GridValues'];
          if(data['GridValues'].length > 0) {
            this.dataSource['store'] = data['GridValues'].filter(item => item.ColValue != 0).map(item => {
              item.PeriodDate = new Date(item.PeriodName);
              item.ColValue = Number(item.ColValue.replaceAll(' ', ''));
              return item;
            });
          }            
        }
        
      })
  }

  exportGrid(e) {
    const workbook = new Workbook(); 
        const worksheet = workbook.addWorksheet('Utility Recovery And Expense'); 
        exportPivotGrid({ 
            worksheet: worksheet, 
            component: e.component
        }).then(function() {
            workbook.xlsx.writeBuffer().then(function(buffer: BlobPart) { 
                saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Utility Recovery And Expense.xlsx"); 
            }); 
        }); 
        e.cancel = true; 
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
