import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import moment from 'moment';
import { exportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter';
@Component({
  selector: 'report-result-consumption',
  templateUrl: './report-result-consumption.component.html',
  styleUrls: ['./report-result-consumption.component.scss']
})
export class ReportResultConsumptionComponent implements OnInit {
  
  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;
  @ViewChild('totalDataGrid') totalDataGrid: DxDataGridComponent;

  dataSource: any;
  totalGridDataSource: any;

  resultsForGrid: any[] = [];
  reportTotals: any;
  headerInfo: any;
  applyFilterTypes: any;
  currentFilter: any;
  panelOpenState = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService,
      private _cdr: ChangeDetectorRef) { 
    this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately',
    }, {
        key: 'onClick',
        name: 'On Button Click',
    }];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  ngOnInit(): void {
    this.reportService.consumptionSummary$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.resultsForGrid = data['Details'];
          this.dataSource = data['Details'].map(obj => {
            return {...obj, Tenant: `${obj['Tenant']} - ${obj['FinAccNo']}`, Recoverable: obj['Recoverable'] ? 'Recoverable' : 'Unrecoverable'};
          });
          this.reportTotals = data['ReportTotals'];
          this.headerInfo = data['Headers'][0];

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
          this._cdr.detectChanges();
        } else {
          this.dataSource = null;
        }
      })
  }

  onExport(format) {
    if(format == 'pdf') this.onExportPdf();
    else this.onExportExcel();
  }
  
  onExportExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report', {views: [{showGridLines: false}]});

    worksheet.mergeCells('A1:B4');

    const image = workbook.addImage({
      base64: `data:image/png;base64,${this.headerInfo['CustomLogo']}`,
      extension: "png",
    });
    worksheet.addImage(image, {
      tl: { col: 0, row: 0 },
      ext: { width: 280, height: 100 },
    });

    worksheet.mergeCells('C2:L2');
    worksheet.mergeCells('C3:L3');
    worksheet.mergeCells('C4:L4');
    worksheet.getCell('C2').value = this.headerInfo['Name'];
    worksheet.getCell('C2:L2').font = {bold: true, size: 16};
    worksheet.getCell('C2').alignment  = {vertical: 'middle', horizontal: 'center'};

    worksheet.getCell('C3').value = `Consumption Summary Report for Period: ${this.headerInfo['ReadingName']} (${this.headerInfo['Days']} days)`;
    worksheet.getCell('C3:L3').font = {bold: true, size: 14};
    worksheet.getCell('C3').alignment  = {vertical: 'middle', horizontal: 'center'};

    let PeriodStart = moment(new Date(this.headerInfo['PeriodStart'])).format('D MMM YYYY');
    let PeriodEnd = moment(new Date(this.headerInfo['PeriodEnd'])).format('D MMM YYYY');

    worksheet.getCell('C4').value = `Reading Period: ${PeriodStart} to ${PeriodEnd}`;
    worksheet.getCell('C4:L4').font = {bold: false, size: 12};
    worksheet.getCell('C4').alignment  = {vertical: 'middle', horizontal: 'center'};

    var _this = this;

    exportDataGrid({
      component: _this.dataGrid.instance,
      worksheet,
      topLeftCell: { row: 7, column: 1 },
      autoFilterEnabled: true,
      customizeCell({ gridCell, excelCell }) {

      }
    }).then(() => {
      const totalWorksheet = workbook.addWorksheet('Total Report', {views: [{showGridLines: false}]});
      totalWorksheet.mergeCells('A1:B4');
      totalWorksheet.addImage(image, {
        tl: { col: 0, row: 0 },
        ext: { width: 240, height: 100 },
      });

      totalWorksheet.mergeCells('C2:L2');
      totalWorksheet.mergeCells('C3:L3');
      totalWorksheet.mergeCells('C4:L4');
      totalWorksheet.getCell('C2').value = this.headerInfo['Name'];
      totalWorksheet.getCell('C2:L2').font = {bold: true, size: 16};
      totalWorksheet.getCell('C2').alignment  = {vertical: 'middle', horizontal: 'center'};

      totalWorksheet.getCell('C3').value = `Consumption Summary Report for Period: ${this.headerInfo['ReadingName']} (${this.headerInfo['Days']} days)`;
      totalWorksheet.getCell('C3:L3').font = {bold: true, size: 14};
      totalWorksheet.getCell('C3').alignment  = {vertical: 'middle', horizontal: 'center'};

      let PeriodStart = moment(new Date(this.headerInfo['PeriodStart'])).format('D MMM YYYY');
      let PeriodEnd = moment(new Date(this.headerInfo['PeriodEnd'])).format('D MMM YYYY');

      totalWorksheet.getCell('C4').value = `Reading Period: ${PeriodStart} to ${PeriodEnd}`;
      totalWorksheet.getCell('C4:L4').font = {bold: false, size: 12};
      totalWorksheet.getCell('C4').alignment  = {vertical: 'middle', horizontal: 'center'};

      exportDataGrid({
        component: _this.totalDataGrid.instance,
        worksheet: totalWorksheet,
        topLeftCell: { row: 7, column: 1 },
        autoFilterEnabled: true,
        customizeCell({ gridCell, excelCell }) {
          if(gridCell.rowType == 'data') {
            if(gridCell.column['index'] == 0) {
              excelCell.font = {
                bold: true
              };
            }
          }
        }
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Consumption Summary Report.xlsx');
        });
      })
    });
  }

  onExportPdf() {
    const context = this;
    const pdfDoc = new jsPDF('landscape', 'px', [800, 768]);
    const lastPoint = { x: 0, y: 0 };

    //header
    pdfDoc.addImage(`data:image/png;base64,${this.headerInfo['CustomLogo']}`, 'PNG', 10, 20, 150, 70);
    pdfDoc.setTextColor(0, 0, 0);
    pdfDoc.setFontSize(16);
    pdfDoc.text(this.headerInfo['Name'], 320, 40);

    pdfDoc.setFontSize(14);
    pdfDoc.text(`Consumption Summary Report for Period: ${this.headerInfo['ReadingName']} (${this.headerInfo['Days']} days)`, 320, 60);

    pdfDoc.setFontSize(12);
    let PeriodStart = moment(new Date(this.headerInfo['PeriodStart'])).format('D MMM YYYY');
    let PeriodEnd = moment(new Date(this.headerInfo['PeriodEnd'])).format('D MMM YYYY');
    pdfDoc.text(`Reading Period: ${PeriodStart} to ${PeriodEnd}`, 320, 80);

    const options = {
      jsPDFDocument: pdfDoc,
      topLeft: { x: 10, y: 80 },
      component: this.dataGrid.instance,
      customDrawCell({ rect }) {
        if (lastPoint.x < rect.x + rect.w) {
          lastPoint.x = rect.x + rect.w;
        }
        if (lastPoint.y < rect.y + rect.h) {
          lastPoint.y = rect.y + rect.h;
        }
      },
      customizeCell: ({ gridCell, pdfCell }) => {
      }
    };

    // Save or display the PDF
    exportDataGridToPdf(options).then(async () => {
      pdfDoc.addPage();
      exportDataGridToPdf({
        jsPDFDocument: pdfDoc,
        component: context.totalDataGrid.instance,
        topLeft: { x: 10, y: 20 },
        customizeCell: ({ gridCell, pdfCell }) => {          
          if(gridCell.rowType === 'header') {
            pdfCell.textColor = '#000';
            pdfCell.font.size = 18;
            pdfCell.font.style = 'bold';
          } else if(gridCell.rowType === 'data') {
            pdfCell.font.size = 14;
            pdfCell.font.style = 'normal';
            if(gridCell.column['index'] == 0) {
              pdfCell.font.style = 'bold';
            }
          }
        },
      }).then(() => {
      }).then(() => {
        pdfDoc.save('Consumption Summary Report.pdf');
      })
      
    })
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
