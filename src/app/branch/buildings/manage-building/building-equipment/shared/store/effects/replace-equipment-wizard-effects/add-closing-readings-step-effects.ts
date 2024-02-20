import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';

import * as addClosingReadingsActions
  from '../../actions/replace-equipment-wizard-actions/add-closing-readings-step.actions';
import * as replaceWizardActions from '../../actions/replace-equipment-wizard-actions/replace-wizard.actions';
import * as replaceEquipmentActions
  from '../../actions/replace-equipment-wizard-actions/replace-equipment-step.actions';

import * as addClosingReadingsStore
  from '../../reducers/replace-equipment-wizard-reducers/add-closing-readings-step.store';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';

import {MeterService} from '../../../meter.service';
import {AddClosingReadingViewModel, MeterRegisterViewModel} from '../../../models';

@Injectable()
export class AddClosingReadingsStepEffects {

  // Init registers
  initRegisters = createEffect(() => this.actions$.pipe(
    ofType(addClosingReadingsActions.INIT_REGISTERS),
    withLatestFrom(this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: any, buildingId, selectedVersionId) => ({
        meterId: action.payload,
        buildingId: buildingId,
        versionId: selectedVersionId
      })),
    switchMap(({meterId, buildingId, versionId}) => {
      return this.meterService.getMeter(buildingId, meterId, versionId).pipe(
        mergeMap(result => {

          const form = {
            ...addClosingReadingsStore.INIT_DEFAULT_STATE,
            readings: this.mapToAddClosingReadingsViewModel(result.equipment.registers)
          };

          return [
            new SetValueAction(addClosingReadingsStore.FORM_ID, form),
            new replaceEquipmentActions.SetLocation(result.location),
            new replaceEquipmentActions.SetShopIds(result.shopIds),
            new replaceEquipmentActions.SetCommonAreaIds(result.commonAreaIds),
            new replaceWizardActions.UpdateMeterId({meterId: meterId, supplyType: result.equipment.supplyType})
          ];
        }),
        catchError(() => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<any>, private meterService: MeterService) {
  }

  mapToAddClosingReadingsViewModel(registers: MeterRegisterViewModel[]) {
    return registers.reduce((acc, curr) => {
      acc.push(this.getReading(curr.id, curr.name));
      return acc;
    }, []);
  }

  getReading = (regId, name, tou = null) => <AddClosingReadingViewModel>{
    registerId: regId,
    registerTouKey: this.getRegTouKey(regId, tou),
    name: name,
    readings: '',
    notes: '',
    date: new Date(),
    confirmed: false,
    file: null
  }

  getRegTouKey = (regId, tou) => tou === null || tou === undefined ? regId : `${regId}_${tou}`;
}
