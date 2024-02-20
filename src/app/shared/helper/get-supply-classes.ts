import {SupplyTypeIconNames} from '@models';

export const getSupplyTypeIconClass = (item: string): string => {
  return `${SupplyTypeIconNames[+item]}-icon`;
};

export const getSupplyTypeLabelClass = (item: string): string => {
  return `${SupplyTypeIconNames[+item]}-lbl`;
};
