import {ChargingMethod, ChargingType, RecommendedPriceViewModel, SupplierPriceViewModel} from '@models';
import {InputEx} from '@shared-helpers';

export class PackagesEx {

  public static resetPrices(form) {

    if (form.hasElectricitySupplier) {

      if (!form.electricitySupplierPrice.fixedPriceChanged) {
        form.electricitySupplierPrice.fixedPrice = 0;
      }

      if (!form.electricitySupplierPrice.perTenantChanged) {
        form.electricitySupplierPrice.perTenant = 0;
      }

      if (!form.electricitySupplierPrice.perShopChanged) {
        form.electricitySupplierPrice.perShop = 0;
      }

      if (!form.electricitySupplierPrice.perMeterChanged) {
        form.electricitySupplierPrice.perMeter = 0;
      }

      if (!form.electricitySupplierPrice.perSquareMeterChanged) {
        form.electricitySupplierPrice.perSquareMeter = 0;
      }

      if (!form.electricitySupplierPrice.perBuildingChanged) {
        form.electricitySupplierPrice.perBuilding = 0;
      }

      if (!form.electricitySupplierPrice.perCouncilAccountChanged) {
        form.electricitySupplierPrice.perCouncilAccount = 0;
      }

      if (!form.electricitySupplierPrice.perHourChanged) {
        form.electricitySupplierPrice.perHour = 0;
      }
    }

    if (form.hasWaterSupplier) {

      if (!form.waterSupplierPrice.fixedPriceChanged) {
        form.waterSupplierPrice.fixedPrice = 0;
      }

      if (!form.waterSupplierPrice.perTenantChanged) {
        form.waterSupplierPrice.perTenant = 0;
      }

      if (!form.waterSupplierPrice.perShopChanged) {
        form.waterSupplierPrice.perShop = 0;
      }

      if (!form.waterSupplierPrice.perMeterChanged) {
        form.waterSupplierPrice.perMeter = 0;
      }

      if (!form.waterSupplierPrice.perSquareMeterChanged) {
        form.waterSupplierPrice.perSquareMeter = 0;
      }

      if (!form.waterSupplierPrice.perBuildingChanged) {
        form.waterSupplierPrice.perBuilding = 0;
      }

      if (!form.waterSupplierPrice.perCouncilAccountChanged) {
        form.waterSupplierPrice.perCouncilAccount = 0;
      }

      if (!form.waterSupplierPrice.perHourChanged) {
        form.waterSupplierPrice.perHour = 0;
      }
    }

    if (form.hasSewerageSupplier) {

      if (!form.sewerageSupplierPrice.fixedPriceChanged) {
        form.sewerageSupplierPrice.fixedPrice = 0;
      }

      if (!form.sewerageSupplierPrice.perTenantChanged) {
        form.sewerageSupplierPrice.perTenant = 0;
      }

      if (!form.sewerageSupplierPrice.perShopChanged) {
        form.sewerageSupplierPrice.perShop = 0;
      }

      if (!form.sewerageSupplierPrice.perMeterChanged) {
        form.sewerageSupplierPrice.perMeter = 0;
      }

      if (!form.sewerageSupplierPrice.perSquareMeterChanged) {
        form.sewerageSupplierPrice.perSquareMeter = 0;
      }

      if (!form.sewerageSupplierPrice.perBuildingChanged) {
        form.sewerageSupplierPrice.perBuilding = 0;
      }

      if (!form.sewerageSupplierPrice.perCouncilAccountChanged) {
        form.sewerageSupplierPrice.perCouncilAccount = 0;
      }

      if (!form.sewerageSupplierPrice.perHourChanged) {
        form.sewerageSupplierPrice.perHour = 0;
      }
    }

    if (form.hasGasSupplier) {

      if (!form.gasSupplierPrice.fixedPriceChanged) {
        form.gasSupplierPrice.fixedPrice = 0;
      }

      if (!form.gasSupplierPrice.perTenantChanged) {
        form.gasSupplierPrice.perTenant = 0;
      }

      if (!form.gasSupplierPrice.perShopChanged) {
        form.gasSupplierPrice.perShop = 0;
      }

      if (!form.gasSupplierPrice.perMeterChanged) {
        form.gasSupplierPrice.perMeter = 0;
      }

      if (!form.gasSupplierPrice.perSquareMeterChanged) {
        form.gasSupplierPrice.perSquareMeter = 0;
      }

      if (!form.gasSupplierPrice.perBuildingChanged) {
        form.gasSupplierPrice.perBuilding = 0;
      }

      if (!form.gasSupplierPrice.perCouncilAccountChanged) {
        form.gasSupplierPrice.perCouncilAccount = 0;
      }

      if (!form.gasSupplierPrice.perHourChanged) {
        form.gasSupplierPrice.perHour = 0;
      }
    }

    if (form.hasAdHocSupplier) {

      if (!form.adHocSupplierPrice.fixedPriceChanged) {
        form.adHocSupplierPrice.fixedPrice = 0;
      }

      if (!form.adHocSupplierPrice.perTenantChanged) {
        form.adHocSupplierPrice.perTenant = 0;
      }

      if (!form.adHocSupplierPrice.perShopChanged) {
        form.adHocSupplierPrice.perShop = 0;
      }

      if (!form.adHocSupplierPrice.perMeterChanged) {
        form.adHocSupplierPrice.perMeter = 0;
      }

      if (!form.adHocSupplierPrice.perSquareMeterChanged) {
        form.adHocSupplierPrice.perSquareMeter = 0;
      }

      if (!form.adHocSupplierPrice.perBuildingChanged) {
        form.adHocSupplierPrice.perBuilding = 0;
      }

      if (!form.adHocSupplierPrice.perCouncilAccountChanged) {
        form.adHocSupplierPrice.perCouncilAccount = 0;
      }

      if (!form.adHocSupplierPrice.perHourChanged) {
        form.adHocSupplierPrice.perHour = 0;
      }
    }

    PackagesEx.resetRecomPrices(form);
  }

  public static resetRecomPrices(form) {

    if (form.hasElectricitySupplier) {

      form.electricitySupplierPrice.recomFixedPrice = 0;
      form.electricitySupplierPrice.recomPerTenant = 0;
      form.electricitySupplierPrice.recomPerShop = 0;
      form.electricitySupplierPrice.recomPerMeter = 0;
      form.electricitySupplierPrice.recomPerSquareMeter = 0;
      form.electricitySupplierPrice.recomPerBuilding = 0;
      form.electricitySupplierPrice.recomPerCouncilAccount = 0;
      form.electricitySupplierPrice.recomPerHour = 0;
    }

    if (form.hasWaterSupplier) {

      form.waterSupplierPrice.recomFixedPrice = 0;
      form.waterSupplierPrice.recomPerTenant = 0;
      form.waterSupplierPrice.recomPerShop = 0;
      form.waterSupplierPrice.recomPerMeter = 0;
      form.waterSupplierPrice.recomPerSquareMeter = 0;
      form.waterSupplierPrice.recomPerBuilding = 0;
      form.waterSupplierPrice.recomPerCouncilAccount = 0;
      form.waterSupplierPrice.recomPerHour = 0;
    }

    if (form.hasSewerageSupplier) {

      form.sewerageSupplierPrice.recomFixedPrice = 0;
      form.sewerageSupplierPrice.recomPerTenant = 0;
      form.sewerageSupplierPrice.recomPerShop = 0;
      form.sewerageSupplierPrice.recomPerMeter = 0;
      form.sewerageSupplierPrice.recomPerSquareMeter = 0;
      form.sewerageSupplierPrice.recomPerBuilding = 0;
      form.sewerageSupplierPrice.recomPerCouncilAccount = 0;
      form.sewerageSupplierPrice.recomPerHour = 0;
    }

    if (form.hasGasSupplier) {

      form.gasSupplierPrice.recomFixedPrice = 0;
      form.gasSupplierPrice.recomPerTenant = 0;
      form.gasSupplierPrice.recomPerShop = 0;
      form.gasSupplierPrice.recomPerMeter = 0;
      form.gasSupplierPrice.recomPerSquareMeter = 0;
      form.gasSupplierPrice.recomPerBuilding = 0;
      form.gasSupplierPrice.recomPerCouncilAccount = 0;
      form.gasSupplierPrice.recomPerHour = 0;
    }

    if (form.hasAdHocSupplier) {

      form.adHocSupplierPrice.recomFixedPrice = 0;
      form.adHocSupplierPrice.recomPerTenant = 0;
      form.adHocSupplierPrice.recomPerShop = 0;
      form.adHocSupplierPrice.recomPerMeter = 0;
      form.adHocSupplierPrice.recomPerSquareMeter = 0;
      form.adHocSupplierPrice.recomPerBuilding = 0;
      form.adHocSupplierPrice.recomPerCouncilAccount = 0;
      form.adHocSupplierPrice.recomPerHour = 0;
    }

    return form;
  }

  public static calcPrices(form, service) {
    if (form.hasElectricitySupplier) {

      if (!form.electricitySupplierPrice.fixedPriceChanged) {
        form.electricitySupplierPrice.fixedPrice += service.electricity.fixedPrice;
      }

      if (!form.electricitySupplierPrice.perTenantChanged) {
        form.electricitySupplierPrice.perTenant += service.electricity.perTenant;
      }

      if (!form.electricitySupplierPrice.perShopChanged) {
        form.electricitySupplierPrice.perShop += service.electricity.perShop;
      }

      if (!form.electricitySupplierPrice.perMeterChanged) {
        form.electricitySupplierPrice.perMeter += service.electricity.perMeter;
      }

      if (!form.electricitySupplierPrice.perSquareMeterChanged) {
        form.electricitySupplierPrice.perSquareMeter += service.electricity.perSquareMeter;
      }

      if (!form.electricitySupplierPrice.perBuildingChanged) {
        form.electricitySupplierPrice.perBuilding += service.electricity.perBuilding;
      }

      if (!form.electricitySupplierPrice.perCouncilAccountChanged) {
        form.electricitySupplierPrice.perCouncilAccount += service.electricity.perCouncilAccount;
      }

      if (!form.electricitySupplierPrice.perHourChanged) {
        form.electricitySupplierPrice.perHour += service.electricity.perHour;
      }
    }

    if (form.hasWaterSupplier) {

      if (!form.waterSupplierPrice.fixedPriceChanged) {
        form.waterSupplierPrice.fixedPrice += service.water.fixedPrice;
      }

      if (!form.waterSupplierPrice.perTenantChanged) {
        form.waterSupplierPrice.perTenant += service.water.perTenant;
      }

      if (!form.waterSupplierPrice.perShopChanged) {
        form.waterSupplierPrice.perShop += service.water.perShop;
      }

      if (!form.waterSupplierPrice.perMeterChanged) {
        form.waterSupplierPrice.perMeter += service.water.perMeter;
      }

      if (!form.waterSupplierPrice.perSquareMeterChanged) {
        form.waterSupplierPrice.perSquareMeter += service.water.perSquareMeter;
      }

      if (!form.waterSupplierPrice.perBuildingChanged) {
        form.waterSupplierPrice.perBuilding += service.water.perBuilding;
      }

      if (!form.waterSupplierPrice.perCouncilAccountChanged) {
        form.waterSupplierPrice.perCouncilAccount += service.water.perCouncilAccount;
      }

      if (!form.waterSupplierPrice.perHourChanged) {
        form.waterSupplierPrice.perHour += service.water.perHour;
      }
    }

    if (form.hasSewerageSupplier) {

      if (!form.sewerageSupplierPrice.fixedPriceChanged) {
        form.sewerageSupplierPrice.fixedPrice += service.sewerage.fixedPrice;
      }

      if (!form.sewerageSupplierPrice.perTenantChanged) {
        form.sewerageSupplierPrice.perTenant += service.sewerage.perTenant;
      }

      if (!form.sewerageSupplierPrice.perShopChanged) {
        form.sewerageSupplierPrice.perShop += service.sewerage.perShop;
      }

      if (!form.sewerageSupplierPrice.perMeterChanged) {
        form.sewerageSupplierPrice.perMeter += service.sewerage.perMeter;
      }

      if (!form.sewerageSupplierPrice.perSquareMeterChanged) {
        form.sewerageSupplierPrice.perSquareMeter += service.sewerage.perSquareMeter;
      }

      if (!form.sewerageSupplierPrice.perBuildingChanged) {
        form.sewerageSupplierPrice.perBuilding += service.sewerage.perBuilding;
      }

      if (!form.sewerageSupplierPrice.perCouncilAccountChanged) {
        form.sewerageSupplierPrice.perCouncilAccount += service.sewerage.perCouncilAccount;
      }

      if (!form.sewerageSupplierPrice.perHourChanged) {
        form.sewerageSupplierPrice.perHour += service.sewerage.perHour;
      }
    }

    if (form.hasGasSupplier) {

      if (!form.gasSupplierPrice.fixedPriceChanged) {
        form.gasSupplierPrice.fixedPrice += service.gas.fixedPrice;
      }

      if (!form.gasSupplierPrice.perTenantChanged) {
        form.gasSupplierPrice.perTenant += service.gas.perTenant;
      }

      if (!form.gasSupplierPrice.perShopChanged) {
        form.gasSupplierPrice.perShop += service.gas.perShop;
      }

      if (!form.gasSupplierPrice.perMeterChanged) {
        form.gasSupplierPrice.perMeter += service.gas.perMeter;
      }

      if (!form.gasSupplierPrice.perSquareMeterChanged) {
        form.gasSupplierPrice.perSquareMeter += service.gas.perSquareMeter;
      }

      if (!form.gasSupplierPrice.perBuildingChanged) {
        form.gasSupplierPrice.perBuilding += service.gas.perBuilding;
      }

      if (!form.gasSupplierPrice.perCouncilAccountChanged) {
        form.gasSupplierPrice.perCouncilAccount += service.gas.perCouncilAccount;
      }

      if (!form.gasSupplierPrice.perHourChanged) {
        form.gasSupplierPrice.perHour += service.gas.perHour;
      }
    }

    if (form.hasAdHocSupplier) {

      if (!form.adHocSupplierPrice.fixedPriceChanged) {
        form.adHocSupplierPrice.fixedPrice += service.adHoc.fixedPrice;
      }

      if (!form.adHocSupplierPrice.perTenantChanged) {
        form.adHocSupplierPrice.perTenant += service.adHoc.perTenant;
      }

      if (!form.adHocSupplierPrice.perShopChanged) {
        form.adHocSupplierPrice.perShop += service.adHoc.perShop;
      }

      if (!form.adHocSupplierPrice.perMeterChanged) {
        form.adHocSupplierPrice.perMeter += service.adHoc.perMeter;
      }

      if (!form.adHocSupplierPrice.perSquareMeterChanged) {
        form.adHocSupplierPrice.perSquareMeter += service.adHoc.perSquareMeter;
      }

      if (!form.adHocSupplierPrice.perBuildingChanged) {
        form.adHocSupplierPrice.perBuilding += service.adHoc.perBuilding;
      }

      if (!form.adHocSupplierPrice.perCouncilAccountChanged) {
        form.adHocSupplierPrice.perCouncilAccount += service.adHoc.perCouncilAccount;
      }

      if (!form.adHocSupplierPrice.perHourChanged) {
        form.adHocSupplierPrice.perHour += service.adHoc.perHour;
      }
    }

    PackagesEx.calcRecomPrices(form, service);
  }

  public static calcRecomPrices(form, service) {
    if (form.hasElectricitySupplier) {

      form.electricitySupplierPrice.recomFixedPrice += service.electricity.fixedPrice;
      form.electricitySupplierPrice.recomPerTenant += service.electricity.perTenant;
      form.electricitySupplierPrice.recomPerShop += service.electricity.perShop;
      form.electricitySupplierPrice.recomPerMeter += service.electricity.perMeter;
      form.electricitySupplierPrice.recomPerSquareMeter += service.electricity.perSquareMeter;
      form.electricitySupplierPrice.recomPerBuilding += service.electricity.perBuilding;
      form.electricitySupplierPrice.recomPerCouncilAccount += service.electricity.perCouncilAccount;
      form.electricitySupplierPrice.recomPerHour += service.electricity.perHour;
    }

    if (form.hasWaterSupplier) {

      form.waterSupplierPrice.recomFixedPrice += service.water.fixedPrice;
      form.waterSupplierPrice.recomPerTenant += service.water.perTenant;
      form.waterSupplierPrice.recomPerShop += service.water.perShop;
      form.waterSupplierPrice.recomPerMeter += service.water.perMeter;
      form.waterSupplierPrice.recomPerSquareMeter += service.water.perSquareMeter;
      form.waterSupplierPrice.recomPerBuilding += service.water.perBuilding;
      form.waterSupplierPrice.recomPerCouncilAccount += service.water.perCouncilAccount;
      form.waterSupplierPrice.recomPerHour += service.water.perHour;
    }

    if (form.hasSewerageSupplier) {

      form.sewerageSupplierPrice.recomFixedPrice += service.sewerage.fixedPrice;
      form.sewerageSupplierPrice.recomPerTenant += service.sewerage.perTenant;
      form.sewerageSupplierPrice.recomPerShop += service.sewerage.perShop;
      form.sewerageSupplierPrice.recomPerMeter += service.sewerage.perMeter;
      form.sewerageSupplierPrice.recomPerSquareMeter += service.sewerage.perSquareMeter;
      form.sewerageSupplierPrice.recomPerBuilding += service.sewerage.perBuilding;
      form.sewerageSupplierPrice.recomPerCouncilAccount += service.sewerage.perCouncilAccount;
      form.sewerageSupplierPrice.recomPerHour += service.sewerage.perHour;
    }

    if (form.hasGasSupplier) {

      form.gasSupplierPrice.recomFixedPrice += service.gas.fixedPrice;
      form.gasSupplierPrice.recomPerTenant += service.gas.perTenant;
      form.gasSupplierPrice.recomPerShop += service.gas.perShop;
      form.gasSupplierPrice.recomPerMeter += service.gas.perMeter;
      form.gasSupplierPrice.recomPerSquareMeter += service.gas.perSquareMeter;
      form.gasSupplierPrice.recomPerBuilding += service.gas.perBuilding;
      form.gasSupplierPrice.recomPerCouncilAccount += service.gas.perCouncilAccount;
      form.gasSupplierPrice.recomPerHour += service.gas.perHour;
    }

    if (form.hasAdHocSupplier) {

      form.adHocSupplierPrice.recomFixedPrice += service.adHoc.fixedPrice;
      form.adHocSupplierPrice.recomPerTenant += service.adHoc.perTenant;
      form.adHocSupplierPrice.recomPerShop += service.adHoc.perShop;
      form.adHocSupplierPrice.recomPerMeter += service.adHoc.perMeter;
      form.adHocSupplierPrice.recomPerSquareMeter += service.adHoc.perSquareMeter;
      form.adHocSupplierPrice.recomPerBuilding += service.adHoc.perBuilding;
      form.adHocSupplierPrice.recomPerCouncilAccount += service.adHoc.perCouncilAccount;
      form.adHocSupplierPrice.recomPerHour += service.adHoc.perHour;
    }
  }

  public static getDefaultSupplierPrice(): SupplierPriceViewModel {
    return {
      fixedPrice: 0,
      recomPrice: 0,
      minimalFee: 0,
      perTenant: 0,
      perShop: 0,
      perMeter: 0,
      perSquareMeter: 0,
      perBuilding: null,
      perHour: 0,
      perCouncilAccount: null,
      meterTypes: [],

      fixedPriceChanged: false,
      perTenantChanged: false,
      perShopChanged: false,
      perMeterChanged: false,
      perSquareMeterChanged: false,
      perBuildingChanged: false,
      perCouncilAccountChanged: false,
      perHourChanged: false
    };
  }

  public static getRecommendSum(services, methodOptions: {
    hasElectricitySupplier: boolean;
    hasWaterSupplier: boolean;
    hasGasSupplier: boolean;
    hasSewerageSupplier: boolean;
    hasAdHocSupplier: boolean;

    hasFixedPriceMethod: boolean;
    hasPerTenantMethod: boolean;
    hasPerShopMethod: boolean;
    hasPerMeterMethod: boolean;
    hasPerSQMeterMethod: boolean;
    hasPerBuildingMethod: boolean;
    hasPerCouncilAccountMethod: boolean;
    hasPerHourMethod: boolean;
    hasCustomMethod: boolean;
  }) {
    let result = new RecommendedPriceViewModel();
    InputEx.getServiceEnumerator(services, (service: any) => {
      if (!service.isActive || service.chargingType == ChargingType.OneTime) {
        return;
      }

      if (service.electricity.isActive && methodOptions.hasElectricitySupplier) {
        this.addRecommendedPrice(result.electricity, service.electricity, {
          ...methodOptions,
          chargingMethod: service.chargingMethod
        });
      }
      if (service.water.isActive && methodOptions.hasWaterSupplier) {
        this.addRecommendedPrice(result.water, service.water, {
          ...methodOptions,
          chargingMethod: service.chargingMethod
        });
      }
      if (service.gas.isActive && methodOptions.hasGasSupplier) {
        this.addRecommendedPrice(result.gas, service.gas, {
          ...methodOptions,
          chargingMethod: service.chargingMethod
        });
      }
      if (service.sewerage.isActive && methodOptions.hasSewerageSupplier) {
        this.addRecommendedPrice(result.sewerage, service.sewerage, {
          ...methodOptions,
          chargingMethod: service.chargingMethod
        });
      }
      if (service.adHoc.isActive && methodOptions.hasAdHocSupplier) {
        this.addRecommendedPrice(result.adHoc, service.adHoc, {
          ...methodOptions,
          chargingMethod: service.chargingMethod
        });
      }
    });

    return result;
  }

  private static addRecommendedPrice(left, right, methodOptions: any) {
    if (methodOptions.hasFixedPriceMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.FixedPrice)) {
      left.fixedPrice += right.fixedPrice;
    }
    if (methodOptions.hasPerTenantMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerTenant)) {
      left.perTenant += right.perTenant;
    }
    if (methodOptions.hasPerShopMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerShop)) {
      left.perShop += right.perShop;
    }
    if (methodOptions.hasPerSQMeterMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerSquareMeter)) {
      left.perSquareMeter += right.perSquareMeter;
    }

    if (!isNaN(right.perBuilding)
      && (methodOptions.hasPerBuildingMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerBuilding))) {
      left.perBuilding += right.perBuilding;
    }
    if (!isNaN(right.perCouncilAccount)
      && (methodOptions.hasPerCouncilAccountMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerCouncilAccount))) {
      left.perCouncilAccount += right.perCouncilAccount;
    }
    if (!isNaN(right.perHour)
      && (methodOptions.hasPerHourMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerHour))) {
      left.perHour += right.perHour;
    }

    if (methodOptions.hasPerMeterMethod || (methodOptions.hasCustomMethod && methodOptions.chargingMethod == ChargingMethod.PerMeter)) {
      left.perMeter += right.perMeter;
      right.meterTypes.forEach(meterType => {
        let value = meterType.value;
        left.meterTypes[meterType.id] == null ?
          left.meterTypes[meterType.id] = value : left.meterTypes[meterType.id] += value;
      });
    }
  }

}
