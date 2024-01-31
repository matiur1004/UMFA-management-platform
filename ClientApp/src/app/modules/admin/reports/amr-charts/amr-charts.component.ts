import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { IAmrChartDemProfParams } from 'app/core/models';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { Subject, Subscription } from 'rxjs';
import saveAs from 'file-saver';
import moment from 'moment';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { jsPDF } from 'jspdf';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'app-amr-charts',
  templateUrl: './amr-charts.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './amr-charts.component.scss',
    "../../../../../../node_modules/devextreme/dist/css/dx.light.css"
  ]
})
export class AmrChartsComponent implements OnInit, OnDestroy {

  @ViewChild('totalDataGrid') totalDataGrid: DxDataGridComponent;
  private errorMessageSubject = new Subject<string>();
  localErrMsg$ = this.errorMessageSubject.asObservable();

  headerInfo: any;
  dataType: string;

  supError: Subscription;
  totalGridDataSource = [];

  get frmsValid(): boolean {
    return this.amrService.IsFrmsValid();
  }

  get selectedId(): number {
    if (this.amrService != null && this.amrService != undefined && this.amrService.SelectedChart != null) {
      return this.amrService.SelectedChart.Id ?? 0;
    }
    else
      return 0;
  }

  get params(): IAmrChartDemProfParams {
    return this.amrService.DemChartParams;
  }

  constructor(private amrService: AmrDataService) { }
  ngOnInit(): void {
    this.supError = this.amrService.obsFrmError$.subscribe(
      (e) => this.errorMessageSubject.next(e)
    );
    this.amrService.getDemandDataSource().subscribe((demandDataSource) => {
      this.totalGridDataSource = demandDataSource?.Detail;
      if( this.totalGridDataSource && this.totalGridDataSource.length > 0 ) {
        this.dataType = "Demand"
      }
    })
    this.amrService.getWaterDataSource().subscribe((waterDataSource) => {
      this.totalGridDataSource = waterDataSource?.Detail;
      if( this.totalGridDataSource && this.totalGridDataSource.length > 0 ) {
        this.dataType = "Water"
      }
    })
  }

  ngOnDestroy(): void {
    this.supError.unsubscribe();
    this.amrService.destroyAll();
  }

  showChart(e: any) {
    this.amrService.displayChart(true);
  }

  onRowPrepared(event) {
    // if (event.rowType === "data") {
    //   if(event.data.name == 'Report Totals' || event.data.name.indexOf('Vat on individual') > -1 || event.data.name.indexOf('Invoice Totals') > -1){
    //     event.rowElement.style.fontWeight = 'bold';
    //     event.rowElement.style.background = '#e5e5e5';
    //   }
    // }
  }

  onCellPrepared(event) {
    // if (event.rowType === "data") {
    //   if(event.columnIndex == 0) event.cellElement.style.fontWeight = 'bold';
    // }
  }

  onExport() {
    this.onExportExcel();
  }

  onExportExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report', { views: [{ showGridLines: false }] });
    if( this.dataType === 'Demand' ) {
      worksheet.mergeCells('A1:F1');
      worksheet.mergeCells('A2:F2');
      worksheet.getCell('A1').value = "Peak - 1000 kWh, Standard - 1000 kWh, Off-Peak - 1000 kWh, Total 100000 kWh";
      worksheet.getCell('A1:F1').font = {bold: true, size: 16};
      worksheet.getCell('A1').alignment  = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('A2').value = "Peak - 1000 kVA, Standard - 1000 kVA, Off-Peak - 1000 kVA, Max 100000 kVA on 1/31/2024 07:00";
      worksheet.getCell('A2:F2').font = {bold: true, size: 16};
      worksheet.getCell('A2').alignment  = {vertical: 'middle', horizontal: 'center'};
    } else {
      worksheet.mergeCells('A1:C1');
      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A1').value = "Peak - 1000 kWh, Standard - 1000 kWh, Off-Peak - 1000 kWh, Total 100000 kWh";
      worksheet.getCell('A1:C1').font = {bold: true, size: 16};
      worksheet.getCell('A1').alignment  = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('A2').value = "Peak - 1000 kVA, Standard - 1000 kVA, Off-Peak - 1000 kVA, Max 100000 kVA on 1/31/2024 07:00";
      worksheet.getCell('A2:C2').font = {bold: true, size: 16};
      worksheet.getCell('A2').alignment  = {vertical: 'middle', horizontal: 'center'};
    }
    
    var _this = this;
    exportDataGrid({
      component: _this.totalDataGrid.instance,
      worksheet: worksheet,
      autoFilterEnabled: true,
      topLeftCell: { row: 3, column: 1 },
      customizeCell({ gridCell, excelCell }) {
        excelCell.alignment = { horizontal: 'center'};  
      }
    }).then(() => {
      let fileName = this.dataType === "Demand" ? 'Demand Data Summary Report.xlsx' : 'Water Data Summary Report.xlsx'
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
      });
    })
  }
}
