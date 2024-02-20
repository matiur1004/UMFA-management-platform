import {Pipe, PipeTransform} from '@angular/core';
import {MeterViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {getMeterName} from '@app/branch/buildings/manage-building/building-equipment/shared/store/utilities/get-meter-name-func';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Pipe({
  name: 'meterUnit'
})
export class MeterUnitPipe implements PipeTransform {
  constructor(private store: Store<fromEquipment.State>) {
  }

  transform(meterId: string): Observable<string> {
    return this.store.pipe(select(fromEquipment.getEquipmentList), map((meters: MeterViewModel[]) => {
      if (meterId) {
        const selectedMeter = meters.find(m => m.id === meterId);
        const {serialNumber, supplyType} = selectedMeter;

        selectedMeter.name = getMeterName(serialNumber, supplyType);

        return selectedMeter.name;
      }

      return '';
    }));
  }

}
