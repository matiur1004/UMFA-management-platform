import {Pipe, PipeTransform} from '@angular/core';
import {MeterViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Pipe({
  name: 'meterRegisterName'
})
export class MeterRegisterNamePipe implements PipeTransform {
  constructor(private store: Store<fromEquipment.State>) {
  }

  transform(signalMeterId: string, args: string): Observable<string> {
    return this.store.pipe(select(fromEquipment.getEquipmentList), map((meters: MeterViewModel[]) => {
      const registers = meters.find(m => m.id === signalMeterId).registers;

      return registers.find(r => r.id === args).name;
    }));
  }

}
