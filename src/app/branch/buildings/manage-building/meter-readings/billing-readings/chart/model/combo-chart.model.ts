import {
  ChartModel,
  DEFAULT_AVERAGE_COLOR,
  IConfiguration
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/model/chart.model';
import {
  RegisterInfoViewModel,
  usagesText
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {lightenDarkenColor} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/chart/helpers/color.helper';

export interface ComboChartConfigurations extends IConfiguration {
}

export class ComboChartModel extends ChartModel {
  registersInfo: Array<RegisterInfoViewModel> = [];
  comboChartConfigurations: ComboChartConfigurations;

  constructor(public rInfo: Array<RegisterInfoViewModel>, public configurations: ComboChartConfigurations) {
    super();
    this.registersInfo = [...rInfo];
    this.comboChartConfigurations = {...configurations};
  }

  public get getComboConfigurations(): ComboChartConfigurations {
    return {...super.getConfigurations(), ...this.comboChartConfigurations};
  }

  generateComboChartData(selectedRegister: RegisterInfoViewModel, isCurrentPeriod: boolean = true) {
    const chartData = [];
    const customColors = [];
    const lineData = [];


    selectedRegister.readingsInfo.forEach((rInfo, rIndex) => {
      let nextReading = selectedRegister.readingsInfo[rIndex + 1];

      if (!nextReading) {
        nextReading = selectedRegister.readingsInfo[rIndex];
      }

      const prevPeriodName = super.getShortMonth(rInfo.previousReadingUsage.periodName);
      const currPeriodName = super.getShortMonth(rInfo.currentReadingUsage.periodName);
      const avgUsage = rInfo.currentReadingUsage.averageUsage;
      const [_, avgUsg] = usagesText;

      lineData.push({
        name: avgUsg,
        series: [
          {
            name: currPeriodName,
            value: avgUsage
          },
          {
            name: super.getShortMonth(nextReading.currentReadingUsage.periodName),
            value: nextReading.currentReadingUsage.averageUsage
          }
        ]
      });

      const previousColor = super.getColor(rInfo.previousReadingUsage.readingStatus);
      const currentColor = super.getColor(rInfo.currentReadingUsage.readingStatus);
      const lightenColor = previousColor ? lightenDarkenColor(previousColor, 80) : DEFAULT_AVERAGE_COLOR;

      if (isCurrentPeriod) {
        chartData.push(
          {
            name: currPeriodName,
            value: rInfo.currentReadingUsage.usage
          }
        );
      } else {
        chartData.push(
          {
            name: 'e' + rIndex,
            value: 0
          },
          {
            name: prevPeriodName + rIndex,
            value: rInfo.previousReadingUsage.usage
          },
          {
            name: currPeriodName,
            value: rInfo.currentReadingUsage.usage
          }
        );
      }

      customColors.push(
        {
          name: avgUsg,
          value: DEFAULT_AVERAGE_COLOR
        },
        {
          name: prevPeriodName + rIndex,
          value: lightenColor
        },
        {
          name: currPeriodName,
          value: currentColor
        }
      );
    });

    return {lineData, chartData, customColors};
  }
}
