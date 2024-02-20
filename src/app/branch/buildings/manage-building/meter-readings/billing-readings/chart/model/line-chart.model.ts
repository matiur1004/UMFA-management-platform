import {
  ReadingInfoViewModel,
  RegisterInfoViewModel,
  usagesText
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {ChartModel, DEFAULT_AVERAGE_COLOR, IConfiguration, LineType} from './chart.model';
import {lightenDarkenColor} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/color.helper';

export interface SingleLineChartConfiguration extends IConfiguration {
}

export class LineChartModel extends ChartModel {
  registersInfo: Array<RegisterInfoViewModel> = [];
  lineConfigurations: SingleLineChartConfiguration;
  currentPeriodData = {};

  constructor(public rInfo: Array<RegisterInfoViewModel>, public configurations: SingleLineChartConfiguration) {
    super();
    this.registersInfo = [...rInfo];
    this.lineConfigurations = {...configurations};
  }

  public get getLineConfigurations(): SingleLineChartConfiguration {
    return {...super.getConfigurations(), ...this.lineConfigurations};
  }

  generateLineChart(selectedRegister: RegisterInfoViewModel, lineType: LineType) {

    const chartData = [];
    const customColors = [];

    selectedRegister && selectedRegister.readingsInfo.forEach((readingInfo, index) => {
      let nextReading = selectedRegister.readingsInfo[index + 1];

      if (!nextReading) {
        nextReading = selectedRegister.readingsInfo[index];
      }

      chartData.push(...this.mapChartLineData(readingInfo, nextReading, lineType, index).chartData);
      customColors.push(...this.mapChartLineData(readingInfo, nextReading, lineType, index).customColors);
    });

    return {chartData, customColors};
  }

  private mapChartLineData(readingInfo: ReadingInfoViewModel, nextReading: ReadingInfoViewModel, lineType: LineType, index: number): { chartData, customColors } {
    let prevChartData, currentChartData, nextChartData, previousColor, currentColor, nextColor = null;
    let chartData, customColors = null;
    const [_, avgUsg] = usagesText;

    switch (lineType) {
      case LineType.Single:
        prevChartData = {
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.usage
            }
          ]
        };
        previousColor = {
          key: readingInfo.currentReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          value: super.getColor(readingInfo.currentReadingUsage.readingStatus)
        };

        chartData = [prevChartData];
        customColors = [previousColor];

        return {chartData, customColors};

      case LineType.Average:
        prevChartData = {
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.usage
            }
          ]
        };
        currentChartData = {
          name: avgUsg,
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.averageUsage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.averageUsage
            }
          ]
        };
        previousColor = {
          key: readingInfo.currentReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          value: super.getColor(readingInfo.currentReadingUsage.readingStatus)
        };
        currentColor = {
          key: avgUsg,
          name: avgUsg,
          value: DEFAULT_AVERAGE_COLOR
        };

        chartData = [prevChartData, currentChartData];
        customColors = [previousColor, currentColor];

        return {chartData, customColors};

      case LineType.Multiple:
        prevChartData = {
          name: super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index,
          series: [
            {
              name: super.getShortMonth(readingInfo.previousReadingUsage.periodName),
              value: readingInfo.previousReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.previousReadingUsage.periodName),
              value: nextReading.previousReadingUsage.usage
            }
          ]
        };
        currentChartData = {
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.usage
            }
          ]
        };
        const tempPrevColor = super.getColor(readingInfo.previousReadingUsage.readingStatus);
        currentColor = super.getColor(readingInfo.currentReadingUsage.readingStatus);
        const lightenColor = tempPrevColor ? lightenDarkenColor(tempPrevColor, 80) : DEFAULT_AVERAGE_COLOR;

        previousColor = {
          key: readingInfo.previousReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index,
          value: lightenColor
        };
        currentColor = {
          key: readingInfo.currentReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          value: currentColor
        };
        chartData = [prevChartData, currentChartData];
        customColors = [previousColor, currentColor];

        return {chartData, customColors};

      case LineType.Multiple_Average:
        prevChartData = {
          name: super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index,
          series: [
            {
              name: super.getShortMonth(readingInfo.previousReadingUsage.periodName),
              value: readingInfo.previousReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.previousReadingUsage.periodName),
              value: nextReading.previousReadingUsage.usage
            }
          ]
        };
        currentChartData = {
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.usage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.usage
            }
          ]
        };
        nextChartData = {
          name: avgUsg,
          series: [
            {
              name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
              value: readingInfo.currentReadingUsage.averageUsage
            },
            {
              name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
              value: nextReading.currentReadingUsage.averageUsage
            }
          ]
        };
        const prevColor = super.getColor(readingInfo.previousReadingUsage.readingStatus);
        currentColor = super.getColor(readingInfo.currentReadingUsage.readingStatus);
        const newColor = prevColor ? lightenDarkenColor(prevColor, 80) : DEFAULT_AVERAGE_COLOR;

        previousColor = {
          key: readingInfo.previousReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.previousReadingUsage.periodName) + index,
          value: newColor
        };
        currentColor = {
          key: readingInfo.currentReadingUsage.readingStatus,
          name: super.getShortMonth(readingInfo.currentReadingUsage.periodName),
          value: currentColor
        };
        nextColor = {
          key: avgUsg,
          name: avgUsg,
          value: DEFAULT_AVERAGE_COLOR
        };
        chartData = [prevChartData, currentChartData, nextChartData];
        customColors = [previousColor, currentColor, nextColor];

        return {customColors, chartData};
    }
  }

}
