import {Component, Input} from '@angular/core';
import {RegisterInfoViewModel} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {LineType} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';

@Component({
  selector: 'combo-chart-container',
  templateUrl: './combo-chart-container.component.html',
  styleUrls: ['./combo-chart-container.component.less']
})
export class ComboChartContainerComponent {
  @Input() allComboData: Array<{ name: string; value: number }>;
  @Input() comboChartData: Array<{ name: string; value: number }>;
  @Input() selectedRegister: RegisterInfoViewModel;
  @Input() lineType: LineType;
  @Input() customColors: Array<{ name: string, value: string }>;
  @Input() lineChartData: Array<{ name: string; value: number }>;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  legendPosition = 'right';
  showXAxisLabel = false;
  xAxisLabel = 'Country';
  showYAxisLabel = false;
  showGridLines = true;
  innerPadding = '10%';
  yAxisLabel = '';
  animations: boolean = true;
  lineChartScheme = {
    name: 'coolthree',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b', '#7aa3e5', '#a8385d', '#00bfa5']
  };

  comboBarScheme = {
    name: 'singleLightBlue',
    selectable: true,
    group: 'Ordinal',
    domain: ['#01579b']
  };

  showRightYAxisLabel: boolean = false;

  constructor() {
  }

}
