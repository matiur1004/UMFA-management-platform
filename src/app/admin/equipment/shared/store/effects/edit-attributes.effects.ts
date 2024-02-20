import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {Action, select, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import * as editAttributesState from '../reducers/edit-attributes.store';
import * as editAttributesActions from '../actions/edit-attributes.actions';
import * as attributesState from '../reducers';
import {EquipmentService} from '@services';

@Injectable()
export class EditAttributesEffects {
  creatAttributes: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(editAttributesActions.ATTRIBUTES_CREATE),
    withLatestFrom(this.store$.pipe(select(attributesState.getAttributeForm)),
      (action: any, state) => {
        return {
          ...state,
          payload: action.payload
        };
      }),
    switchMap(params => {
        let modal = params.payload.modal;
        return this.equipmentService.createEquipmentAttribute(params.value).pipe(
          tap(() => {
            modal.close();
          }),
          map(() => {
            return new editAttributesActions.RequestCompleted();
          }),
          catchError(() => {
              return of({type: 'DUMMY'});
            }
          ));
      }
    )));

    editAttributes: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(editAttributesActions.ATTRIBUTES_EDIT),
    withLatestFrom(this.store$.pipe(select(attributesState.getAttributeForm)),
      (action: any, state) => {
        return {
          ...state,
          payload: action.payload
        };
      }),
    switchMap(params => {
      let modal = params.payload.modal;
      return this.equipmentService.updateEquipmentAttribute(params.value.id, params.value).pipe(
        tap(() => {
          modal.close();
        }),
        map(() => {
          return new editAttributesActions.RequestCompleted();
        }),
        catchError(() => {
            return of({type: 'DUMMY'});
          }
        ));
    })));

  getUnits: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(editAttributesActions.ATTRIBUTES_GET_OPTIONS),
    switchMap(() => {
        return this.equipmentService.getEquipmentUnits().pipe(
          map(response => {
            return new editAttributesActions.AttributesSetUnits({value: response});
          }),
          catchError(() => {
              return of({type: 'DUMMY'});
            }
          ));
      }
    )));

  constructor(private actions$: Actions,
              private equipmentService: EquipmentService,
              private store$: Store<editAttributesState.State>) {

  }
}
