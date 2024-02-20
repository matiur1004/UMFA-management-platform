import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {Pipe, PipeTransform} from '@angular/core';
import * as fromStore from '../store/selectors/common-data.selectors';
import {State as CommonDataState} from '../store/state/common-data.state';
import {map} from 'rxjs/operators';
import {TimeOfUse, TimeOfUseName, TotalRegister} from '@models';

@Pipe({
  name: 'registerUnit'
})
export class RegisterUnitPipe implements PipeTransform {
  // TODO RT: Use this pipe anywhere where we need unit of measurement display name; use unitOfMeasurement property instaed of id
  constructor(private readonly store: Store<CommonDataState>) {
  }

  transform(register: string | TotalRegister, type: string = ''): Observable<string> {
    if (typeof register === 'string') {
      return this.store.pipe(select(fromStore.getRegisters),
        map(arr => {
          let result = '';
          const selected = arr.find(r => r.id === register || r.name === register);
          if (selected && selected.unit) {
            if(type == 'label') {
              if ((selected.timeOfUse > TimeOfUse.None)) {
                result = selected.unit + '-' + TimeOfUseName[selected.timeOfUse].substr(0, 1);
              } else if (selected.timeOfUse === TimeOfUse.None) {
                result = selected.unit;
              }
            } else {
              if(register.length > 10) {
                result = selected.unit;
              } else {
                if ((selected.timeOfUse > TimeOfUse.None)) {
                  result = selected.unit + '-' + TimeOfUseName[selected.timeOfUse].substr(0, 1);
                } else if (selected.timeOfUse === TimeOfUse.None) {
                  result = selected.unit;
                }
              }
            }
            
          } else {
            result = selected?.name || '';
          }
          return result;
        }));
    } else {
      if (register.timeOfUse > TimeOfUse.None) {
        return of(register.unitName + '-' + TimeOfUseName[register.timeOfUse].substr(0, 1));
      }
      return of(register.unitName);
    }
  }
}
