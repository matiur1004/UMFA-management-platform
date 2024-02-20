//Tariff Type
export enum TariffType {
  Tariff1,
  Tariff2,
  Tariff3,
  Tariff4,
  Total,
}
export const TariffTypeText = {
  [TariffType.Tariff1]: 'Tariff 1',
  [TariffType.Tariff2]: 'Tariff 2',
  [TariffType.Tariff3]: 'Tariff 3',
  [TariffType.Tariff4]: 'Tariff 4',
  [TariffType.Total]: 'Total'
};
export const TariffTypeDropdownItems = [
  {label: TariffTypeText[TariffType.Tariff1], value: TariffType.Tariff1},
  {label: TariffTypeText[TariffType.Tariff2], value: TariffType.Tariff2},
  {label: TariffTypeText[TariffType.Tariff3], value: TariffType.Tariff3},
  {label: TariffTypeText[TariffType.Tariff4], value: TariffType.Tariff4},
  {label: TariffTypeText[TariffType.Total], value: TariffType.Total}
];
export const getTariffTypes = (types: any): any => {
  return Object.keys(types).filter(key => !isNaN(types[key])).map((item, index) => {
    item = TariffTypeText[index];
    return item;
  });
};
export function getTariffTypeIndexes() {
  return Object.keys(TariffType).filter(
    (type) => !isNaN(<any>type)).map((type) => +type);
}
