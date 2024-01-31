import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AmrDataService } from 'app/shared/services/amr.data.service';
import { catchError, map, Subscription, tap, throwError } from 'rxjs';
import { IDemandProfileResponse, IWaterProfileResponse } from '../../../../../core/models';

@Component({
  selector: 'amr-graphresult',
  templateUrl: './amr-graph-result.component.html',
  styleUrls: ['./amr-graph-result.component.scss']
})
export class AmrGraphResultComponent implements OnInit, OnDestroy {

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
            this.dataService.sendDemandDataSource(prof);
            this.setDataSourceDemand(prof);
          }
        } else { 
          this.dataService.sendDemandDataSource(prof);
          this.setDataSourceDemand(prof);
        }
      })
    );

  setDataSourceDemand(ds: IDemandProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.demandDataSource = ds;
      if (ds) {
        var kVADate = pipe.transform(ds.Header.MaxDemandDate, "HH:mm on dd MMM yyyy");
        this.chartTitleDemand = `Demand Profile for Meter: ${ds.Header.Description} (${ds.Header.MeterNo})`;
        this.chartSubTitleDemand = `Usages for period: ${ds.Header.PeriodUsage.toFixed(2)}kWh, ${ds.Header.MaxDemand.toFixed(2)}kVA at ${kVADate}`;
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
            this.dataService.sendWaterDataSource(prof);
            this.setDataSourceWater(prof);
          }
        } else {
          this.dataService.sendWaterDataSource(prof);
          this.setDataSourceWater(prof);
        }
      })
    );

  setDataSourceWater(ds: IWaterProfileResponse): void {
    var pipe = new DatePipe('en_ZA');
    if (ds) {
      ds.Detail.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
      this.waterDataSource = ds;
      if (ds) {
        var flowDate = pipe.transform(ds.Header.MaxFlowDate, "HH:mm on dd MMM yyyy");
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
  }

  ngOnDestroy(): void {
    this.subDem.unsubscribe();
    this.subWater.unsubscribe();
    this.subRunit.unsubscribe();
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
