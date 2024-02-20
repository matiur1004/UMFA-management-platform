import { Component, OnInit, Input, OnChanges } from '@angular/core';

interface IConfiguration {
  minHeight: string;
  minWidth?: string;
  gradient?: boolean;
  showDataLabel?: boolean;
  showXAxisLabel?: boolean;
  showLegend?: boolean;
  showYAxisLabel?: boolean;
  xAxis?: boolean;
  yAxis?: boolean;
  legend?: boolean;
  barPadding?: string;
}

@Component({
  selector: 'meter-reading-chart',
  templateUrl: './meter-reading-chart.component.html',
  styleUrls: ['./meter-reading-chart.component.less']
})

export class MeterReadingChartComponent implements OnChanges {

  @Input() data: any[] = [];
  configurations: IConfiguration = {
    minHeight: '400px',
    barPadding: '10',
    gradient: false,
    legend: false,
    minWidth: "",
    showDataLabel: true,
    showXAxisLabel: false,
    showYAxisLabel: false,
    xAxis: true,
    yAxis: true
  }
  dataLabelFn = this.getDataLabel.bind(this);
  customColors = [];
  
  private readonly abbr = ['', 'K', 'M', 'B', 'T'];
  constructor() { }

  ngOnChanges(): void {
    this.customColors = this.data.map(item => {
      let colorItem = {
        name: item.name,
        value: "#007bff"
      }
      return colorItem;
    })
  }

  formatUsage(usage) {
    let n = 0;
    while (usage > 1000) {
      usage /= 1000;
      n++;
    }
    return +usage.toFixed(1) + (this.abbr[n] || '');

  }

  getDataLabel(value: number) {
    if (!value) {
      return ''
    }
    const val = value.toString().length;
    if (val >= 6) {
      return this.formatUsage(value);
    }
    return value;
  }
}
