//EnergyType
export enum EnergyType {
  ActiveEnergy,
  ReactiveEnergy,
  MaximumDemand
}
export const EnergyTypeText = {
  [EnergyType.ActiveEnergy]: 'Active Energy',
  [EnergyType.ReactiveEnergy]: 'Reactive Energy',
  [EnergyType.MaximumDemand]: 'Maximum Demand'
};
export const EnergyTypeDropdownItems = [
  {label: EnergyTypeText[EnergyType.ActiveEnergy], value: EnergyType.ActiveEnergy},
  {label: EnergyTypeText[EnergyType.ReactiveEnergy], value: EnergyType.ReactiveEnergy},
  {label: EnergyTypeText[EnergyType.MaximumDemand], value: EnergyType.MaximumDemand}
];
export const getEnergyTypes = (types: any): any => {
  return Object.keys(types).filter(key => !isNaN(types[key])).map((item, index) => {
    item = EnergyTypeText[index];
    return item;
  });
};
export function getEnergyTypeIndexes() {
  return Object.keys(EnergyType).filter(
    (type) => !isNaN(<any>type)).map((type) => +type);
}
