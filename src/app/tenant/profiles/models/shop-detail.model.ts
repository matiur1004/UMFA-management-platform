import {FieldType} from '@models';

export class ShopGeneralInfoViewModel {
  shopId: string;
  shopName: string;
  area: number;
  floor: number;
  firstTenantBillingDate: string;
}

export class ShopMeterViewModel {
  meterId: string;
  photoUrl: string;
  equipmentModel: string;
  serialNumber: string;
  supplyType: number;
  description: string;
  attributes: MeterEquipmentAttributeViewModel[];
  billingRegisters: string[];
  appliedTariff: AppliedTariffViewModel;
  tariffName: string;
}

export class MeterEquipmentAttributeViewModel {
  id: string;
  name: string;
  value: string;
  unitName: string;
  fieldType: FieldType;
}

export class AppliedTariffViewModel {
  versionId: string;
  tariffValue: string;
}

export class ShopCostsViewModel {

}

export enum TabId {
  GeneralInfo,
  AllocatedEquipment,
  Readings,
  Costs,
  Statistic,
  Prepaid
}
