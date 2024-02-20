//ReadingType
export enum ReadingType {
  kWh,
  kVa,
  kvahr
}
export const ReadingTypeText = {
  [ReadingType.kWh]: 'kWh',
  [ReadingType.kVa]: 'kVa',
  [ReadingType.kvahr]: 'kvahr'
};
export const ReadingTypeDropdownItems = [
  {label: ReadingTypeText[ReadingType.kWh], value: ReadingType.kWh},
  {label: ReadingTypeText[ReadingType.kVa], value: ReadingType.kVa},
  {label: ReadingTypeText[ReadingType.kvahr], value: ReadingType.kvahr}
];
export const getReadingTypes = (types: any): any => {
  return Object.keys(types).filter(key => !isNaN(types[key])).map((item, index) => {
    item = ReadingTypeText[index];
    return item;
  });
};
export function getReadingTypeIndexes() {
  return Object.keys(ReadingType).filter(
    (type) => !isNaN(<any>type)).map((type) => +type);
}
