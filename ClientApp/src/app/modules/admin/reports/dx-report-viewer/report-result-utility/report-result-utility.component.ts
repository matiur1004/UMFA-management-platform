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
  resultsForGrid: any[] = [];
  resultsForGraph: any[] = [];
  periodList: [] = [];
  
  public chartOptions: Partial<ChartOptions>;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private reportService: DXReportService) { 
    this.chartOptions = {
      series: [
      ],
      chart: { 
        type: 'bar',
        height: 400
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
        categories: [],
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
        if(data) {
          this.periodList = data['PeriodList'];
          this.resultsForGrid = data['GridValues'];
          this.dataSource = data['GridValues'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['ColValue'];
              else item[period] = 0;
            })
            return item;
          });
          this.resultsForGraph = data['GraphValues'];
          this.chartOptions.xaxis.categories = this.periodList;
          let seriesData = [];
          this.resultsForGraph.forEach(item => {
            let rowData = {name: item['RowHeader'], data: []};
            this.periodList.forEach(period => {
              if(period != 'Total') {
                let filteredPeriod = item['PeriodDetails'].find(obj => obj.PeriodName == period);
                if(filteredPeriod) rowData.data.push(filteredPeriod['ColValue']);
                else rowData.data.push(0);
              }
            })
            seriesData.push(rowData);
          });
          this.chartOptions.series = seriesData;
        } else {
          this.periodList = [];
          this.resultsForGrid = [];
          this.resultsForGraph = [];
        }
        
      })
  }

  onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('UtilityRecoveryExpense');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'UtilityRecoveryExpense.xlsx');
      });
    });
    e.cancel = true;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
