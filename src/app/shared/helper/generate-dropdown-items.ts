import {DropdownItem} from '@models';

export interface DropdownItemScheme {
  label: string;
  value: string;
}

export const getDropdownItemsFromArray = (arr: any[], defaultItem?: DropdownItem): DropdownItem[] => {
  if (!arr) return [];
  const newArr = arr.map((item, index) => ({
    label: item,
    value: index
  }));
  return defaultItem ? [defaultItem, ...newArr] : newArr;
};

export const getDropdownItemsFromObjects = (
  arr: any[],
  scheme: DropdownItemScheme,
  defaultItem?: DropdownItem
): DropdownItem[] => {

  if (!arr) return [];

  const newArr: DropdownItem[] = Object.values(arr
    .reduce((acc, cur) => {
      acc[cur[scheme.value]] = {
        label: cur[scheme.label],
        value: cur[scheme.value]
      };
      return acc;
    }, {}));

  return defaultItem ? [defaultItem, ...newArr] : newArr;
};

export const getActiveDropdownItemFromList = (arr: any[], value: any): DropdownItem => {
  return arr ? arr.find(item => item.value === value) : [];
};
