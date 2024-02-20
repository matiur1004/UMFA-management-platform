import {Pipe, PipeTransform} from '@angular/core';
import {SupplyType} from '../models';
import {EquipmentAttributeViewModel} from '@models';

@Pipe({name: 'filterAttributesForSupply'})
export class FilterAttributesForSupplyPipe implements PipeTransform {
  transform(value: EquipmentAttributeViewModel[], supplyType?: SupplyType): EquipmentAttributeViewModel[] {
    if (value && supplyType >= 0)
      return value.filter(attr => attr.equipmentGroups.some(eg => eg.supplyType == supplyType));
    return value;
  }
}
