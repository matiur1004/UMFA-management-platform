import {Pipe, PipeTransform} from '@angular/core';
import {
  getTreeChildrenIds,
  getTreesLookup,
  ParentMeterValueModel
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {UnitMetersFormValue} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers/bulk-equipment-wizard-reducers/shops-step.store';

@Pipe({
  name: 'parentMeterByGroup'
})
export class ParentMeterByGroupPipe implements PipeTransform {

  transform(meter: UnitMetersFormValue, existMeters: ParentMeterValueModel[], newMeters: ParentMeterValueModel[]): Array<any> {
    if (!meter) {
      return [];
    }

    const existedMeters = existMeters.filter(e => e.supplyType === meter.supplyType);
    const newmeters = newMeters.filter(e => e.supplyType === meter.supplyType);
    const treesLookup = getTreesLookup([...newMeters]);
    const meterTree = treesLookup[meter.id];
    const meterChildrenIds = getTreeChildrenIds(meterTree);
    const filteredNewMeters = newmeters.filter(e => e.id !== meter.id && !meterChildrenIds.has(e.id));

    return existedMeters.concat(filteredNewMeters);
  }

}
