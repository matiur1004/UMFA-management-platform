import {Pipe, PipeTransform} from '@angular/core';
import {AllocatedUnitViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Pipe({
  name: 'unitType',
  pure: false
})
export class UnitTypePipe implements PipeTransform {

  transform(unitType: AllocatedUnitViewModel): string {
    if (!unitType.tenantName) {
      return 'Vacant';
    }

    return unitType.isLiable ? 'Liable' : 'Not Liable';
  }

}
