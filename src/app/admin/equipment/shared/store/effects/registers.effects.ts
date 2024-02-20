import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {EquipmentService} from '@services';
import {SetValueAction} from 'ngrx-forms';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import * as registerFormActions from '../actions/registers-form.actions';
import * as registerState from '../reducers';
import * as registerFormState from '../reducers/registers-form.store';

@Injectable()
export class RegisterEffects {

  createRegisters: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(registerFormActions.REGISTER_CREATE),
    withLatestFrom(this.store$.select(registerState.getFormState),
      (action: any, state) => {
        return {
          ...state,
          payload: action.payload
        };
      }),
    switchMap(params => {
      const model = params.formState.value;
      const modal = params.payload.modal;

      if (Object.keys(params.formState.errors).length > 0) {
        return of({type: 'DUMMY'});
      }

      return this.equipmentService.createRegister(model).pipe(
        map(r => {
          modal.close();
          return new SetValueAction(params.formState.id, model) as any;
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  updateRegister: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(registerFormActions.REGISTER_UPDATE),
    withLatestFrom(this.store$.select(registerState.getFormState),
      (action: any, state) => {
        return {
          ...state,
          payload: action.payload
        }
      }),
    switchMap(params => {
      const model = params.formState.value;
      const modal = params.payload.modal;

      if (Object.keys(params.formState.errors).length > 0) {
        return of({type: 'DUMMY'});
      }

      return this.equipmentService.updateRegister(model.id, model).pipe(
        map(r => {
          modal.close();
          return new SetValueAction(params.formState.id, model) as any;
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions,
              private store$: Store<registerFormState.State>,
              private equipmentService: EquipmentService) {
  }
}
