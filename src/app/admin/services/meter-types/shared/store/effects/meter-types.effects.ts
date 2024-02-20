/// <reference path="../../../../../equipment/shared/store/reducers/index.ts" />
import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';

import * as meterTypeFormAction from '../actions/meter-types-form.actions';
import * as fromMeterType from '../reducers';
import * as fromMeterTypeForm from '../reducers/meter-types-form.store';

import {MeterTypeService} from '@services';
import {SetValueAction} from 'ngrx-forms';
import {MeterTypesViewModel} from '@models';

@Injectable()
export class MeterTypesEffects {

  // Get meter-types
  getMeterTypes: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(meterTypeFormAction.GET_METER_TYPES),
    withLatestFrom((action) => {
      return {
        payload: action
      }
    }),
    switchMap((action) => {

      return this.meterTypeService.get().pipe(
        map(r => {
          return new SetValueAction(fromMeterTypeForm.FORM_ID, r)
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Create/Update meter-types
  saveMeterTypes = createEffect(() =>  this.actions$.pipe(
    ofType(meterTypeFormAction.UPDATE_METER_TYPES),
    withLatestFrom(this.store$.select(fromMeterType.getFormState), (_, state) => {
      return {
        state: state
      }
    }),
    switchMap((action) => {
      if (!action.state.formState.isValid)
        return of({type: 'DUMMY'});

      let model: MeterTypesViewModel = action.state.formState.value;

      return this.meterTypeService.update(model).pipe(
        map(r => {
          return new meterTypeFormAction.RequestCompleted();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));

  constructor(
    private actions$: Actions,
    private router: Router,
    private store$: Store<fromMeterTypeForm.State>,
    private meterTypeService: MeterTypeService
  ) {
  }
}
