export enum SupplyType {
  Electricity,
  Water,
  Gas,
  Sewerage,
  AdHoc,
  Other
}

export const SupplyTypeText = {
  [SupplyType.Electricity]: 'Electricity',
  [SupplyType.Water]: 'Water',
  [SupplyType.Gas]: 'Gas',
  [SupplyType.Sewerage]: 'Sewerage',
  [SupplyType.AdHoc]: 'Ad Hoc'
};

export const SupplyTypeDropdownItems = [
  {label: SupplyTypeText[SupplyType.Electricity], value: SupplyType.Electricity},
  {label: SupplyTypeText[SupplyType.Water], value: SupplyType.Water},
  {label: SupplyTypeText[SupplyType.Gas], value: SupplyType.Gas},
  {label: SupplyTypeText[SupplyType.Sewerage], value: SupplyType.Sewerage},
  {label: SupplyTypeText[SupplyType.AdHoc], value: SupplyType.AdHoc}
];

export const SupplyTypeClassNames = [
  {label: 'electricity', value: SupplyType.Electricity},
  {label: 'water', value: SupplyType.Water},
  {label: 'gas', value: SupplyType.Gas},
  {label: 'sewerage', value: SupplyType.Sewerage},
  {label: 'ad-hoc', value: SupplyType.AdHoc}
];

export const SupplyTypeIconNames: string[] = ['electricity', 'water', 'gas', 'sewerage', 'ad-hoc'];

export const getSupplierTypes = (types: any): any => {
  return Object.keys(types).filter(key => !isNaN(types[key])).map((item, index) => {
    item = SupplyTypeText[index];
    return item;
  });
};

export function getSupplyTypeIndexes() {
  return Object.keys(SupplyType).filter(
    (type) => !isNaN(<any>type)).map((type) => +type);
}

export const SystemEquipmentGroups = {
  ElectricityMeters: 'Electricity Meters'
};
