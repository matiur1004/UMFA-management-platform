import {RegisterInfoViewModel} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {ChartModel, DEFAULT_AVERAGE_COLOR, IConfiguration, IDataChart} from './chart.model';
import {Dictionary} from '@models';
import {lightenDarkenColor} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/color.helper';

export interface SingleBarConfigurations extends IConfiguration {
  barPadding: number
}

export class BarChartModel extends ChartModel {
  registersInfo: Array<RegisterInfoViewModel> = [];
  barConfigurations: SingleBarConfigurations;

  constructor(public rInfo: Array<RegisterInfoViewModel>, public configurations: SingleBarConfigurations) {
    super();
    this.registersInfo = [...rInfo];
    this.barConfigurations = {...configurations};
  }

  public get getBarConfigurations(): SingleBarConfigurations {
    return {...super.getConfigurations(), ...this.barConfigurations};
  }

  public generateChartData(): { customColors: Dictionary<number>, currentPeriodData: Dictionary<number> } {
    const currentPeriodData = {};
    const customColors = {};

    this.registersInfo.forEach((registerInfo, index) => {
      if (!customColors[index]) {
        customColors[index] = [];
      }

      if (!currentPeriodData[index]) {
        currentPeriodData[index] = [];
      }

      registerInfo.readingsInfo.forEach((rInfo) => {
        currentPeriodData[index].push({
          name: super.getShortMonth(rInfo.currentReadingUsage.periodName),
          value: rInfo.currentReadingUsage.usage
        });

        customColors[index].push({
          key: rInfo.currentReadingUsage.readingStatus,
          name: super.getShortMonth(rInfo.currentReadingUsage.periodName),
          value: super.getColor(rInfo.currentReadingUsage.readingStatus)
        });
      });
    });

    return {currentPeriodData, customColors};
  }


  public generateYearOnYear() {
    const currentPeriodData = {};
    const customColors = {};

    this.registersInfo.forEach((registerInfo, index) => {
      if (!currentPeriodData[index]) {
        currentPeriodData[index] = [];
      }

      if (!customColors[index]) {
        customColors[index] = [];
      }

      registerInfo.readingsInfo.forEach((rInfo, prevIndex) => {
        const periodName = super.getShortMonth(rInfo.previousReadingUsage.periodName);
        const currPeriodName = super.getShortMonth(rInfo.currentReadingUsage.periodName);

        currentPeriodData[index].push(
          {
            name: 'e' + prevIndex,
            value: 0
          },
          {
            name: periodName + prevIndex,
            value: rInfo.previousReadingUsage.usage
          },
          {
            name: currPeriodName,
            value: rInfo.currentReadingUsage.usage
          }
        );

        const previousColor = super.getColor(rInfo.previousReadingUsage.readingStatus);
        const currentColor = super.getColor(rInfo.currentReadingUsage.readingStatus);
        const lightenColor = previousColor ? lightenDarkenColor(previousColor, 80) : DEFAULT_AVERAGE_COLOR;

        customColors[index].push(
          {
            key: rInfo.previousReadingUsage.readingStatus,
            name: periodName + prevIndex,
            value: lightenColor
          },
          {
            key: rInfo.currentReadingUsage.readingStatus,
            name: currPeriodName,
            value: currentColor
          }
        );
      });
    });

    return {currentPeriodData, customColors};
  }

  public generateChartDataBySingleRegister(selectedRegister: RegisterInfoViewModel)
    : { currentPeriodStatsData: Array<IDataChart>, customColors: Array<IDataChart> } {
    const currentPeriodStatsData = [];
    const customColors = [];

    selectedRegister.readingsInfo.forEach(readingInfo => {
      const periodName = super.getShortMonth(readingInfo.currentReadingUsage.periodName);

      currentPeriodStatsData.push({
        name: periodName,
        value: readingInfo.currentReadingUsage.usage
      });

      customColors.push({
        key: readingInfo.currentReadingUsage.readingStatus,
        name: periodName,
        value: super.getColor(readingInfo.currentReadingUsage.readingStatus)
      });
    });

    return {currentPeriodStatsData, customColors};
  }

  public generateYearOnYearBySingleRegister(selectedRegister: RegisterInfoViewModel)
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
          name: super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index,
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
