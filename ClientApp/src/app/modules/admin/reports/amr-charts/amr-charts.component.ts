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

  supError: Subscription;
  totalGridDataSource: any;

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
      console.log(demandDataSource);
    })
    this.amrService.getWaterDataSource().subscribe((waterDataSource) => {
      this.totalGridDataSource = waterDataSource?.Detail;
      console.log(waterDataSource);
    })
  }

  ngOnDestroy(): void {
    this.supError.unsubscribe();
    this.amrService.destroyAll();
  }

  showChart(e: any) {
    console.log('showChart');
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
    var _this = this;
    exportDataGrid({
      component: _this.totalDataGrid.instance,
      worksheet: worksheet,
      autoFilterEnabled: true,
      customizeCell({ gridCell, excelCell }) {
        excelCell.width = 200; // Set the desired column width
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Demand Data Summary Report.xlsx');
      });
    })
  }
}
