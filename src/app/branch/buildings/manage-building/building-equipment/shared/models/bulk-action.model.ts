export enum EquipmentBulkStepActionType {
  SetNumber,
  SetDevice,
  SetLocation,
  SetManufactureDate,
}

export enum Step {
  EquipmentBulk,
  ShopBulk,
  Attributes,
  RegistersAndReadings
}

export const equipmentBulkStepActionText = {
  [EquipmentBulkStepActionType.SetNumber]: 'Set Number',
  [EquipmentBulkStepActionType.SetDevice]: 'Set Device',
  [EquipmentBulkStepActionType.SetLocation]: 'Set Location',
  [EquipmentBulkStepActionType.SetManufactureDate]: 'Set Manufacture Date'
};

export enum ShopsStepActionType {
  SelectSupplyToAndLocationType,
  SetDescription,
  SetUnits,
  SetParentMeter
}

export enum ShopStepDescriptionFieldType {
  SerialNumber,
  EquipmentGroup,
  DeviceType,
  Parent,
  SupplyTo,
  LocationType,
  Units,
  FreeText
}

export const shopBulkStepActionText = {
  [ShopsStepActionType.SelectSupplyToAndLocationType]: 'Select supply to and location type',
  [ShopsStepActionType.SetDescription]: 'Set description',
  [ShopsStepActionType.SetUnits]: 'Set units',
  [ShopsStepActionType.SetParentMeter]: 'Set parent meter'
};

export enum RegistersAndReadingsStepActionType {
  SetRegisterNote,
  SetRatio,
  SetReading,
  SetReadingDate,
  SetBilling
}

export const registersAndReadingsStepActionText = {
  [RegistersAndReadingsStepActionType.SetRegisterNote]: 'Set register note',
  [RegistersAndReadingsStepActionType.SetRatio]: 'Set ratio',
  [RegistersAndReadingsStepActionType.SetReading]: 'Set reading',
  [RegistersAndReadingsStepActionType.SetReadingDate]: 'Set reading date',
  [RegistersAndReadingsStepActionType.SetBilling]: 'Set billing'
};

export const registerAndReadingsStepActionTypes = [
  RegistersAndReadingsStepActionType.SetRegisterNote,
  RegistersAndReadingsStepActionType.SetRatio,
  RegistersAndReadingsStepActionType.SetReading,
  RegistersAndReadingsStepActionType.SetReadingDate,
  RegistersAndReadingsStepActionType.SetBilling
];
