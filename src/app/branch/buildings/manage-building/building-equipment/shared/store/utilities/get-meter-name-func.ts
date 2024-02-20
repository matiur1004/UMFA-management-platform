import {SupplyType, SupplyTypeText} from '@models';

export function getMeterName(serialNumber: string | number, supplyType: SupplyType): string {
  return serialNumber.toString().slice(-4) + '-' + SupplyTypeText[supplyType].slice(0, 1);
}
