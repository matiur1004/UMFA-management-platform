import {InputEx} from "@shared-helpers";
import {ChargingMethod} from "@models";

export class BuildingServicesCalc {

  public static calculatePrices(model) {
    let result = JSON.parse(JSON.stringify(model));

    if (result.hasElectricitySupplier) BuildingServicesCalc.pricesHelper(result, result.electricitySupplierPrice);
    if (result.hasWaterSupplier) BuildingServicesCalc.pricesHelper(result, result.waterSupplierPrice);
    if (result.hasSewerageSupplier) BuildingServicesCalc.pricesHelper(result, result.sewerageSupplierPrice);
    if (result.hasGasSupplier) BuildingServicesCalc.pricesHelper(result, result.gasSupplierPrice);
    if (result.hasAdHocSupplier) BuildingServicesCalc.pricesHelper(result, result.adHocSupplierPrice);

    return result;
  }

  public static calculateMeterTypesSuppliersSum(service, supplierOptions, meterTypesQuantity) {
    let result = 0;

    if (supplierOptions.hasElectricitySupplier) result = this.calculateMeterTypeSuppliersSum(service.electricity, meterTypesQuantity);
    if (supplierOptions.hasWaterSupplier) result += this.calculateMeterTypeSuppliersSum(service.water, meterTypesQuantity);
    if (supplierOptions.hasSewerageSupplier) result += this.calculateMeterTypeSuppliersSum(service.sewerage, meterTypesQuantity);
    if (supplierOptions.hasGasSupplier) result += this.calculateMeterTypeSuppliersSum(service.gas, meterTypesQuantity);
    if (supplierOptions.hasAdHocSupplier) result += this.calculateMeterTypeSuppliersSum(service.adHoc, meterTypesQuantity);

    return result;
  }

  public static calculateCustomPrice(service, supplierOptions, quantity, includeMeterTypes: boolean = false) {
    let result = 0;

    let chargingMethod: ChargingMethod = service.chargingMethod;
    switch (chargingMethod) {
      case ChargingMethod.FixedPrice:
        result += this.calculateSuppliersSum(service, supplierOptions, 'fixedPrice');
        break;

      case ChargingMethod.PerBuilding:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perBuilding');
        break;

      case ChargingMethod.PerHour:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perHour') * quantity.numberOfHours;
        break;

      case ChargingMethod.PerCouncilAccount:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perCouncilAccount') * quantity.numberOfCouncilAcc;
        break;

      case ChargingMethod.PerMeter:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perMeter') * quantity.numberOfMeters;
        if (includeMeterTypes)
          result += this.calculateMeterTypesSuppliersSum(service, supplierOptions, quantity.meterTypes);
        break;

      case ChargingMethod.PerShop:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perShop') * quantity.numberOfShops;
        break;

      case ChargingMethod.PerSquareMeter:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perSquareMeter') * quantity.numberOfSqMetres;
        break;

      case ChargingMethod.PerTenant:
        result += this.calculateSuppliersSum(service, supplierOptions, 'perTenant') * quantity.numberOfTenants;
        break;

      default:
        break;
    }

    return result;
  }

  public static getCostPerUnit(service, supplierOptions) {
    let result = 0;

    let chargingMethod: ChargingMethod = service.chargingMethod;
    switch (chargingMethod) {
      case ChargingMethod.FixedPrice:
        result = this.calculateSuppliersSum(service, supplierOptions, 'fixedPrice');
        break;

      case ChargingMethod.PerBuilding:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perBuilding');
        break;

      case ChargingMethod.PerHour:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perHour');
        break;

      case ChargingMethod.PerCouncilAccount:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perCouncilAccount');
        break;

      case ChargingMethod.PerMeter:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perMeter');
        break;

      case ChargingMethod.PerShop:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perShop');
        break;

      case ChargingMethod.PerSquareMeter:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perSquareMeter');
        break;

      case ChargingMethod.PerTenant:
        result = this.calculateSuppliersSum(service, supplierOptions, 'perTenant');
        break;

      default:
        break;
    }

    return result;
  }

  public static getQuantityForService(service, quantity) {
    let result = null;

    let chargingMethod: ChargingMethod = service.chargingMethod;
    switch (chargingMethod) {

      case ChargingMethod.PerHour:
        result = quantity.numberOfHours;
        break;

      case ChargingMethod.PerCouncilAccount:
        result = quantity.numberOfCouncilAcc;
        break;

      case ChargingMethod.PerMeter:
        result = quantity.numberOfMetres;
        break;

      case ChargingMethod.PerShop:
        result = quantity.numberOfShops;
        break;

      case ChargingMethod.PerSquareMeter:
        result = quantity.numberOfSqMetres;
        break;

      case ChargingMethod.PerTenant:
        result = quantity.numberOfSqMetres;
        break;

      default:
        break;
    }

    return result;
  }

  public static calculateCustomTotalPrice(services, supplierOptions, quantity) {
    let result = 0;

    InputEx.getServiceEnumerator(services, (service: any, _) => {
      result += this.calculateCustomPrice(service, supplierOptions, quantity);
    });

    return result;
  }

  private static pricesHelper(model, supplierPrice) {
    model.perTenant += supplierPrice.perTenant;
    model.perShop += supplierPrice.perShop;
    model.perMeter += supplierPrice.perMeter;
    model.perSquareMeter += supplierPrice.perSquareMeter;
    model.perCouncilAccount += supplierPrice.perCouncilAccount;
    model.perHour += supplierPrice.perHour;
    model.perBuilding += supplierPrice.perBuilding;
    model.fixedPrice += supplierPrice.fixedPrice;
  }

  private static calculateSuppliersSum(service, supplierOptions, key) {
    let result = 0;
    if (supplierOptions.hasElectricitySupplier) result = service.electricity[key];
    if (supplierOptions.hasWaterSupplier) result += service.water[key];
    if (supplierOptions.hasSewerageSupplier) result += service.sewerage[key];
    if (supplierOptions.hasGasSupplier) result += service.gas[key];
    if (supplierOptions.hasAdHocSupplier) result += service.adHoc[key];

    return result;
  }

  private static calculateMeterTypeSuppliersSum(supplier, meterTypesQuantities) {
    let result = 0;

    supplier.meterTypes.forEach(meterType => {
      let meterTypeQuantity = meterTypesQuantities[meterType.id];
      if (meterTypeQuantity)
        result += meterType.value * meterTypeQuantity.quantity;
    });

    return result;
  }
}
