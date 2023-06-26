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
  totalGridDataSource: any;

  resultsForGrid: any[] = [];
  reportTotals: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService) { }

  ngOnInit(): void {
    this.reportService.consumptionSummary$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          console.log('consumption', data);
          this.resultsForGrid = data['Details'];
          this.dataSource = data['Details'];
          this.reportTotals = data['ReportTotals'];

          this.totalGridDataSource = [];
          if(!this.reportTotals) return;
          this.reportTotals.InvoiceGroupTotals.forEach(invoice => {
            let item = {name: invoice['Name'], excl: invoice['Totals']['ConsumptionExcl'], vat: invoice['Totals']['BasicChargeExcl'], incl: invoice['Totals']['TotalExcl']};
            this.totalGridDataSource.push(item);
          })
          
          let totalItem = {name: 'Report Totals', excl: this.reportTotals['ReportTotalsExcl']['ConsumptionExcl'], vat: this.reportTotals['ReportTotalsExcl']['BasicChargeExcl'], incl: this.reportTotals['ReportTotalsExcl']['TotalExcl']};
          this.totalGridDataSource.push(totalItem);
          this.totalGridDataSource.push({name: 'Vat on individual Invoice Totals:', excl: null, vat: null, incl: this.reportTotals['Vat']});
          this.totalGridDataSource.push({name: 'Invoice Totals Incl. Vat:', excl: null, vat: null, incl: this.reportTotals['TotalIncl']});
        }
      })
  }

  onExport($event) {

  }
  
  onRowPrepared(event) {
    if (event.rowType === "data") {
      if(event.data.name == 'Report Totals' || event.data.name.indexOf('Vat on individual') > -1 || event.data.name.indexOf('Invoice Totals') > -1){
        event.rowElement.style.fontWeight = 'bold';
        event.rowElement.style.background = '#e5e5e5';
      }
    }
  }

  onCellPrepared(event) {
    if (event.rowType === "data") {
      if(event.columnIndex == 0) event.cellElement.style.fontWeight = 'bold';
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
