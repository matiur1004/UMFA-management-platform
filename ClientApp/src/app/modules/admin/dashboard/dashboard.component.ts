import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { EHomeTabType, IHomeTab, CHomeTabTypeText, IWaterProfileDetail } from 'app/core/models';
import { BuildingService } from 'app/shared/services/building.service';
import { catchError, EMPTY, forkJoin, map, of, Subject, takeUntil, tap } from 'rxjs';
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
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@shared/services';

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
            let graphData = s.GraphStats ?? s.Stats;
            this.chartElectricityUsage.xaxis.categories = graphData.map(graph => graph.PeriodName);
            this.chartWaterUsage.xaxis.categories = graphData.map(graph => graph.PeriodName);
            this.chartSales.xaxis.categories = graphData.map(graph => graph.PeriodName);

            let electricityUsage = {name: 'Electricity Usage', data: []};
            let waterUsage = {name: 'Water Usage', data: []};
            let sales = {name: 'Sales', data: []};

            graphData.forEach(graph => {
                electricityUsage.data.push(graph['TotalElectricityUsage']);
                waterUsage.data.push(graph['TotalWaterUsage']);
                if(this.isTenant) sales.data.push(graph['TotalBilled']);
                else sales.data.push(graph['TotalSales']);
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

    alarmTriggeredDataSource: IWaterProfileDetail[];
    alarmTrigerInfo: any;
    minutues = [];
    form: FormGroup;
    
    readonly allowedPageSizes = [10, 15, 20, 'All'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    @ViewChild("chart") chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    applyFilterTypes: any;
    currentFilter: any;

    isTenant: boolean = false;
    headerText: string = '';

    constructor(
        private _dbService: DashboardService,
        private _bldService: BuildingService,
        private _usrService: AuthService,
        private _userService: UserService,
        private _cdr: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _formBuilder: FormBuilder
    ) {
        this.isTenant = this._dbService.isTenant;
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
        this._dbService.setTitle('Main Dashboard');

        this._dbService.headerText$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if(res) {this.headerText = res;}
            });
            
        for(let i = 1; i <= 300; i++) {
            this.minutues.push({Value: i});
        }

        this.form = this._formBuilder.group({
            Duration: ['', [Validators.required]],
            Threshold: ['', [Validators.required]],
            AverageObserved: [''],
            MaximumObserved: [''],
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(({matchingAliases}) => {
            // Check if the screen is small
            this.isMobileScreen = !matchingAliases.includes('md');
        });

        this._dbService.alarmTriggerDetail$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                // Check if the screen is small
                if(data) {
                    this.setDataSource(data['AlarmData']);
                    this.alarmTrigerInfo = data['AlarmInfo'];
                    this.form.patchValue({
                        Duration: this.alarmTrigerInfo.Duration,
                        Threshold: this.alarmTrigerInfo.Threshold,
                        AverageObserved: this.alarmTrigerInfo.AverageObserved,
                        MaximumObserved: this.alarmTrigerInfo.MaximumObserved
                    });
                    this._cdr.detectChanges();
                }
            });

        if(this._dbService.alarmTriggeredId) {
            let newTab: IHomeTab = {
                id: 0,
                title: 'Alarm Trigger',
                type: 'AlarmTrigger'
            };
            this.tabsList.push(newTab);
            this.selectedTab = 1;
            setTimeout(() => {
                this._dbService.getAlarmTriggered(this._dbService.alarmTriggeredId).subscribe();
            }, 500);
        } 
        
        this._dbService.tenantSlip$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((buildingId) => {
                if(buildingId) {
                    this._dbService.getTenantSlipsCriteria(buildingId).subscribe(() => {
                        let newTab: IHomeTab = {
                            id: 0,
                            title: 'Tenant Slip',
                            type: 'TenantSlipDetail'
                        };
                        this.tabsList.push(newTab);
                        this.selectedTab = this.tabsList.length;
                        this._cdr.detectChanges();
                    })                    
                }
            });

        this._dbService.tenantSlipDetail$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {
                    let newTab: IHomeTab = {
                        id: 0,
                        title: 'Tenant Slip Dashboard',
                        type: 'TenantSlipDashboard',
                        dataSource: data
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    this._cdr.detectChanges();
                }
            });
        
        this._dbService.tenantSlipDownloads$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {
                    this._dbService.getReportsArchives(this._userService.userValue.UmfaId)
                        .subscribe(() => {
                            let newTab: IHomeTab = {
                                id: 0,
                                title: 'Downloads',
                                type: 'TenantSlipDownloads',
                                dataSource: data
                            };
                            this.tabsList.push(newTab);
                            this.selectedTab = this.tabsList.length;
                            this._cdr.detectChanges();
                        });
                    
                }
            });

        this._dbService.buildingReports$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if(res) {
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `${res.reportType} Reports`,
                        type: 'BuildingReports',
                        dataSource: res
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    this._cdr.detectChanges();
                }
            });
        
        this._dbService.shopList$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if(res) {
                    if(res) {
                        let newTab: IHomeTab = {
                            id: 0,
                            title: `Shops`,
                            type: 'ShopList',
                            dataSource: {...res, destination: 'Detail'}
                        };
                        this.tabsList.push(newTab);
                        this.selectedTab = this.tabsList.length;
                        this._cdr.detectChanges();
                    }
                }
            });

        this._dbService.tenantsList$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if(res) {
                    if(res) {
                        let newTab: IHomeTab = {
                            id: 0,
                            title: `Tenants`,
                            type: 'TenantsList',
                            dataSource: {...res, destination: 'Detail'}
                        };
                        this.tabsList.push(newTab);
                        this.selectedTab = this.tabsList.length;
                        this._cdr.detectChanges();
                    }
                }
            });

        this._dbService.shopDetailDashboard$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        // "buildingId": 2403,
                        // "partnerId": 7,
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId']
                    }
                    this._dbService.getShopDashboardDetail(res['buildingId'], res['shopId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0, 
                                    title: `${response['shopName']}`,
                                    type: 'ShopDetailDashboard',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.detectChanges();
                            }
                        });
                }
            });
        
        this._dbService.tenantDetailDashboard$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "tenantId": response['tenantId'],
                        "tenantName": response['tenantName']
                    }
                    this._dbService.getTenantDashboardDetail(res['buildingId'], res['tenantId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0, 
                                    title: `${response['tenantName']}`,
                                    type: 'TenantDetailDashboard',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.detectChanges();
                            }
                        });
                }
            });

        this._dbService.shopBilling$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId']
                    }
                    this._dbService.getShopDashboardBilling(res['buildingId'], res['shopId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0, 
                                    title: `Billing`,
                                    type: 'ShopBilling',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.markForCheck();
                            }
                        });
                }
            });

        this._dbService.tenantBilling$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "tenantId": response['tenantId']
                    }
                    this._dbService.getTenantDashboardBilling(res['buildingId'], res['tenantId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0, 
                                    title: `Tenant Billing`,
                                    type: 'TenantBilling',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.markForCheck();
                            }
                        });
                }
            });
            
        this._dbService.shopOccupation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId']
                    }
                    this._dbService.getShopDashboardOccupations(res['buildingId'], res['shopId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0,
                                    title: `Occupations`,
                                    type: 'ShopDashboardOccupations',
                                    dataSource: {}
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.detectChanges();
                            }
                        });
                }
            });

        this._dbService.tenantOccupation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "tenantId": response['tenantId']
                    }
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `Shops Occupaied`,
                        type: 'TenantDashboardOccupations',
                        dataSource: res
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    this._cdr.detectChanges();
                }
            });

        this._dbService.shopAssignedMeters$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId']
                    }
                    this._dbService.getShopDashboardAssignedMeters(res['buildingId'], res['shopId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0,
                                    title: `Assigned Meters`,
                                    type: 'ShopDashboarAssignedMeters',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.markForCheck();
                            }
                        });
                }
            });

        this._dbService.tenantAssignedMeters$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "tenantId": response['tenantId']
                    }
                    this._dbService.getTenantDashboardAssignedMeters(res['buildingId'], res['tenantId'])
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            if(result) {
                                let newTab: IHomeTab = {
                                    id: 0,
                                    title: `Tenant Assigned Meters`,
                                    type: 'TenantDashboarAssignedMeters',
                                    dataSource: res
                                };
                                this.tabsList.push(newTab);
                                this.selectedTab = this.tabsList.length;
                                this._cdr.markForCheck();
                            }
                        });
                }
            });

        this._dbService.shopReadings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId'],
                        'meterId': response['meterId']
                    }

                    this._dbService.getMetersForBuilding(res['buildingId'], res['shopId'])
                        .subscribe(result => {
                            let newTab: IHomeTab = {
                                id: 0,
                                title: `Readings`,
                                type: 'ShopDashboardReadings',
                                dataSource: res
                            };
                            this.tabsList.push(newTab);
                            this.selectedTab = this.tabsList.length;
                            this._cdr.markForCheck();
                        });
                }
            });

        this._dbService.tenantReadings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response) => {
                if(response) {
                    let res = {
                        "buildingId": response['buildingId'],
                        "shopId": response['shopId'],
                        'meterId': response['meterId']
                    }

                    this._dbService.getMetersForBuilding(res['buildingId'], res['shopId'])
                        .subscribe(result => {
                            let newTab: IHomeTab = {
                                id: 0,
                                title: `Tenant Readings`,
                                type: 'TenantDashboardReadings',
                                dataSource: res
                            };
                            this.tabsList.push(newTab);
                            this.selectedTab = this.tabsList.length;
                            this._cdr.markForCheck();
                        });
                }
            });

        this._dbService.triggeredAlarmsPage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `Triggered Alarms`,
                        type: 'DashboardTriggeredAlarms',
                        dataSource: data
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    this._cdr.markForCheck();
                }
            });

        this._dbService.buildingAlarmsPage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {
                    this._dbService.getBuildingAlarms()
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe(result => {
                            let newTab: IHomeTab = {
                                id: 0,
                                title: `Building Alarms`,
                                type: 'DashboardBuildingAlarms',
                                dataSource: null
                            };
                            this.tabsList.push(newTab);
                            this.selectedTab = this.tabsList.length;
                            this._cdr.markForCheck();
                        })
                    
                }
            });

        this._dbService.triggeredAlarmDetailPage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {                    
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `${data.MeterNo}`,
                        type: 'AlarmTrigger',
                        dataSource: data
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    setTimeout(() => {
                        this._dbService.getAlarmTriggered(data.AMRMeterTriggeredAlarmId).subscribe();
                    }, 500);
                    this._cdr.markForCheck();
                }
            });

        this._dbService.triggeredAlarmDetailPage$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {
                if(data) {                    
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `${data.MeterNo}`,
                        type: 'AlarmTrigger',
                        dataSource: data
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    this._cdr.markForCheck();
                }
            });

        this._dbService.showTenantBillingDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                if(res) {       
                    let newTab: IHomeTab = {
                        id: 0,
                        title: `Billing Summary Details`,
                        type: 'TenantBillingDetail',
                        dataSource: res
                    };
                    this.tabsList.push(newTab);
                    this.selectedTab = this.tabsList.length;
                    
                    this._cdr.markForCheck();
                }
            });
        //Wip
        let res = {
            "buildingId": 0,
        }
        let newTab: IHomeTab = {
            id: 0,
            title: `Smart Building Dashboard`,
            type: 'SmartBuildingDashboard',
            dataSource: res
        };
        this.tabsList.push(newTab);
        this.selectedTab = this.tabsList.length;
        
        this._cdr.markForCheck();
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
            } else if(type == EHomeTabType.Shops) {
                this._dbService.destroyShopList();
                let res = {
                    "buildingId": null,
                    "partnerId": null,
                    "destination": "Home"
                }
                let newTab: IHomeTab = {
                    id: 0,
                    title: `Shops`,
                    type: 'ShopList',
                    dataSource: res
                };
                this.tabsList.push(newTab);
                this.selectedTab = this.tabsList.length;
                this._cdr.markForCheck();
            } else if(type == EHomeTabType.Tenants) {
                this._dbService.destroyTenantsList();
                let res = {
                    "buildingId": null,
                    "partnerId": null,
                    "destination": "Home"
                }
                let newTab: IHomeTab = {
                    id: 0,
                    title: `Tenants`,
                    type: 'TenantsList',
                    dataSource: res
                };
                this.tabsList.push(newTab);
                this.selectedTab = this.tabsList.length;
                this._cdr.markForCheck();
            } else if(type == EHomeTabType.SmartServices) {
                this._dbService.getSmartBuildings(this._usrService.userValue.Id)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((res) => {
                        let newTab: IHomeTab = {
                            id: 0,
                            title: `Smart Buildings`,
                            type: 'SmartBuildingsList',
                            dataSource: res
                        };
                        this.tabsList.push(newTab);
                        this.selectedTab = this.tabsList.length;
                        
                        this._cdr.markForCheck();
                    })
            } else {
                this.tabsList.push({...newTab});
                this.selectedTab = this.tabsList.length;
            }
        }
        
    }

    removeTab(index: number) {
        this.selectedTab = index > 0 ? 1 : 0;
        if(this.tabsList[index]['type'] == 'BuildingDetail'){
            this._dbService.setTitle('Main Dashboard');
        }
        if(this.tabsList[index]['type'] == 'ShopDetailDashboard'){
            this._dbService.setTitle('Main Dashboard');
        }
        if(this.tabsList[index]['type'] == 'TenantDetailDashboard'){
            this._dbService.setTitle('Main Dashboard');
        }
        if( this.tabsList[index]['type'] == 'TenantSlipDashboard' || 
            this.tabsList[index]['type'] == 'TenantSlipDetail' || 
            this.tabsList[index]['type'] == 'TenantSlipDownloads' ||
            this.tabsList[index]['type'] == 'BuildingReports' ||
            this.tabsList[index]['type'] == 'ShopBilling' ||
            this.tabsList[index]['type'] == 'ShopDashboardOccupations' ||
            this.tabsList[index]['type'] == 'ShopDashboarAssignedMeters' || 
            this.tabsList[index]['type'] == 'ShopDashboardReadings' ||
            this.tabsList[index]['type'] == 'ShopDetailDashboard' ||
            this.tabsList[index]['type'] == 'AlarmTrigger' || 
            this.tabsList[index]['type'] == 'TenantDetailDashboard' ||
            this.tabsList[index]['type'] == 'TenantBillingDetail' ||
            this.tabsList[index]['type'] == 'TenantDashboarAssignedMeters' ||
            this.tabsList[index]['type'] == 'TenantBilling' ||
            this.tabsList[index]['type'] == 'TenantDashboardOccupations' ||
            this.tabsList[index]['type'] == 'TenantDashboardReadings') {
            this.selectedTab = index;    
        }
        if(this.tabsList[index]['type'] == 'ShopList') {
            this._dbService.selectedShopInfo = null;
            this._dbService.destroyShopList();
            if(this.tabsList[index]['dataSource']['destination'] == 'Home') this.selectedTab = 0;
            else this.selectedTab = index;
        }
        if(this.tabsList[index]['type'] == 'TenantsList') {
            this._dbService.selectedTenantInfo = null;
            this._dbService.destroyTenantsList();
            if(this.tabsList[index]['dataSource']['destination'] == 'Home') this.selectedTab = 0;
            else this.selectedTab = index;
        }
        if(this.tabsList[index]['type'] == 'DashboardTriggeredAlarms') {
            this._dbService.selectedTriggeredAlarmInfo = null;
            this._dbService.destroyTriggeredAlarmList();
            if(this.tabsList[index]['dataSource']['destination'] == 'Home') this.selectedTab = 0;
            else this.selectedTab = index;
        }
        if(this.tabsList[index]['type'] == 'ShopDashboarAssignedMeters') {
            this._dbService.destroyShopAssignedMeterDetails();
        }

        if(this.tabsList[index]['type'] == 'TenantDashboarAssignedMeters') {
            this._dbService.destroyTenantAssignedMeterDetails();
        }
        
        if(this.tabsList[index]['type'] == 'TenantSlipDetail') {
            this._dbService.selectedTenantSlipInfo = null;
            this._dbService.destroyTenantSlips();
        }
        if(this.tabsList[index]['type'] == 'DashboardBuildingAlarms') {
            this._dbService.destroyBuildingAlarms();
        }
        this.tabsList.splice(index, 1);
        this._cdr.markForCheck();
    }

    onRowPrepared(event) {
        if (event.rowType === "data") {
            event.rowElement.style.cursor = 'pointer';
        }
    }

    onRowClick(event) {
        if(event.data) {
            forkJoin([
                this._dbService.getTenantSlips(event.data.UmfaBuildingId),
                this._dbService.getBuildingStats(event.data.UmfaBuildingId)
            ]).subscribe(res => {
                let dataSource = res[1];
                dataSource = {...dataSource, TenantSlips: res[0]};
                let newTab: IHomeTab = {
                    id: event.data.UmfaBuildingId,
                    title: event.data.BuildingName,
                    type: 'BuildingDetail',
                    dataSource: dataSource,
                    detail: event.data
                };
                this.tabsList.push(newTab);
                this.selectedTab = this.tabsList.length;
                this._cdr.detectChanges();
            })
        }
        
    }

    setDataSource(ds: any): void {
        var pipe = new DatePipe('en_ZA');
        if (ds) {
            ds.forEach((det) => { det.ReadingDateString = pipe.transform(det.ReadingDate, "yyyy-MM-dd HH:mm") });
            this.alarmTriggeredDataSource = ds;
            if (ds) {
            }
        }
    }
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
    
    onAcknowledge() {
        this._dbService.updateAcknowledged(this._dbService.alarmTriggeredId).subscribe();
    }

    onCancelAcknoledge() {
        let index = this.tabsList.findIndex(obj => obj['type'] == 'AlarmTrigger');
        this.removeTab(index);
    }

    onDetailAlarms() {
        this._dbService.showBuildingAlarms();
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
        this._dbService.destroy();
    }
}
