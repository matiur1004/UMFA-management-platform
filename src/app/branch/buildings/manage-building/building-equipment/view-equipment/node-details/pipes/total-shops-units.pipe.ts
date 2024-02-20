import {Pipe, PipeTransform} from '@angular/core';
import {UnitType} from '@models';
import {AllocatedUnitViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Pipe({
  name: 'totalShopsUnits',
  pure: false
})
export class TotalShopsUnitsPipe implements PipeTransform {

  transform(value: AllocatedUnitViewModel[], isSelected: boolean): any {
    if (!isSelected) {
      let res = 0;
      value && value.forEach(el => {
        if (el.unitType === UnitType.Shop) {
          res++;
        }
      });
      return res;
    }

    return value.filter(u => u.isSelected).length || 0;
  }

}
