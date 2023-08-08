import { Component, OnInit } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartComponent } from 'ng-apexcharts';

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
  legend: ApexLegend;
};

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {

  selectedMonth;

  groupColors = {
    'C/A Diesel' : '#008E0E',
    'C/A Electricity': '#452AEB',
    'C/A Sewer': '#2FAFB7',
    'C/A Water': '#C23BC4',
    'Kwh Electricity': '#6E6E6E',
    'Sewer': '#C24F19',
    'Water': '#C8166C'
  };
  options = {
    type: 'discrete',
    palette: ['#6E6E6E', '#452AEB', '#C23BC4', '#2FAFB7', '#C8166C', '#C24F19'],
  };

  citiesPopulations: any[] = [{
    name: '',
    items: [{
      value: 14160467,
      name: 'Istanbul',
      country: 'Turkey',
    }, {
      value: 12197596,
      name: 'Moscow',
      country: 'Russia',
    }, {
      value: 8538689,
      name: 'London',
      country: 'United Kingdom',
    }, {
      value: 5191690,
      name: 'Saint Petersburg',
      country: 'Russia',
    }, {
      value: 4470800,
      name: 'Ankara',
      country: 'Turkey',
    }, {
      value: 3517424,
      name: 'Berlin',
      country: 'Germany',
    }],
  }];

  dataSource: any;

  public billingChartOptions: Partial<ChartOptions>;
  constructor() { }

  ngOnInit(): void {
    this.billingChartOptions = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
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
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    }  
  }

  customizeTooltip(arg) {
    const data = arg.node.data;
    let result = null;

    if (arg.node.isLeaf()) {
      result = `<span class='city'>${data.name}</span> (${
        data.country})<br/>Population: ${arg.valueText}`;
    }

    return {
      text: result,
    };
  }
}
