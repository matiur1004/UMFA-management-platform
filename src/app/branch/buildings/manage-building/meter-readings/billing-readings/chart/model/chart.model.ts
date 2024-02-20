import {
  ColorsStatus,
  ReadingStatus
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {Dictionary} from '@models';
import {periodName} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/reading.calulcation.helper';

export interface IDataChart {
  name: string;
  value: string;
  key?: ReadingStatus
}

export enum LineType {
  Single,
  Average,
  Multiple,
  Multiple_Average,
  Combo_Chart
}

export const DEFAULT_AVERAGE_COLOR = '#566787';

export const DEFAULT_GROUP_CONFIG = {
  groupPadding: 20,
  barPadding: 5,
  minHeight: '450px'
};

export interface IConfiguration {
  minHeight: string;
  minWidth?: string;
  gradient?: boolean;
  showDataLabel?: boolean;
  customColors?: Dictionary<number>;
  showXAxisLabel?: boolean;
  showLegend?: boolean;
  showYAxisLabel?: boolean;
  xAxis?: boolean;
  yAxis?: boolean;
  legend?: boolean;
}

export class ChartModel {
  public _configurations: IConfiguration = {
    gradient: false,
    legend: false,
    customColors: null,
    minHeight: '150px',
    minWidth: '',
    showDataLabel: true,
    showXAxisLabel: false,
    showYAxisLabel: false,
    xAxis: true,
    yAxis: false
  };

  constructor() {
  }

  getColor(readingStatus: ReadingStatus) {
    return ColorsStatus[readingStatus];
  }

  getConfigurations(): IConfiguration {
    return this._configurations;
  }

  getShortMonth(period: string): string {
    return periodName(period);
  }


}
