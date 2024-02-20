import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as commonDataState from '../store/state/common-data.state';
import * as commonDataSelector from '../store/selectors/common-data.selectors';
import {map} from 'rxjs/operators';
import {RegisterViewModel} from '@models';

@Pipe({
  name: 'checkVirtualRegister'
})
export class CheckVirtualRegisterPipe implements PipeTransform {

  constructor(private store$: Store<commonDataState.State>) {
  }

  transform(registerId: string, args?: any): Observable<boolean> {
    return this.store$.pipe(select(commonDataSelector.getRegisters)).pipe(
      map((registers: RegisterViewModel[]) => {
        const register = registers.find(r => r.id === registerId);

        return register.isVirtualRegister;
      })
    );

  }

}
