import {
  ChartModel,
  DEFAULT_AVERAGE_COLOR,
  IDataChart
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {RegisterInfoViewModel} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {SingleBarConfigurations} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/bar-chart.model';
import {lightenDarkenColor} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/color.helper';

export class ApplyEstimatedModel extends ChartModel {
  barConfigurations: SingleBarConfigurations;

  constructor(public configurations: SingleBarConfigurations) {
    super();
    this.barConfigurations = {...configurations};
  }

  public get getBarConfigurations(): SingleBarConfigurations {
    return {...super.getConfigurations(), ...this.barConfigurations};
  }

  generateApplyEstimatedChartData(selectedRegister: RegisterInfoViewModel)
    : { currentPeriodStatsData: Array<IDataChart>, customColors: Array<IDataChart> } {
    const currentPeriodStatsData = [];
    const customColors = [];

    selectedRegister.readingsInfo.forEach((readingInfo, index) => {
      const previousPeriodName = super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index;
      const periodName = super.getShortMonth(readingInfo.currentReadingUsage.periodName);
      const previousColor = super.getColor(readingInfo.previousReadingUsage.readingStatus);
      const currentColor = super.getColor(readingInfo.currentReadingUsage.readingStatus);
      const lightenColor = previousColor ? lightenDarkenColor(previousColor, 80) : DEFAULT_AVERAGE_COLOR;

      currentPeriodStatsData.push(
        {
          name: 'e' + index,
          value: 0
        },
        {
          name: previousPeriodName,
          value: readingInfo.previousReadingUsage.usage
        },
        {
          name: periodName,
          value: readingInfo.currentReadingUsage.usage
        }
      );

      customColors.push(
        {
          key: readingInfo.previousReadingUsage.readingStatus,
          name: previousPeriodName,
          value: lightenColor
        },
        {
          key: readingInfo.currentReadingUsage.readingStatus,
          name: periodName,
          value: currentColor
        }
      );
    });

    return {currentPeriodStatsData, customColors};
  }
}
