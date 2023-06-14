import { Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexPlotOptions, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: any;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'report-result-utility',
  templateUrl: './report-result-utility.component.html',
  styleUrls: ['./report-result-utility.component.scss']
})
export class ReportResultUtilityComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  dataSource: any;
  results;
  periodList: [] = [];
  
  public chartOptions: Partial<ChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private reportService: DXReportService) { 
    this.chartOptions = {
      series: [
        {
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
          name: 'Free Cash Flow',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: { 
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
    }  
  }

  ngOnInit(): void {
    this.reportService.utilityRecoveryExpense$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        console.log('data', data);
        if(data) {
          this.results = data['GridValues'];
        }
        
      })
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('ShopCostVariance');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ShopCostVariance.xlsx');
      });
    });
    e.cancel = true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
