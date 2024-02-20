import {Pipe, PipeTransform} from '@angular/core';
import {NodeUnitFilter} from '../../../shared/models';
import {UnitType} from '@models';

@Pipe({
  name: 'filterCostUnitsShowing'
})
export class FilterCostUnitsShowingPipe implements PipeTransform {

  transform(value: any[], filter: NodeUnitFilter): any {
    let res = [];
    if (Array.isArray(value)) {
      switch (filter) {
        case NodeUnitFilter.AllUnits:
          res = value;
          break;
        case NodeUnitFilter.LiableUnits:
          res = value.filter(el => el.isLiable);
          break;
        case NodeUnitFilter.NotLiableUnits:
          res = value.filter(el => !el.isLiable);
          break;
        case NodeUnitFilter.VacantShops:
          res = value.filter(el => el.unitType === UnitType.Shop && !el.tenantName);
          break;
      }
    }

    return res;
  }

}
