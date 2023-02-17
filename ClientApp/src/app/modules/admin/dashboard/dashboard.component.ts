import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { EHomeTabType, IHomeTab, CHomeTabTypeText } from 'app/core/models';
import { BuildingService } from 'app/shared/services/building.service';
import { ApexOptions } from 'ng-apexcharts';
import { catchError, EMPTY, map, of, Subject, takeUntil, tap } from 'rxjs';
import { DashboardService } from './dasboard.service';

import {
    ApexAxisChartSeries,
    ApexChart,
    ChartComponent,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip
  } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
};

@Component({
    selector       : 'dashboard',
    templateUrl    : './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy
{
    stats$ = this._dbService.stats$.pipe(
        tap(() => {
        //  this.loadingTimer.subscribe();
        //  this.subTimer = this.incrementTimer.subscribe();
        }),
        map(s => {
            this.chartOptions.xaxis.categories = s.GraphStats.map(graph => graph.PeriodName);
            let electricityUsage = {name: 'Electricity Usage', data: []};
            let waterUsage = {name: 'Water Usage', data: []};
            let sales = {name: 'Sales', data: []};
            s.GraphStats.forEach(graph => {
                electricityUsage.data.push(graph['TotalElectricityUsage']);
                waterUsage.data.push(graph['TotalWaterUsage']);
                sales.data.push(graph['TotalSales']);
            })

            this.chartOptions.series.push(electricityUsage);
            this.chartOptions.series.push(waterUsage);
            this.chartOptions.series.push(sales);
            
          console.log("stats: " + JSON.stringify(s))
          return s;
        }),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }));
    
    private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();

    chartVisitors: ApexOptions;
    data: any;
    tabsList: IHomeTab[] = [];
    tabType = EHomeTabType;
    selectedTab: number = 0;
    loading: boolean = true;
    errMessage: string;

    dataSource: any = {};
    readonly allowedPageSizes = [10, 15, 20, 'All'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor(
        private _dbService: DashboardService,
        private _bldService: BuildingService,
        private _usrService: AuthService,
        private _cdr: ChangeDetectorRef
    ) {
        this.chartOptions = {
            series: [
            ],
            chart: {
              type: "bar",
              height: 350
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: "55%",
                //endingShape: "rounded"
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ["transparent"]
            },
            xaxis: {
              categories: [
              ]
            },
            yaxis: {
              title: {
                text: ""
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function(val) {
                  return "" + val;
                }
              }
            }
          };
    }

    ngOnInit(): void {
    }

    onDetail(type: EHomeTabType) {
        if(!this.tabsList.find(tab => tab.title == CHomeTabTypeText[type])) {
            let newTab: IHomeTab = {
                id: type,
                title: CHomeTabTypeText[type],
            };
            if(type == EHomeTabType.Buildings) {
                this._bldService.getBuildingsForUser(this._usrService.userValue.Id).subscribe(res => {
                    console.log('rererere', res);
                    newTab.dataSource = [...res];
                    this.tabsList.push({...newTab});
                    this.selectedTab = this.tabsList.length;
                    this._cdr.markForCheck();
                });
            } else {
                this.tabsList.push({...newTab});
                this.selectedTab = this.tabsList.length;
            }
        }
        
    }

    removeTab(index: number) {
        this.tabsList.splice(index, 1);
        this.selectedTab = 0;
    }

    ngAfterViewInit() {
        //if (!this._dbService.StatsValue) this._dbService.getStats();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
