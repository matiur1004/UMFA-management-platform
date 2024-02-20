import {SupplyType, UserViewModel} from '@models';
import {StringExtension} from '@shared-helpers';

// Charge
export class ChargeEditViewModel {
  basedOnReadingsLineItems: BasedOnReadingsChargeLineItemViewModel[];
  fixedPriceLineItems: BasedOnFixedPriceChargeLineItemViewModel[];
  createdByUser: UserViewModel;
  createdOn: Date;
  id: string;
  name: string;
  updatedByUser: UserViewModel;
  updatedOn: Date;
  supplyType: SupplyType;
  additionalChargeValues: ChargeValueInfoViewModel[];

  constructor() {
    this.basedOnReadingsLineItems = [];
    this.fixedPriceLineItems = [];
    this.createdByUser = new UserViewModel();
    this.createdOn = null;
    this.id = null;
    this.name = null;
    this.updatedByUser = new UserViewModel();
    this.updatedOn = null;
    this.supplyType = SupplyType.Electricity;
    this.additionalChargeValues = [];
  }
}

export class ChargeViewModel extends ChargeEditViewModel {
}

// Charge line Items
export class BaseChargeLineItemViewModel {
  id: string;
  name: string;
  chargingType: ChargeLineItemChargingType;
  registerId?: string;
}

export class BasedOnReadingsChargeLineItemViewModel extends BaseChargeLineItemViewModel {

  constructor(name?: string) {
    super();
    this.id = StringExtension.NewGuid();
    this.name = name || null;
    this.chargingType = ChargeLineItemChargingType.BasedOnReadings;
    this.registerId = null;
  }
}

export class BasedOnFixedPriceChargeLineItemViewModel extends BaseChargeLineItemViewModel {
  basicPeriod: BasicPeriod;

  constructor(name?: string) {
    super();
    this.id = StringExtension.NewGuid();
    this.name = name || null;
    this.chargingType = ChargeLineItemChargingType.FixedPrice;
    this.basicPeriod = BasicPeriod.Day;
  }
}

export type ChargeLineItemTypes = BasedOnReadingsChargeLineItemViewModel | BasedOnFixedPriceChargeLineItemViewModel;

export enum BasicPeriod {
  Day,
  Month,
}

export enum ChargeLineItemChargingType {
  BasedOnReadings,
  FixedPrice,
}

export const ChargeLineItemChargingTypeText = ['Based on Readings', 'Fixed Price'];

export const ChargeLineItemChargingTypeDropdownItems = [
  {
    label: ChargeLineItemChargingTypeText[ChargeLineItemChargingType.BasedOnReadings],
    value: ChargeLineItemChargingType.BasedOnReadings
  },
  {
    label: ChargeLineItemChargingTypeText[ChargeLineItemChargingType.FixedPrice],
    value: ChargeLineItemChargingType.FixedPrice
  },
];


// Charge value
export class ChargeEditValueViewModel {
  id: string;
  name: string;
  increase: number;
  additionalChargeId: string;
  startDate: string;
  endDate: string;
  lineItemValues: ChargeLineItemValuesViewModel[];
  createdBy: string;
  updatedBy: string;
  createdOn: Date;
  updatedOn: Date;
  versions: ChargeValueInfoViewModel[];

  constructor() {
    this.id = null;
    this.name = null;
    this.increase = 0;
    this.additionalChargeId = null;
    this.startDate = null;
    this.endDate = null;
    this.lineItemValues = [];
    this.createdBy = null;
    this.updatedBy = null;
    this.createdOn = null;
    this.updatedOn = null;
    this.versions = [];
  }
}

export class ChargeValueInfoViewModel {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createdOn: Date;
  updatedOn: Date;
  createdByUser: UserViewModel;
  updatedByUser: UserViewModel;
}

export class ChargeLineItemValuesViewModel {
  lineItemId: string;
  lineItemName: string;
  chargingMethod: string;
  value: number;
}

// Orders
export enum ChargesListOrder {
  NameDesc = -1,
  NameAsc = 1,
  ValueNameDesc = -2,
  ValueNameAsc = 2,
}


export enum OrderVersion {
  ValuesAsc = 1,
  ValuesDesc = -1,
  CreatedAsc = 2,
  CreatedDesc = -2,
  CreatedByAsc = 3,
  CreatedByDesc = -3,
  UpdatedAsc = 4,
  UpdatedDesc = -4,
  UpdatedByAsc = 5,
  UpdatedByDesc = -5,
  IsActiveAsc = 6,
  IsActiveDesc = -6,
  StartDateAsc = 7,
  StartDateDesc = -7
}

