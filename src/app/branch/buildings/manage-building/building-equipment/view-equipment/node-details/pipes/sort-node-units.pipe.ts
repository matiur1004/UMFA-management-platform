import {Pipe, PipeTransform} from '@angular/core';
import {AllocatedUnitViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Pipe({
  name: 'sortNodeUnits'
})
export class SortNodeUnitsPipe implements PipeTransform {

  transform(value: AllocatedUnitViewModel[], propery: string, sortIndex = 1): any {
    const res = value ? [].concat(value) : [];
    return res.sort((a: any, b: any) => {
      const a_value = a[propery] !== undefined ? a[propery] : null;
      const b_value = b[propery] !== undefined ? b[propery] : null;
      if (a_value > b_value) {
        return sortIndex;
      } else if (a_value < b_value) {
        return -1 * sortIndex;
      }

      return 0;
    });
  }

}
