import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DXReportService } from '@shared/services';
import { exportDataGrid, exportPivotGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { Subject, takeUntil } from 'rxjs';
import saveAs from 'file-saver';
import { DxDataGridComponent } from 'devextreme-angular';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexPlotOptions, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';

export type ChartSparklineOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
  labels: string[] | number[];
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'report-result-shop-cost',
  templateUrl: './report-result-shop-cost.component.html',
  styleUrls: ['./report-result-shop-cost.component.scss']
})
export class ReportResultShopCostComponent implements OnInit {

  @ViewChild('dataGrid') dataGrid: DxDataGridComponent;
  @ViewChild('totalDataGrid') totalDataGrid: DxDataGridComponent;
  
  dataSource: any;
  totalDataSource: any;
  periodList = [];
  applyFilterTypes: any;
  currentFilter: any;
  public commonLineSparklineOptions: Partial<ChartSparklineOptions> = {
    chart: {
      type: "line",
      width: 140,
      height: 30,
      sparkline: {
        enabled: true
      }
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function(seriesName) {
            return "";
          }
        }
      },
      marker: {
        show: false
      }
    },
    markers: {size: 4},
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 3,
      dashArray: 0,       
    }
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  
  constructor(private reportService: DXReportService, private _cdr: ChangeDetectorRef) {
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
    this.reportService.shopCostVariance$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any[]) => {
        if(data) {
          this.periodList = data['PeriodList'];
          this.dataSource = data['TenantShopInvoiceGroupings'].filter(item => item['Average'] && item['Variance']).map(item => {
            let graphData = [];
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodCostDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Cost'];
              else item[period] = 0;
              graphData.push(item[period]);
            })
            return {...item, Recoverable: item['Recoverable'] ? 'Recoverable' : 'Unrecoverable', 'PeriodGraph': [{data: graphData}]};
          })
          this.totalDataSource = data['Totals'].map(item => {
            this.periodList.forEach((period, idx) => {
              let filteredPeriod = item['PeriodCostDetails'].find(obj => period == obj.PeriodName);
              if(filteredPeriod) item[period] = filteredPeriod['Cost'];
              else item[period] = 0;
            })
            item['Group'] = item['GroupName'];
            return item;
          })
          this._cdr.detectChanges();
        } else {this.dataSource = null;}
      })
  }

  onExporting(e) {
    e.component.beginUpdate();
    e.component.columnOption('Note', 'visible', true);
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
    }).then(function() {
      e.component.columnOption('Note', 'visible', false);
      e.component.endUpdate();
    });
    e.cancel = true;
  }

  onExport() {
    this.dataGrid.instance.beginUpdate();
    this.dataGrid.instance.columnOption('Note', 'visible', true);
    this.dataGrid.instance.columnOption('PeriodGraph', 'visible', false);
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('ShopUsageVariance');
    worksheet.getColumn(2).hidden = true;
    let _this = this;
    exportDataGrid({
      component: _this.dataGrid.instance,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      const totalWorksheet = workbook.addWorksheet('Summary', {views: [{showGridLines: false}]});
      exportDataGrid({
        component: _this.totalDataGrid.instance,
        worksheet: totalWorksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ShopCostVariance.xlsx');
        });
      }).then(function() {
        _this.dataGrid.instance.columnOption('Note', 'visible', false);
        this.dataGrid.instance.columnOption('PeriodGraph', 'visible', true);
        _this.dataGrid.instance.endUpdate();
      });
      
    });
  }

  onCellPrepared(event) {
    if (event.rowType === "data") {
      let columLen = event.values.length - 1;
      if(event.columnIndex == columLen - 1 || event.columnIndex == columLen) event.cellElement.style.backgroundColor = '#E8F0FE';
      if(event.columnIndex == columLen - 2) {
        if(this.periodList[this.periodList.length - 1].indexOf('Open') > -1) {
          event.cellElement.style.backgroundColor = '#E8F0FE';
        }
      }
      
    } else if(event.rowType == 'header' || event.rowType == 'filter'){
      if(event.columnIndex == this.periodList.length + 5 || event.columnIndex == this.periodList.length + 6) event.cellElement.style.backgroundColor = '#E8F0FE';
      if(event.columnIndex == this.periodList.length + 4) {
        if(this.periodList[this.periodList.length - 1].indexOf('Open') > -1) {
          event.cellElement.style.backgroundColor = '#E8F0FE';
        }
      }
    }
  }
  
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
