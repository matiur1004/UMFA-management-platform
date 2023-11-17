import { Component, Input, OnInit } from '@angular/core';
import { IHomePageStats } from '@core/models';

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
import { DashboardService } from '../dasboard.service';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';
import { Router } from '@angular/router';

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
  selector: 'app-building-detail',
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.scss']
})
export class BuildingDetailComponent implements OnInit {

  @Input() stats: IHomePageStats;
  @Input() title: string;
  @Input() isSmart: boolean;
  @Input() buildingId: number;
  @Input() partnerId: number;

  chartElectricityUsage: Partial<ChartOptions>;
  chartWaterUsage: Partial<ChartOptions>;
  chartSales: Partial<ChartOptions>;
  
  totalElectricityUsage: number;
  totalWaterUsage: number;
  totalSales: number;
    
  varianceElectricity: number;
  varianceWater: number;
  varianceSales: number;
  constructor(
    private _dbService: DashboardService,
    private _alarmConfigurationService: AlarmConfigurationService,
    private _router: Router
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
    this._dbService.setTitle('Building Dashboard');

    if(this.stats.GraphStats) {
      this.chartElectricityUsage.xaxis.categories = this.stats.GraphStats.map(graph => graph.PeriodName);
      this.chartWaterUsage.xaxis.categories = this.stats.GraphStats.map(graph => graph.PeriodName);
      this.chartSales.xaxis.categories = this.stats.GraphStats.map(graph => graph.PeriodName);

      let electricityUsage = {name: 'Electricity Usage', data: []};
      let waterUsage = {name: 'Water Usage', data: []};
      let sales = {name: 'Sales', data: []};

      this.stats.GraphStats.forEach(graph => {
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
    }
    
  }

  onTenantSlip() {
    this._dbService.showTenantSlip(this.buildingId);
  }

  onDownloads() {
    this._dbService.showDownloads();
  }

  onReports(reportType: string) {
    this._dbService.showReports({buildingId: this.buildingId, reportType, partnerId: this.partnerId});
  }

  onDetail(type) {
    if(type == "Shop") {
      this._dbService.showShopList({buildingId: this.buildingId, partnerId: this.partnerId});
    } else if(type == 'Tenants') {
      this._dbService.showTenantList({buildingId: this.buildingId, partnerId: this.partnerId});
    }
  }

  goAlarmConfiguration() {
    this._alarmConfigurationService.selectedBuilding = this.buildingId;
    this._alarmConfigurationService.selectedPartner = this.partnerId;
    this._dbService.showTriggeredAlarms({buildingId: this.buildingId, partnerId: this.partnerId});
  }

  goToAdminAlarmConfiguration(type) {
    this._alarmConfigurationService.selectedBuilding = this.buildingId;
    this._alarmConfigurationService.selectedPartner = this.partnerId;
    this._alarmConfigurationService.selectedSupplyType = type;
    this._router.navigateByUrl('/admin/alarm-configuration');
  }
}
