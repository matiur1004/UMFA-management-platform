import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil} from 'rxjs';
import { OnDestroy } from '@angular/core';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { DxDataGridComponent } from 'devextreme-angular';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';
import jsPDF from 'jspdf';

@Component({
  selector: 'report-result',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './report-result.component.html',
  styleUrls: [ 
    "./report-result.component.scss",
  ]
})
export class ReportResultComponent implements OnInit, AfterViewInit, OnDestroy {
  
  dataSource: any;
  periodList: any[] = [];
  periodIdList: [] = [];
  periodDetails = [];
  tenantDatasource: any;
  bulkMeterDatasource: any;
  councilDatasource: any;

  @ViewChild('tenantDataGrid') tenantDataGrid: DxDataGridComponent;
  @ViewChild('bulkMeterDataGrid') bulkMeterDataGrid: DxDataGridComponent;
  @ViewChild('councilDataGrid') councilDataGrid: DxDataGridComponent;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private reportService: DXReportService) {
  }

  get reportType(): string {
    return this.reportService.BuildingRecoveryParams ? this.reportService.BuildingRecoveryParams.Utility : '';
  }

  ngOnInit(): void {
    this.reportService.buildingRecovery$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.dataSource = null;
        if(data) {
          this.dataSource = data;
          this.periodList = this.dataSource.TenantReportData.Data.map(item => item['Month']);
          this.periodIdList = this.dataSource.TenantReportData.Data.map(item => item['PeriodId']);
          this.periodDetails = this.dataSource.TenantReportData.Data.map(item => {
            return {StartDate: item['StartDate'], EndDate: item['EndDate'], PeriodDays: item['PeriodDays']};
          })         

          this.tenantDatasource = []; this.bulkMeterDatasource = []; this.councilDatasource = [];
          let tenantItemList =  this.dataSource.TenantReportData.Data[0]['Details'].map(obj => obj['ItemName']);
          let bulkItemList =  this.dataSource.BulkReportData.Data[0]['Details'].map(obj => obj['ItemName']);
          //bulkItemList.push('Total');

          let councilItemList = this.dataSource.CouncilReportData.Data[0]['Details'].map(obj => obj['ItemName']);
          //councilItemList.push('Total');

          if(this.reportService.BuildingRecoveryParams.Utility == 'Electricity' || this.reportService.BuildingRecoveryParams.Utility == 'Disel') {
            let rowData = {};
            this.periodIdList.forEach(id => {
              rowData['ItemName'] = 'Electricity Recovery';
              rowData[id + '_kwh'] = 'kWh';
              rowData[id + '_kva'] = 'kVa';
              rowData[id + '_total'] = 'Total R/C';
            })
            this.tenantDatasource.push(rowData);
            this.bulkMeterDatasource.push({...rowData, ItemName: ''});
            this.councilDatasource.push({...rowData, ItemName: ''});

            tenantItemList.forEach(itemName => {
              let rowData: any = {};
              rowData['ItemName'] = itemName;
              this.dataSource.TenantReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                rowData[data['PeriodId'] + '_kwh'] = detail['KWhUsage'];
                rowData[data['PeriodId'] + '_kva'] = detail['KVAUsage'];
                rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;
              })
              this.tenantDatasource.push(rowData);
            })

            bulkItemList.forEach(itemName => {
              let rowData = {};
              rowData['ItemName'] = itemName;
              this.dataSource.BulkReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                if(detail) {
                  rowData[data['PeriodId'] + '_kwh'] = detail['KWhUsage'];
                  rowData[data['PeriodId'] + '_kva'] = detail['KVAUsage'];
                  rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;  
                } else {
                  rowData[data['PeriodId'] + '_kwh'] = 0;
                  rowData[data['PeriodId'] + '_kva'] = 0;
                  rowData[data['PeriodId'] + '_total'] = `R 0`;
                }
                
              })
              this.bulkMeterDatasource.push(rowData);
            });

            councilItemList.forEach(itemName => {
              let rowData = {};
              rowData['ItemName'] = itemName;
              this.dataSource.CouncilReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                if(detail) {
                  rowData[data['PeriodId'] + '_kwh'] = detail['KWhUsage'];
                  rowData[data['PeriodId'] + '_kva'] = detail['KVAUsage'];
                  rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;
                } else {
                  rowData[data['PeriodId'] + '_kwh'] = 0;
                  rowData[data['PeriodId'] + '_kva'] = 0;
                  rowData[data['PeriodId'] + '_total'] = `R 0`;
                }
                
              })
              this.councilDatasource.push(rowData);
            });
          } else {
            let rowData = {};
            this.periodIdList.forEach(id => {
              rowData['ItemName'] = this.reportService.BuildingRecoveryParams.Utility + ' Recovery';
              rowData[id + '_KL'] = 'KL';
              rowData[id + '_total'] = 'Total R/C';
            })
            this.tenantDatasource.push(rowData);
            this.bulkMeterDatasource.push({...rowData, ItemName: ''});
            this.councilDatasource.push({...rowData, ItemName: ''});

            //KLUsage
            tenantItemList.forEach(itemName => {
              let rowData: any = {};
              rowData['ItemName'] = itemName;
              this.dataSource.TenantReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                rowData[data['PeriodId'] + '_KL'] = detail['KLUsage'];
                rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;
              })
              this.tenantDatasource.push(rowData);
            })

            bulkItemList.forEach(itemName => {
              let rowData = {};
              rowData['ItemName'] = itemName;
              this.dataSource.BulkReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                if(detail) {
                  rowData[data['PeriodId'] + '_KL'] = detail['KLUsage'];
                  rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;
                } else {
                  rowData[data['PeriodId'] + '_KL'] = 0;
                  rowData[data['PeriodId'] + '_total'] = `R 0`;
                }
                
              })
              this.bulkMeterDatasource.push(rowData);
            });

            councilItemList.forEach(itemName => {
              let rowData = {};
              rowData['ItemName'] = itemName;
              this.dataSource.CouncilReportData.Data.forEach(data => {
                let detail = data['Details'].find(obj => obj['ItemName'] == itemName);
                if(detail) {
                  rowData[data['PeriodId'] + '_KL'] = detail['KLUsage'];
                  rowData[data['PeriodId'] + '_total'] = `R ${detail['TotalAmount']}`;
                } else {
                  rowData[data['PeriodId'] + '_KL'] = 0;
                  rowData[data['PeriodId'] + '_total'] = `R 0`;
                }
              })
              this.councilDatasource.push(rowData);
            });
          }
          
        }
      });
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  onCustomizeElements(event) {
  }
  
  CustomizeMenuActions(event) {
  }

  get ShowPage(): boolean {
    return this.reportService.ShowResultsPage();
  }

  onCellPrepared(event, type) {
    // || event.data.ItemName == 'Electricity Bulk Meter' || event.data.ItemName == 'Electricity Council Acc'
    if (event.rowType === "data") {
      if(event.columnIndex == 0) event.cellElement.style.fontWeight = 'bold';
      if(event.data.ItemName == 'Electricity Recovery' && type == 'tenant') {
        event.cellElement.style.backgroundColor = '#ececec';
        if(event.value != 'Electricity Recovery') event.cellElement.style.textAlign = "center";
      } else if(event.data.ItemName == '' && type == 'bulkMeter') {
        if(event.value != 'Electricity Recovery') event.cellElement.style.textAlign = "center";
      } else if(event.data.ItemName == '' && type == 'council') {
        if(event.value != '') event.cellElement.style.textAlign = "center";
      } else {
        if(event.columnIndex != 0) event.cellElement.style.textAlign = "right";
      }
    } else if(event.rowType == 'header'){
      event.cellElement.style.color = "#000";
      event.cellElement.style.textAlign = "center";
      if(type != 'tenant') {
        event.cellElement.style.backgroundColor = "#ececec";
        if(event.columnIndex == 0) { event.cellElement.style.textAlign = "left"; event.cellElement.style.fontWeight = 'bold';}
      }
      if(event.column.isBand) event.cellElement.style.fontWeight = 'bold';
      if(event.column.isBand && event.column.caption == 'Total') event.cellElement.style.backgroundColor = "#ccc";
      if(event.column.isBand && event.column.caption != 'Total' && event.columnIndex != 0) {
        event.cellElement.style.color = "#fff";        
        event.cellElement.style.backgroundColor = '#00b3e7';
      }
      if(event.column.isBand && event.columnIndex == 0) {
        event.cellElement.style.borderWidth = 0;
      }
    }
  }

  export(){
    let pdfWidth = (this.reportService.BuildingRecoveryParams.Utility == 'Electricity' ? 165 : 140 ) * (this.periodList.length + 2);
    const pdfDoc = new jsPDF('landscape', 'px', [800, pdfWidth]);
    var logoUrl = '/assets/images/logo/logo.png';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', logoUrl, true);
    xhr.responseType = 'blob';

    var _this = this;
    
    xhr.onload = function (e) {
      if (this.status === 200) {
        var blob = this.response;

        // Create a new Image element
        var img = new Image();

        img.onload = async function () {
          pdfDoc.addImage(img, 'PNG', 40, 20, 150, 70);

          pdfDoc.setFontSize(24);
          pdfDoc.text(_this.dataSource.Title, pdfWidth / 2 - 120, 60);

          const lastPoint = { x: 0, y: 0 };
          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: 100 },
            component: _this.tenantDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              if(gridCell.rowType == 'header'){
                pdfCell.textColor = "#000";
                pdfCell.horizontalAlign = 'center';
                pdfCell.font.size = 12;
                if(gridCell.column.isBand && pdfCell.text == 'Total') pdfCell.backgroundColor = "#ccc";
                if(gridCell.column.isBand && pdfCell.text != 'Total' && gridCell.column.visibleIndex != 0) {
                  pdfCell.textColor = "#fff";        
                  pdfCell.backgroundColor = '#00b3e7';
                }
                if(gridCell.column.isBand && gridCell.column.visibleIndex == 0) {
                  pdfCell.borderWidth = 0;
                }
              } else {
                pdfCell.textColor = "#000";
                pdfCell.font.size = 11;
                if(gridCell.data.ItemName == 'Electricity Recovery') {
                  pdfCell.backgroundColor = '#ececec';
                  //if(event.value != 'Electricity Recovery') event.cellElement.style.textAlign = "center";
                }
              }
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          });

          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: lastPoint.y + 5 },
            component: _this.bulkMeterDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              if(gridCell.rowType == 'header'){
                pdfCell.textColor = "#000";
                pdfCell.horizontalAlign = 'center';
                pdfCell.font.size = 12;
                if(gridCell.column.isBand && pdfCell.text == 'Total') pdfCell.backgroundColor = "#ccc";
                if(gridCell.column.isBand && pdfCell.text != 'Total' && gridCell.column.visibleIndex != 0) {
                  pdfCell.textColor = "#fff";        
                  pdfCell.backgroundColor = '#00b3e7';
                }
                if(gridCell.column.isBand && gridCell.column.visibleIndex == 0) {
                  pdfCell.borderWidth = 0;
                }
              } else {
                pdfCell.textColor = "#000";
                pdfCell.font.size = 11;
                if(gridCell.data.ItemName == 'Electricity Recovery') {
                  pdfCell.backgroundColor = '#ececec';
                }
              }
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          })

          await exportDataGridToPdf({
            jsPDFDocument: pdfDoc,
            topLeft: { x: 10, y: lastPoint.y + 5 },
            component: _this.councilDataGrid.instance,
            customizeCell({ gridCell, pdfCell }) {
              if(gridCell.rowType == 'header'){
                pdfCell.textColor = "#000";
                pdfCell.horizontalAlign = 'center';
                pdfCell.font.size = 12;
                if(gridCell.column.isBand && pdfCell.text == 'Total') pdfCell.backgroundColor = "#ccc";
                if(gridCell.column.isBand && pdfCell.text != 'Total' && gridCell.column.visibleIndex != 0) {
                  pdfCell.textColor = "#fff";        
                  pdfCell.backgroundColor = '#00b3e7';
                }
                if(gridCell.column.isBand && gridCell.column.visibleIndex == 0) {
                  pdfCell.borderWidth = 0;
                }
              } else {
                pdfCell.textColor = "#000";
                pdfCell.font.size = 11;
                if(gridCell.data.ItemName == '') {
                  pdfCell.backgroundColor = '#ececec';
                  //if(event.value != 'Electricity Recovery') event.cellElement.style.textAlign = "center";
                }
              }
            },
            customDrawCell({ rect }) {
              lastPoint.y = rect.y + rect.h;
            }
          })

          pdfDoc.save('BRR Multiple Months.pdf');
        };
        img.src = URL.createObjectURL(blob);
      }
    }
    xhr.send();
  }
}
