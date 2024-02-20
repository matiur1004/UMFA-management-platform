import {Pipe, PipeTransform} from '@angular/core';
import {UnitFilter} from '../../../shared/models';
import {UnitType} from '@models';

@Pipe({
  name: 'filterUnitsShowing'
})
export class FilterUnitsShowingPipe implements PipeTransform {

  transform(value: any[], filter: UnitFilter, floor: any = ''): any {
    let res = [];
    if (Array.isArray(value)) {
      switch (filter) {
        case UnitFilter.AllUnits:
          res = value;
          break;
        case UnitFilter.AllShops:
          res = value.filter(el => el.unitType === UnitType.Shop);
          break;
        case UnitFilter.AllCommonAreas:
          res = value.filter(el => el.unitType === UnitType.CommonArea);
          break;
        case UnitFilter.ConnectedUnits:
          res = value.filter(el => !el.tenantName);
          break;
        case UnitFilter.NotConnectedUnits:
          res = value.filter(el => !!el.tenantName);
          break;
      }

      if (floor !== '') {
        res = res.filter(el => el.floor === floor);
      }
    }

    return res;
  }

}
