import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';
import { DxDataGridComponent } from 'devextreme-angular';
import html2canvas from 'html2canvas';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: any;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

@Component({
  selector: 'report-result-utility',
  templateUrl: './report-result-utility.component.html',
  styleUrls: ['./report-result-utility.component.scss']
})
export class ReportResultUtilityComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;

  dataSource: any;
  resultsForGrid: any[] = [];
  resultsForGraph: any[] = [];
  periodList: [] = [];
  headerInfo: any;
  selectedRecovery;
  selectedExpense;

  public chartOptions: Partial<ChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private reportService: DXReportService, private _cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [
      ],
      chart: { 
        type: 'bar',
        height: 400
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['white']
      },
      xaxis: {
        categories: [],
      },
      yaxis: {
        title: {
          text: ''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ''
          }
        }
      }
    }  
  }

  ngOnInit(): void {
    this.reportService.utilityRecoveryExpense$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.selectedExpense = this.reportService.expenseItems.find(item => item.id == this.reportService.UtilityReportParams.Expenses);
          this.selectedRecovery = this.reportService.recoveriesItems.find(item => item.id == this.reportService.UtilityReportParams.Recoveries);

          this.periodList = data['PeriodList'];
          this.headerInfo = data['HeaderValues'][0];
          this.resultsForGrid = data['GridValues'].filter(item => {
            if(item['RowHeader'] == 'Client Balanced Expense' || item['RowHeader'] == 'Client Expense') {
              return this.reportService.UtilityReportParams.ClientExpenseVisible ? true : false;
            }
            if(item['RowHeader'] == 'Client Recoveries') {
              return this.reportService.UtilityReportParams.ClientRecoverableVisible ? true : false;
            }
            
            return true;
          }).sort((a, b) => {
            if(Number(a.RowNumber) > Number(b.RowNumber)) return 1;
            return -1;
          });
          this.dataSource = data['GridValues'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['ColValue'];
              else item[period] = 0;
            })
            return item;
          });
          this.resultsForGraph = data['GraphValues'];
          this.chartOptions.xaxis.categories = this.periodList;
          let seriesData = [];
          this.resultsForGraph.forEach(item => {
            let rowData = {name: item['RowHeader'], data: []};
            this.periodList.forEach(period => {
              if(period != 'Total') {
                let filteredPeriod = item['PeriodDetails'].find(obj => obj.PeriodName == period);
                if(filteredPeriod) rowData.data.push(filteredPeriod['ColValue']);
                else rowData.data.push(0);
              }
            })
            seriesData.push(rowData);
          });
          this.chartOptions.series = seriesData;
          this._cdr.detectChanges();
        } else {
          this.periodList = [];
          this.resultsForGrid = [];
          this.resultsForGraph = [];
        }
      })
  }

  onExport($event) {
    if($event.format == 'pdf') this.onExportPdf();
    else this.onExportExcel();
  }

  onExportExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('report', {views: [{showGridLines: false}]});

    worksheet.mergeCells('A1:B4');

    var logoUrl = '/assets/images/logo/logo.png';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', logoUrl, true);
    xhr.responseType = 'blob';

    var headerInfo = this.headerInfo;
    var _this = this;
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = this.response;
        
        // Create a new Image element
        var img = new Image();

        img.onload = function () {
          const image = workbook.addImage({
            buffer: blob.arrayBuffer(),
            extension: "png",
            
          });
          worksheet.addImage(image, {
            tl: { col: 0, row: 0 },
            ext: { width: 200, height: 100 },
          });  

          worksheet.mergeCells('C2:L2');
          worksheet.mergeCells('C3:L3');
          worksheet.mergeCells('C4:L4');
          worksheet.getCell('C2').value = headerInfo['RepType'];
          worksheet.getCell('C2:L2').font = {bold: true, size: 16};
          worksheet.getCell('C2').alignment  = {vertical: 'middle', horizontal: 'center'};

          worksheet.getCell('C3').value = headerInfo['BuildingName'];
          worksheet.getCell('C3:L3').font = {bold: true, size: 14};
          worksheet.getCell('C3').alignment  = {vertical: 'middle', horizontal: 'center'};

          worksheet.getCell('C4').value = headerInfo['ReconReadingInfo'];
          worksheet.getCell('C4:L4').font = {bold: false, size: 12};
          worksheet.getCell('C4').alignment  = {vertical: 'middle', horizontal: 'center'};
          
          exportDataGrid({
            component: _this.dataGrid.instance,
            worksheet,
            topLeftCell: { row: 7, column: 1 },
            autoFilterEnabled: true,
            customizeCell({ gridCell, excelCell }) {
              if (gridCell.rowType === 'data' && 
              (gridCell.data['RowHeader'] == _this.selectedRecovery['name'] || 
              gridCell.data['RowHeader'] == _this.selectedExpense['name'] || 
              gridCell.data['RowHeader'] == 'Profit / Loss') ) {
                excelCell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFBEDFE6' }, 
                };
              }
            }
          }).then(async (cellRange) => {
            var svg = document.getElementsByClassName('apexcharts-canvas')[0].children[0].outerHTML;
            const iframe = document.createElement("iframe");
            
            document.body.appendChild(iframe); //
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(svg);
            iframe.contentWindow.document.close();
            // Convert the HTML element to a canvas
            let canvas = await html2canvas(iframe.contentWindow.document.body);
            
            //Convert the canvas to a base64 image string
            const imageData = canvas.toDataURL('image/png');
            
            const image = workbook.addImage({
              base64: imageData,
              extension: "png",
            });

            const footerRowIndex = cellRange.to.row + 2;

            worksheet.addImage(image, {
              tl: { col: 0, row: footerRowIndex },
              ext: { width: 1400, height: 320 },
            });

            iframe.style.cssText = 'display: none';
          }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
              saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Utility Recovery and Expense Report.xlsx');
            });
          })
        }
        img.src = URL.createObjectURL(blob);
      }      
    };
    xhr.send();
  }

  onExportPdf() {
    const pdfDoc = new jsPDF('landscape', 'px', [800, 768]);
    let _this = this;
    const options = {
      jsPDFDocument: pdfDoc,
      topLeft: { x: 10, y: 100 },
      component: this.dataGrid.instance,
      customizeCell({ gridCell, pdfCell }) {
        if (gridCell.rowType === 'data' && 
        (gridCell.data['RowHeader'] == _this.selectedRecovery['name'] || 
        gridCell.data['RowHeader'] == _this.selectedExpense['name'] || 
        gridCell.data['RowHeader'] == 'Profit / Loss') ) {
          pdfCell.backgroundColor = '#BEDFE6';
        }
        if(gridCell.rowType == 'data') {
          pdfCell.font.size = 10;
          pdfCell.font.style = 'normal';
        } else if(gridCell.rowType === 'header') {
          pdfCell.textColor = '#000';
          pdfCell.font.size = 15;
          pdfCell.font.style = 'bold';
        }
      }
    };

    var logoUrl = '/assets/images/logo/logo.png';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', logoUrl, true);
    xhr.responseType = 'blob';

    var headerInfo = this.headerInfo;
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = this.response;

        // Create a new Image element
        var img = new Image();

        img.onload = function () {
          // Calculate the desired width and height of the image in the PDF
          // Add the image to the PDF
          pdfDoc.addImage(img, 'PNG', 10, 20, 150, 70);

          pdfDoc.setTextColor(0, 0, 0);
          pdfDoc.setFontSize(16);
          pdfDoc.text(headerInfo['RepType'], 180, 40);

          pdfDoc.setFontSize(14);
          pdfDoc.text(headerInfo['BuildingName'], 320, 60);

          pdfDoc.setFontSize(12);
          pdfDoc.text(headerInfo['ReconReadingInfo'], 320, 80);
          
          // Save or display the PDF
          exportDataGridToPdf(options).then(async () => {
            var svg = document.getElementsByClassName('apexcharts-canvas')[0].children[0].outerHTML;
            const iframe = document.createElement("iframe");
            
            document.body.appendChild(iframe); // 👈 still required
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(svg);
            iframe.contentWindow.document.close();
            // Convert the HTML element to a canvas
            let canvas = await html2canvas(iframe.contentWindow.document.body);
            
            // Convert the canvas to a base64 image string
            const imageData = canvas.toDataURL('image/png');

            pdfDoc.setFontSize(18);
            pdfDoc.text('Recovery Chart', 360, 415);
            // Add the image to the PDF
            pdfDoc.addImage(imageData, 'PNG', 20, 430, 920, 250);
            
            iframe.style.cssText = 'display: none';
            
          }).then(() => {
            pdfDoc.save('Utility Recovery and Expense Report.pdf');
          })
        };

        img.src = URL.createObjectURL(blob);
      }
    };
    xhr.send();
  }

  onCellPrepared(event) {
    if (event.rowType === "data") {
      if(event.values.indexOf(this.selectedRecovery['name']) > -1 || event.values.indexOf(this.selectedExpense['name']) > -1 || event.values.indexOf('Profit / Loss') > -1) {
        event.cellElement.style.backgroundColor = '#E8F0FE';
      }
      if(event.values.indexOf('UMFA Read') > -1) {
        event.cellElement.style.borderTop = '1px solid black';
      } 
      if (event.values.indexOf('Council Read') > -1) {
        if(!this.reportService.UtilityReportParams.UmfaReadingDatesVisible) event.cellElement.style.borderTop = '1px solid black';
      }
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
