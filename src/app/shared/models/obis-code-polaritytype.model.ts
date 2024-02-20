//PolarityType
export enum PolarityType {
  Positive,
  Negative
}
export const PolarityTypeText = {
  [PolarityType.Positive]: 'Positive',
  [PolarityType.Negative]: 'Negative'
};
export const PolarityTypeDropdownItems = [
  {label: PolarityTypeText[PolarityType.Positive], value: PolarityType.Positive},
  {label: PolarityTypeText[PolarityType.Negative], value: PolarityType.Negative}
];
export const getPolarityTypes = (types: any): any => {
  return Object.keys(types).filter(key => !isNaN(types[key])).map((item, index) => {
    item = PolarityTypeText[index];
    return item;
  });
};
export function getPolarityTypeIndexes() {
  return Object.keys(PolarityType).filter(
    (type) => !isNaN(<any>type)).map((type) => +type);
}
