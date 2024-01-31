import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { catchError, map, Subject, Subscription, takeUntil, tap, throwError } from 'rxjs';
import { IDemandProfileResponse, IWaterProfileResponse } from '../../../../../core/models';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { DxDataGridComponent } from 'devextreme-angular';

@Component({
  selector: 'amr-graphresult',
  templateUrl: './amr-graph-result.component.html',
  styleUrls: ['./amr-graph-result.component.scss']
})
export class AmrGraphResultComponent implements OnInit, OnDestroy {

  @ViewChild('totalDataGrid') totalDataGrid: DxDataGridComponent;
  
  //common properties
  loading = false;
  showReport = false;

  get ChartId(): number { return this.dataService.SelectedChart.Id; }

  private subRunit: Subscription;

  obsRunit$ = this.dataService.obsProfChart$
    .pipe(
      catchError(err => {
        console.log('error', err)
        this.dataService.setError(`Error Observed: ${err}`);
        return throwError(err);
      }),
      map((b) => {
        if (b) {
          this.Runit();
        } else this.showReport = false;
      })
    );

  customizePoint = (arg: any) => {
    return { color: arg.data.Color }
  };

  customizeTooltip(arg: any) {
    var ret = { text: `Selected Value<br>${arg.valueText}` };
    return ret;
  }

  pointClick(e: any) {
    const point = e.target;
    point.showTooltip();
  }

  //Demand Profile properties
  demandDataSource: IDemandProfileResponse;
  chartTitleDemand: string = 'Demand Profile';
  chartSubTitleDemand: string = '';
  chartSubSubTitleDemand: string = '';

  private subDem: Subscription;

  obsDemProfile$ = this.dataService.obsDemProfile$
    .pipe(
      tap(p => {
        //if (p) console.log(`Next value observed: ${(p.Detail.length)} long details`)
      }),
      catchError(err => {
        this.dataService.setError(`Error Observed: ${err}`);
        return throwError(err);
      }),
      map((prof: IDemandProfileResponse) => {
        if (prof) {
          if (prof.Status == 'Error') {
            this.dataService.setError(`Error getting data: ${prof.ErrorMessage}`);
          } else {
            this.setDataSourceDemand(prof);
            this.dataService.showResult(true);
          }
        } else { 
          this.setDataSourceDemand(prof);
          this.dataService.showResult(false);
        }
      })
    );

  setDataSourceDemand(ds: IDemandProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.demandDataSource = ds;
      if (ds) {
        var kVADate = pipe.transform(ds.Header.MaxDemandDate, "HH:mm dd MMM yyyy");
        this.chartTitleDemand = `Demand Profile for Meter: ${ds.Header.Description} (${ds.Header.MeterNo})`;
        this.chartSubTitleDemand = `Usages for selected period: Peak - ${ds.Header.PeakUsage.toFixed(2)}kWh, ${ds.Header.StandardUsage.toFixed(2)}kWh, Off-Peak - ${ds.Header.OffPeakUsage.toFixed(2)}kWh, Total ${ds.Header.PeriodUsage.toFixed(2)}kWh`;
        this.chartSubSubTitleDemand = `Peak Demand for period: Peak - ${ds.Header.PeakDemand.toFixed(2)} kVA, Standard - ${ds.Header.StandardDemand.toFixed(2)} kVA, Off-Peak - ${ds.Header.OffPeakDemand.toFixed(2)} kVA, Max ${(ds.Header.MaxDemand).toFixed(2)} kVA on ${kVADate}`;
      } else {
        this.chartTitleDemand = 'Demand Profile';
        this.chartSubTitleDemand = '';
      }
    }
  }

  //Water Profile Properties

  waterDataSource: IWaterProfileResponse;
  chartTitleWater: string = 'Water Profile';
  chartSubTitleWater: string = '';

  private subWater: Subscription;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  obsWaterProfile$ = this.dataService.obsWaterProfile$
    .pipe(
      tap(p => {
        //if (p) console.log(`Next value observed: ${(p.Detail.length)} long details`)
      }),
      catchError(err => {
        this.dataService.setError(`Error Observed: ${err}`);
        return throwError(err);
      }),
      map((prof: IWaterProfileResponse) => {
        if (prof) {
          if (prof.Status == 'Error') {
            this.dataService.setError(`Error getting data: ${prof.ErrorMessage}`);
          } else {
            this.setDataSourceWater(prof);
            this.dataService.showResult(true);
          }
        } else {
          this.setDataSourceWater(prof);
          this.dataService.showResult(false);
        }
      })
    );

  setDataSourceWater(ds: IWaterProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.waterDataSource = ds;
      if (ds) {
        var flowDate = pipe.transform(ds.Header.MaxFlowDate, "HH:mm dd MMM yyyy");
        this.chartTitleWater = `Water Profile for Meter: ${ds.Header.Description} (${ds.Header.MeterNo})`;
        this.chartSubTitleWater = `Usages for period: ${ds.Header.PeriodUsage.toFixed(2)}kL, Maximum flow: ${ds.Header.MaxFlow.toFixed(2)}kL at ${flowDate}`;
      } else {
        this.chartTitleWater = 'Water Profile';
        this.chartSubTitleWater = '';
      }
    }
  }

  constructor(private dataService: AmrDataService) { }

  ngOnInit(): void {
    this.subDem = this.obsDemProfile$.subscribe();
    this.subWater = this.obsWaterProfile$.subscribe();
    this.subRunit = this.obsRunit$.subscribe();

    this.dataService.download$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: boolean) => {
        if(res) {
          this.onExportExcel();
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.subDem.unsubscribe();
    this.subWater.unsubscribe();
    this.subRunit.unsubscribe();
  }

  onExportExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report', { views: [{ showGridLines: false }] });
    if( this.ChartId == 1 ) {
      worksheet.mergeCells('A1:F1');
      worksheet.mergeCells('A2:F2');
      worksheet.mergeCells('A3:F3');
      worksheet.getCell('A1').value = this.chartTitleDemand;
      worksheet.getCell('A1:F1').font = {bold: true, size: 16};
      worksheet.getCell('A1').alignment  = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('A2').value = this.chartSubTitleDemand;
      worksheet.getCell('A2:F2').font = {bold: true, size: 14};
      worksheet.getCell('A2').alignment  = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('A3').value = this.chartSubSubTitleDemand;
      worksheet.getCell('A3:F3').font = {bold: true, size: 14};
      worksheet.getCell('A3').alignment  = {vertical: 'middle', horizontal: 'center'};
    } else {
      worksheet.mergeCells('A1:C1');
      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A1').value = this.chartTitleWater;
      worksheet.getCell('A1:C1').font = {bold: true, size: 16};
      worksheet.getCell('A1').alignment  = {vertical: 'middle', horizontal: 'center'};
      worksheet.getCell('A2').value = this.chartSubTitleWater;
      worksheet.getCell('A2:C2').font = {bold: true, size: 14};
      worksheet.getCell('A2').alignment  = {vertical: 'middle', horizontal: 'center'};
    }
    
    var _this = this;
    exportDataGrid({
      component: _this.totalDataGrid.instance,
      worksheet: worksheet,
      autoFilterEnabled: true,
      topLeftCell: { row: this.ChartId == 1 ? 4 : 3, column: 1 },
      customizeCell({ gridCell, excelCell }) {
        excelCell.alignment = { horizontal: 'center'};  
      }
    }).then(() => {
      let fileName = this.ChartId == 1 ? 'Demand Data Summary Report.xlsx' : 'Water Data Summary Report.xlsx'
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
      });
    })
  }

  Runit(): void {
    this.showReport = true;
    this.loading = true;

    if (this.ChartId == 1) {
      this.dataService.getDemandProfile(this.dataService.DemChartParams.MeterId,
        this.dataService.DemChartParams.StartDate,
        this.dataService.DemChartParams.EndDate,
        this.dataService.DemChartParams.TOUId);
    }

    if (this.ChartId == 2) {
      this.dataService.getWaterProfile(this.dataService.WaterChartParams.MeterId,
        this.dataService.WaterChartParams.StartDate,
        this.dataService.WaterChartParams.EndDate,
        this.dataService.WaterChartParams.nightFlowStart,
        this.dataService.WaterChartParams.nightFlowEnd);
    }

    setTimeout(() => {
      this.loading = false;
    }, 1500);
  }

}
