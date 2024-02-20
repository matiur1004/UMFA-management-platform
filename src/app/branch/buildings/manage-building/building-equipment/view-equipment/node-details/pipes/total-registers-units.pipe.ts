import {Pipe, PipeTransform} from '@angular/core';
import {SearchFilterUnitsModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Pipe({
  name: 'totalRegistersUnits'
})
export class TotalRegistersUnitsPipe implements PipeTransform {

  transform(units: SearchFilterUnitsModel[]): any {
    return units.reduce((res, unit) => {
      unit.nodesInfo.forEach(node => {
        res += node.registers.length;
      });

      return res;
    }, 0);

  }
}
