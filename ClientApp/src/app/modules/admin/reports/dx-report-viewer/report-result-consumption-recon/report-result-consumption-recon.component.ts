import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DXReportService } from '@shared/services';
import { DxDataGridComponent } from 'devextreme-angular';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import { exportDataGrid as exportDataGridToExcel } from 'devextreme/excel_exporter';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import { jsPDF } from 'jspdf';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'report-result-consumption-recon',
  templateUrl: './report-result-consumption-recon.component.html',
  styleUrls: ['./report-result-consumption-recon.component.scss']
})
export class ReportResultConsumptionReconComponent implements OnInit {

  electricityRecoveriesDataSource: any;
  electricityBulkMetersDataSource: any;
  electricitySummariesDataSource: any;

  otherDataSource: any;
  otherRecoveriesDataSource: any;
  otherBulkMetersDataSource: any;
  otherSummariesDataSource: any;

  headerInfo: any;

  @ViewChild('electricityRecoveryDataGrid') electricityRecoveryDataGrid: DxDataGridComponent;
  @ViewChild('electricityBulkMeterDataGrid') electricityBulkMeterDataGrid: DxDataGridComponent;
  @ViewChild('electricitySummariesDataGrid') electricitySummariesDataGrid: DxDataGridComponent;
  
  @ViewChildren('otherRecoveryDataGrid') otherRecoveryDataGrid: QueryList<DxDataGridComponent>;
  @ViewChildren('otherBulkMeterDataGrid') otherBulkMeterDataGrid: QueryList<DxDataGridComponent>;
  @ViewChildren('otherSummariesDataGrid') otherSummariesDataGrid: QueryList<DxDataGridComponent>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private reportService: DXReportService,
    private _decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.reportService.consumptionSummaryRecon$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          this.headerInfo = data['ReportHeader'];  //DisplayName , PeriodInfo
          // Electricity Recoveries Report
          this.electricityRecoveriesDataSource = data['ElectricityRecoveries'].map(item => {
            let result = {
              Name: item['ReconDescription'],
              KWHUnits: item['KWHUsage'],
              KWHRC: item['KWHAmount'],
              kVAUnits: item['KVAUsage'],
              KVARC: item['KVAAmount'],
              BasicRC: item['BCAmount'],
              OtherRC: item['OtherAmount'],
              TotalRC: item['TotalAmt']
            };
            return result;
          });
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Potential Recoverable',
            KWHUnits: this.getTotal('KWHUsage', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmount', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsage', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmount', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmount', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmount', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmt', data['ElectricityRecoveries']),
          })
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Recoverable',
            KWHUnits: this.getTotal('KWHUsageRec', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmountRec', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsageRec', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmountRec', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmountRec', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmountRec', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmtRec', data['ElectricityRecoveries']),
          })
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Non Recoverable',
            KWHUnits: this.getTotal('KWHUsageNonRec', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmountNonRec', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsageNonRec', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmountNonRec', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmountNonRec', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmountNonRec', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmtNonRec', data['ElectricityRecoveries']),
          })

          // Electricity Bulk Meters Report
          this.electricityBulkMetersDataSource = data['ElectricityBulkMeters'].map(item => {
            let result = {
              MeterNo: item['MeterNo'],
              Description: item['DescriptionField'],
              KWHUnits: item['KWHUsage'],
              KWHRC: item['KWHAmount'],
              kVAUnits: item['KVAUsage'],
              KVARC: item['KVAAMOUNT'],
              BasicRC: item['BCAmount'],
              OtherRC: item['OtherAmount'],
              TotalRC: item['TotalAmount']
            };
            return result;
          });

          this.electricityBulkMetersDataSource.push({
            MeterNo: '',
            Description: '',
            KWHUnits: this.getTotal('KWHUsage', data['ElectricityBulkMeters']),
            KWHRC: this.getTotal('KWHAmount', data['ElectricityBulkMeters']),
            kVAUnits: this.getTotal('KVAUsage', data['ElectricityBulkMeters']),
            KVARC: this.getTotal('KVAAMOUNT', data['ElectricityBulkMeters']),
            BasicRC: this.getTotal('BCAmount', data['ElectricityBulkMeters']),
            OtherRC: this.getTotal('OtherAmount', data['ElectricityBulkMeters']),
            TotalRC: this.getTotal('TotalAmount', data['ElectricityBulkMeters']),
          })

          // Electricity Summaries Report
          this.electricitySummariesDataSource = [];
          this.electricitySummariesDataSource.push({
            Name: 'Electricity Actual Recovery',
            KWHUnits: this.getTotal('ActualKWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('ActualKWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('ActualKVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('ActualKVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('ActualBCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('ActualOtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('ActualTotalDiff', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Actual Recovery %',
            KWHUnits: this.getTotal('PercActKWHUnits', data['ElectricitySummaries']),
            KWHRC: this.getTotal('PercActKWHAmount', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('PercActKVAUnits', data['ElectricitySummaries']),
            KVARC: this.getTotal('PercActKVAAmount', data['ElectricitySummaries']),
            BasicRC: this.getTotal('PercActBC', data['ElectricitySummaries']),
            OtherRC: this.getTotal('PercActOther', data['ElectricitySummaries']),
            TotalRC: this.getTotal('PercActTotal', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Potential Recovery',
            KWHUnits: this.getTotal('KWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('KWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('KVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('KVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('BCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('OtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('TotalDiff', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Potential Recovery %',
            KWHUnits: this.getTotal('PercKWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('PercKWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('PercKVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('PercKVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('PercBCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('PercOtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('PercTotalDiff', data['ElectricitySummaries']),
          })
          // Other Report
          let serviceTypes = [];
          data['OtherRecoveries'].forEach(item => {
            if(serviceTypes.indexOf(item['ServiceName']) == -1) serviceTypes.push(item['ServiceName']);
          });

          this.otherDataSource = [];
          serviceTypes.forEach(service => {
            let report = {ServiceName: service, otherRecoveriesDataSource: [], otherBulkMetersDataSource: [], otherSummariesDataSource: []};
            
            // Other Recoveries Report
            let otherRecoveriesByService = data['OtherRecoveries'].filter(item => item['ServiceName'] == service);
            report['otherRecoveriesDataSource'] = otherRecoveriesByService.map(item => {
              let result = {
                Name: item['ReconDescription'],
                Usage: item['Usage'],
                Amount: item['Amount'],
                BCAmount: item['BCAmount'],
                TotalRC: item['TotalAmt']
              };
              return result;
            });

            report['otherRecoveriesDataSource'].push({
              Name: 'Total Potential Recoverable',
              Usage: this.getTotal('Usage', otherRecoveriesByService),
              Amount: this.getTotal('Amount', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmount', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmt', otherRecoveriesByService),
            })
            report['otherRecoveriesDataSource'].push({
              Name: 'Total Recoverable',
              Usage: this.getTotal('UsageRecoverable', otherRecoveriesByService),
              Amount: this.getTotal('AmountRecoverable', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmountRecoverable', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmtRec', otherRecoveriesByService),
            })
            report['otherRecoveriesDataSource'].push({
              Name: 'Total Non Recoverable',
              Usage: this.getTotal('UsageNonRecoverable', otherRecoveriesByService),
              Amount: this.getTotal('AmountNonRecoverable', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmountNonRecoverable', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmtNonRec', otherRecoveriesByService),
            })

            // Other Bulk Meters Report
            let otherBulkMetersByService = data['OtherBulkMeters'].filter(item => item['ServiceName'] == service);
            report.otherBulkMetersDataSource = otherBulkMetersByService.map(item => {
              let result = {
                MeterNo: item['MeterNo'],
                Description: item['DescriptionField'],
                Usage: item['Usage'],
                Amount: item['ConsAmount'],
                BCAmount: item['BCAmount'],
                TotalRC: item['TotalAmount'],
              };
              return result;
            });
            report.otherBulkMetersDataSource.push({
              MeterNo: '',
              Description: '',
              Usage: this.getTotal('Usage', otherBulkMetersByService),
              Amount: this.getTotal('ConsAmount', otherBulkMetersByService),
              BCAmount: this.getTotal('BCAmount', otherBulkMetersByService),
              TotalRC: this.getTotal('TotalAmount', otherBulkMetersByService)
            })

            // Summaries Report
            let otherSummariesByService = data['OtherSummaries'].filter(item => item['ServiceName'] == service);
            report.otherSummariesDataSource = [];
            report.otherSummariesDataSource.push({
              Name: `${service} Actual Recovery`,
              Usage: this.getTotal('ActualKLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('ActualKLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('ActualBCDiff', otherSummariesByService),
              TotalRC: this.getTotal('ActualTotalDiff', otherSummariesByService)
            })
            
            report.otherSummariesDataSource.push({
              Name: `${service} Actual Recovery %`,
              Usage: this.getTotal('PercActKLUnits', otherSummariesByService),
              Amount: this.getTotal('PercActKLAmount', otherSummariesByService),
              BCAmount: this.getTotal('PercActBC', otherSummariesByService),
              TotalRC: this.getTotal('PercActTotal', otherSummariesByService)
            })

            report.otherSummariesDataSource.push({
              Name: `${service} Potential Recovery`,
              Usage: this.getTotal('KLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('KLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('BCDiff', otherSummariesByService),
              TotalRC: this.getTotal('TotalDiff', otherSummariesByService)
            })

            report.otherSummariesDataSource.push({
              Name: `${service} Potential Recovery %`,
              Usage: this.getTotal('PercKLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('PercKLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('PercBCDiff', otherSummariesByService),
              TotalRC: this.getTotal('PercTotalDiff', otherSummariesByService)
            })
            this.otherDataSource.push(report);
          })
        } else {
          this.otherDataSource = null;
          this.electricityRecoveriesDataSource = null;
          this.electricityBulkMetersDataSource = null;
          this.electricitySummariesDataSource = null;
        }
      });
  }

  getTotal(key, source) {
    let total = 0;
    source.forEach(item => {
      total += item[key];
    })
    return total;
  }

  onCellPrepared(event) {
    if (event.rowType === "data") {
      if(event.columnIndex == 0) event.cellElement.style.fontWeight = 'bold';
    }
  }

  onExport(type) {
    if(type == 'csv') this.onExportCSV();
    else this.onExportPdf();
  }

  onExportPdf() {
    const pdfDoc = new jsPDF('landscape', 'px', [800, 768]);
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

        img.onload = async function () {
          pdfDoc.addImage(img, 'PNG', 10, 20, 150, 70);

          pdfDoc.setTextColor(0, 0, 0);
          pdfDoc.setFontSize(16);
          pdfDoc.text(headerInfo['DisplayName'], 260, 40);

          pdfDoc.setFontSize(14);
          pdfDoc.text(headerInfo['PeriodInfo'], 300, 60);

          pdfDoc.setFontSize(13);
          pdfDoc.text('Electricity Monthly Recovery statistics Excl VAT.', 40, 120);
          const lastPoint = { x: 0, y: 0 };
          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: 100 },
            component: _this.electricityRecoveryDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              if(gridCell.rowType == 'data') {
                pdfCell.font.style = 'normal';
                if(gridCell.column['index'] == 0) {
                  pdfCell.font.style = 'bold';
                }
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }   
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          })

          pdfDoc.setFontSize(13);
          pdfDoc.text('Electricity Bulk Meter', 40, lastPoint.y + 20);
          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: lastPoint.y + 5 },
            component: _this.electricityBulkMeterDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              pdfCell.font.style = 'normal';
              if(gridCell.rowType == 'data') {
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          })

          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: lastPoint.y + 5 },
            component: _this.electricitySummariesDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              pdfCell.font.style = 'bold';
              if(gridCell.rowType == 'data') {
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }          
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          })
          
          Promise.all(
            _this.otherDataSource.map(async (other, index) => {
              pdfDoc.addPage();

              pdfDoc.addImage(img, 'PNG', 10, 20, 150, 70);

              pdfDoc.setTextColor(0, 0, 0);
              pdfDoc.setFontSize(16);
              pdfDoc.text(headerInfo['DisplayName'], 260, 40);

              pdfDoc.setFontSize(14);
              pdfDoc.text(headerInfo['PeriodInfo'], 300, 60);

              pdfDoc.setFontSize(13);
              pdfDoc.text(`${other.ServiceName} Monthly Recovery statistics Excl VAT.`, 40, 120);
            })
          ).then(async () => {
            pdfDoc.setPage(2);
            let lastPointArray = [];
            await Promise.all(
            _this.otherDataSource.map(async (other, index) => {
              let lastPointY;
              await exportDataGridToPdf({
                jsPDFDocument: pdfDoc,
                topLeft: { x: 10, y: 100 },
                component: _this.otherRecoveryDataGrid.get(index).instance,
                customizeCell({ gridCell, pdfCell }) {
                  pdfCell.font.style = 'normal';
                  if(gridCell.rowType == 'data') {
                    if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                      pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                      pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                  }
                },
                customDrawCell({ rect }) {
                  lastPointY = rect.y + rect.h;
                }
              })
              
              lastPointArray.push(lastPointY)
              pdfDoc.setPage(index + 3);
            }));

            pdfDoc.setPage(2);

            await Promise.all(
              _this.otherDataSource.map(async (other, index) => {
                pdfDoc.text(`${other.ServiceName} Bulk Meter`, 40, lastPointArray[index] + 20);
                pdfDoc.setPage(index + 3);
              })
            );

            pdfDoc.setPage(2);
            await Promise.all(
              _this.otherDataSource.map(async (other, index) => {
                let prevY = lastPointArray[index];
                await exportDataGridToPdf({
                  jsPDFDocument: pdfDoc,
                  topLeft: { x: 10, y: prevY + 5 },
                  component: _this.otherBulkMeterDataGrid.get(index).instance,
                  customizeCell({ gridCell, pdfCell }) {
                    pdfCell.font.style = 'normal';
                    if(gridCell.rowType == 'data') {
                      if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                        pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                      if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                        pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    }
                  },
                  customDrawCell({ rect }) {
                    lastPointArray[index] = rect.y + rect.h;
                  }
                })
                
                pdfDoc.setPage(index + 3);
              })
            );

            pdfDoc.setPage(2);
            await Promise.all(
              _this.otherDataSource.map(async (other, index) => {
                let prevY = lastPointArray[index];
                await exportDataGridToPdf({
                  jsPDFDocument: pdfDoc,
                  topLeft: { x: 10, y: prevY + 5 },
                  component: _this.otherSummariesDataGrid.get(index).instance,
                  customizeCell({ gridCell, pdfCell }) {
                    pdfCell.font.style = 'bold';
                    if(gridCell.rowType == 'data') {
                      if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                        pdfCell.text = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                      if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                        pdfCell.text = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    }
                  },
                  customDrawCell({ rect }) {
                    lastPointArray[index] = rect.y + rect.h;
                  }
                })
                
                pdfDoc.setPage(index + 3);
              })
            );

            pdfDoc.save('Consumption Summary Recon Report.pdf');
          })

        };
        img.src = URL.createObjectURL(blob);
      }
    };
    xhr.send();
  }

  onExportCSV() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Electricity', {views: [{showGridLines: false}]});

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

        img.onload = async function () {
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
          worksheet.getCell('C2').value = headerInfo['DisplayName'];
          worksheet.getCell('C2:L2').font = {bold: true, size: 16};
          worksheet.getCell('C2').alignment  = {vertical: 'middle', horizontal: 'center'};

          worksheet.getCell('C3').value = headerInfo['PeriodInfo'];
          worksheet.getCell('C3:L3').font = {bold: true, size: 14};
          worksheet.getCell('C3').alignment  = {vertical: 'middle', horizontal: 'center'};

          worksheet.mergeCells('A7:E7');
          worksheet.getCell(`A7`).value = 'Electricity Monthly Recovery statistics Excl VAT.';
          worksheet.getCell(`A7`).font = {bold: true, size: 13};
          let cellRange = await exportDataGridToExcel({
            component: _this.electricityRecoveryDataGrid.instance,
            worksheet,
            topLeftCell: { row: 9, column: 1 },
            autoFilterEnabled: false,
            customizeCell({ gridCell, excelCell }) {
              if(gridCell.rowType == 'data') {
                if(gridCell.column['index'] == 0) {
                  excelCell.font = {
                    bold: true
                  };
                }
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }
              
            }
          })

          let footerRowIndex = cellRange.to.row;
          worksheet.mergeCells(`A${footerRowIndex + 2}:D${footerRowIndex + 2}`);
          worksheet.getCell(`A${footerRowIndex + 2}`).value = 'Electricity Bulk Meter';
          worksheet.getCell(`A${footerRowIndex + 2}`).font = {bold: true, size: 13};

          cellRange = await exportDataGridToExcel({
            component: _this.electricityBulkMeterDataGrid.instance,
            worksheet,
            topLeftCell: { row: footerRowIndex + 4, column: 1 },
            autoFilterEnabled: false,
            customizeCell({ gridCell, excelCell }) {
              if(gridCell.rowType == 'data') {
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }              
            }
          })

          footerRowIndex = cellRange.to.row;
          await exportDataGridToExcel({
            component: _this.electricitySummariesDataGrid.instance,
            worksheet,
            topLeftCell: { row: footerRowIndex + 2, column: 1 },
            autoFilterEnabled: false,
            customizeCell({ gridCell, excelCell }) {
              excelCell.font = {
                bold: true
              };
              if(gridCell.rowType == 'data') {
                if(['KWHRC', 'KVARC', 'BasicRC', 'OtherRC', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                if(['KWHUnits', 'kVAUnits'].indexOf(gridCell.column.dataField) > -1) 
                  excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
              }
            }
          })

          await Promise.all(
            _this.otherDataSource.map(async (other, index) => {
              let otherWorksheet = workbook.addWorksheet(`Other (${other.ServiceName})`, {views: [{showGridLines: false}]});

              otherWorksheet.addImage(image, {
                tl: { col: 0, row: 0 },
                ext: { width: 200, height: 100 },
              });
              
              otherWorksheet.mergeCells('C2:L2');
              otherWorksheet.mergeCells('C3:L3');
              otherWorksheet.getCell('C2').value = headerInfo['DisplayName'];
              otherWorksheet.getCell('C2:L2').font = {bold: true, size: 16};
              otherWorksheet.getCell('C2').alignment  = {vertical: 'middle', horizontal: 'center'};

              otherWorksheet.getCell('C3').value = headerInfo['PeriodInfo'];
              otherWorksheet.getCell('C3:L3').font = {bold: true, size: 14};
              otherWorksheet.getCell('C3').alignment  = {vertical: 'middle', horizontal: 'center'};

              otherWorksheet.mergeCells('A7:E7');
              otherWorksheet.getCell(`A7`).value = `${other.ServiceName} Monthly Recovery statistics Excl VAT.`;
              otherWorksheet.getCell(`A7`).font = {bold: true, size: 13};

              let otherCellRange = await exportDataGridToExcel({
                component: _this.otherRecoveryDataGrid.get(index).instance,
                worksheet: otherWorksheet,
                topLeftCell: { row: 9, column: 1 },
                autoFilterEnabled: false,
                customizeCell({ gridCell, excelCell }) {
                  if(gridCell.rowType == 'data') {
                    if(gridCell.column['index'] == 0) {
                      excelCell.font = {
                        bold: true
                      };
                    }
                    if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                        excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                      excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                  }
                }
              })

              let footerRowIndex = otherCellRange.to.row;
              otherWorksheet.mergeCells(`A${footerRowIndex + 2}:D${footerRowIndex + 2}`);
              otherWorksheet.getCell(`A${footerRowIndex + 2}`).value = `${other.ServiceName} Bulk Meter`;
              otherWorksheet.getCell(`A${footerRowIndex + 2}`).font = {bold: true, size: 13};

              otherCellRange = await exportDataGridToExcel({
                component: _this.otherBulkMeterDataGrid.get(index).instance,
                worksheet: otherWorksheet,
                topLeftCell: { row: footerRowIndex + 4, column: 1 },
                autoFilterEnabled: false,
                customizeCell({ gridCell, excelCell }) {
                  if(gridCell.rowType == 'data') {
                    if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                      excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                      excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                  }                
                }
              })

              footerRowIndex = otherCellRange.to.row;
              await exportDataGridToExcel({
                component: _this.otherSummariesDataGrid.get(index).instance,
                worksheet: otherWorksheet,
                topLeftCell: { row: footerRowIndex + 2, column: 1 },
                autoFilterEnabled: false,
                customizeCell({ gridCell, excelCell }) {
                  excelCell.font = {
                    bold: true
                  };
                  if(gridCell.rowType == 'data') {
                    if(['Amount', 'BCAmount', 'TotalRC'].indexOf(gridCell.column.dataField) > -1) 
                      excelCell.value = `R ${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                    if(['Usage'].indexOf(gridCell.column.dataField) > -1) 
                      excelCell.value = `${_this._decimalPipe.transform(Number(gridCell.value), '1.2-2')}`;
                  }
                  
                }
              })
            })
          )
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Consumption Summary Recon Report.xlsx');
          });
        }
        img.src = URL.createObjectURL(blob);
      }
    };
    xhr.send();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
