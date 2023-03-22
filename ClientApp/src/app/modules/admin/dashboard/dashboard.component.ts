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
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

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
    colors: any;
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

            this.chartElectricityUsage.xaxis.categories = s.GraphStats.map(graph => graph.PeriodName);
            this.chartWaterUsage.xaxis.categories = s.GraphStats.map(graph => graph.PeriodName);
            this.chartSales.xaxis.categories = s.GraphStats.map(graph => graph.PeriodName);

            let electricityUsage = {name: 'Electricity Usage', data: []};
            let waterUsage = {name: 'Water Usage', data: []};
            let sales = {name: 'Sales', data: []};

            s.GraphStats.forEach(graph => {
                electricityUsage.data.push(graph['TotalElectricityUsage']);
                waterUsage.data.push(graph['TotalWaterUsage']);
                sales.data.push(graph['TotalSales']);
            })

            this.chartElectricityUsage.series = [electricityUsage];
            this.chartWaterUsage.series = [waterUsage];
            this.chartSales.series = [sales];
            
            this.totalElectricityUsage = electricityUsage.data.reduce((prev, cur) => prev + cur, 0);
            this.totalWaterUsage = waterUsage.data.reduce((prev, cur) => prev + cur, 0);
            this.totalSales = sales.data.reduce((prev, cur) => prev + cur, 0);

            this.varianceElectricity = electricityUsage.data[electricityUsage.data.length - 1] / ( this.totalElectricityUsage / electricityUsage.data.length ) * 100; 
            this.varianceWater = waterUsage.data[waterUsage.data.length - 1] / ( this.totalWaterUsage / waterUsage.data.length ) * 100; 
            this.varianceSales = sales.data[sales.data.length - 1] / ( this.totalSales / sales.data.length ) * 100;
            return s;
        }),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }));
    
    private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();

    data: any;
    tabsList: IHomeTab[] = [];
    tabType = EHomeTabType;
    selectedTab: number = 0;
    loading: boolean = true;
    errMessage: string;

    dataSource: any = {};
    chartElectricityUsage: Partial<ChartOptions>;
    chartWaterUsage: Partial<ChartOptions>;
    chartSales: Partial<ChartOptions>;
    
    totalElectricityUsage: number;
    totalWaterUsage: number;
    totalSales: number;
      
    varianceElectricity: number;
    varianceWater: number;
    varianceSales: number;

    isMobileScreen: boolean = false;

    readonly allowedPageSizes = [10, 15, 20, 'All'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    constructor(
        private _dbService: DashboardService,
        private _bldService: BuildingService,
        private _usrService: AuthService,
        private _cdr: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    ) {
        this.chartElectricityUsage = {
            series: [
            ],
            chart: {
              animations: {
                enabled: false
              },
              fontFamily: 'inherit',
              foreColor : 'inherit',
              height    : '100%',
              type      : 'area',
              sparkline : {
                  enabled: true
              }
            },
            stroke : {
              curve: 'smooth'
            },
            tooltip: {
                theme: 'dark'
            },
            xaxis  : {
                type      : 'category',
                categories: []
            },
            yaxis  : {
                labels: {
                    formatter: (val): string => `${val.toLocaleString()} kwh`
                }
            },
            colors : ['#DC3939'],
        };
        this.chartWaterUsage = {
          series: [
          ],
          chart: {
            animations: {
              enabled: false
            },
            fontFamily: 'inherit',
            foreColor : 'inherit',
            height    : '100%',
            type      : 'area',
            sparkline : {
                enabled: true
            }
          },
          stroke : {
            curve: 'smooth'
          },
          tooltip: {
              theme: 'dark'
          },
          xaxis  : {
              type      : 'category',
              categories: []
          },
          yaxis  : {
              labels: {
                  formatter: (val): string => `${val.toLocaleString()} kL`
              }
          },
          colors : ['#3b82f6'],
      };
      this.chartSales = {
        series: [
        ],
        chart: {
          animations: {
            enabled: false
          },
          fontFamily: 'inherit',
          foreColor : 'inherit',
          height    : '100%',
          type      : 'area',
          sparkline : {
              enabled: true
          }
        },
        stroke : {
          curve: 'smooth'
        },
        tooltip: {
            theme: 'dark'
        },
        xaxis  : {
            type      : 'category',
            categories: []
        },
        yaxis  : {
            labels: {
                formatter: (val): string => `R ${val.toLocaleString()}`
            }
        },
        colors : ['#34d399'],
        };
    }

    ngOnInit(): void {
        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({matchingAliases}) => {
            // Check if the screen is small
            this.isMobileScreen = !matchingAliases.includes('md');
        });
    }

    onDetail(type: EHomeTabType) {
        if(!this.tabsList.find(tab => tab.title == CHomeTabTypeText[type])) {
            let newTab: IHomeTab = {
                id: type,
                title: CHomeTabTypeText[type],
            };
            if(type == EHomeTabType.Buildings) {
                newTab.dataSource = [];
                this._bldService.getBuildingList(this._usrService.userValue.Id).subscribe(res => {
                    let source1 = res.filter(item => item.IsSmart == false);
                    let source2 = res.filter(item => item.IsSmart == true);

                    newTab.dataSource.push(source1);
                    newTab.dataSource.push(source2);

                    this.tabsList.push(newTab);
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
        this.selectedTab = index > 0 ? 1 : 0;
        this._cdr.markForCheck();
    }

    onRowPrepared(event) {
        if (event.rowType === "data") {
            event.rowElement.style.cursor = 'pointer';
        }
    }

    onRowClick(event) {
        this._dbService.getBuildingStats(event.data.UmfaBuildingId)
            .subscribe(res => {
                let newTab: IHomeTab = {
                    id: event.data.UmfaBuildingId,
                    title: event.data.BuildingName,
                    type: 'BuildingDetail',
                    dataSource: res,
                    detail: event.data
                };
                this.tabsList.push(newTab);
                this.selectedTab = this.tabsList.length;
                this._cdr.detectChanges();                
            })
    }

    ngAfterViewInit() {
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