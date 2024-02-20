import {Injectable} from '@angular/core';
import {Action, Store} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';

import * as fromServices from '../reducers';
import * as servicesAction from '../actions/services.actions';
import * as serviceFormAction from '../actions/service-form.actions';
import * as fromServiceForm from '../reducers/service-form.store';
import {ServiceManagerService} from '../../service-manager.service';
import {ResetAction, SetValueAction} from 'ngrx-forms';
import {InputEx} from '@shared-helpers';
import {MeterTypeService} from '@services';
import {MeterTypesViewModel} from '@models';

@Injectable()
export class ServicesEffects {

  // Get services
  getServiceRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(servicesAction.GET_SERVICES_REQUEST),
    withLatestFrom(this.store$.select(fromServices.getServicesState), (action: any) => {
      return {
        payload: action.payload
      }
    }),
    switchMap((action: any) => {
        return this.serviceManger.getServices().pipe(
          map(r => new servicesAction.GetServicesRequestComplete(r)),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  // Get all meter types
  getMeterTypes = createEffect(() => this.actions$.pipe(
    ofType(
      serviceFormAction.CREATE_SERVICE,
      serviceFormAction.EDIT_SERVICE
    ),
    withLatestFrom((_, service) => {
      return {
        service: service
      }
    }),
    switchMap((action) => {
      return this.meterTypeService.get().pipe(
        map(r => {
          return new serviceFormAction.GetMeterTypesComplete(r.meterTypes);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  // Start create service
  createService: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(serviceFormAction.CREATE_SERVICE),
    withLatestFrom((_, service) => {
      return {
        service: service
      }
    }),
    switchMap((_) => {

      let empty = new MeterTypesViewModel();
      empty.meterTypes = [];
      let createService = InputEx.getCreateServiceDefaultModel(empty);

      return of(new SetValueAction(fromServiceForm.FORM_ID, createService));
    })
  ));
  // Start edit service
  editService: Observable<Action> =createEffect(() =>  this.actions$.pipe(
    ofType(serviceFormAction.EDIT_SERVICE),
    withLatestFrom(this.store$.select(fromServices.getServices), (action: any, services) => {
      return {
        serviceId: action.payload,
        services: services
      }
    }),
    switchMap((action) => {

      return this.serviceManger.getServiceById(action.serviceId).pipe(
        map(r => {

          return new SetValueAction(fromServiceForm.FORM_ID, r)
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ))
  // Create/Update service
  saveService = createEffect(() => this.actions$.pipe(
    ofType(serviceFormAction.SEND_SERVICE_REQUEST),
    withLatestFrom(this.store$.select(fromServices.getFormState), (_, state) => {
      return {
        state: state
      }
    }),
    switchMap((action) => {
      if (!action.state.formState.isValid)
        return of({type: 'DUMMY'});

      let model = action.state.formState.value;
      if (action.state.isNew) {
        return this.serviceManger.create(model, action.state.parentId).pipe(
          map(r => {
            return new servicesAction.AddService(r);
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      } else {
        return this.serviceManger.updateService(model, model.id).pipe(
          map(r => {
            return new servicesAction.UpdateService(r);
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    }),
    switchMap(action => { // Genereate 2 actions for FormState and ServicesState

      if (action.type !== 'DUMMY')
        return [
          action,
          new serviceFormAction.SendServiceRequestComplete()
        ];
      else
        return [action];
    })
  ));
  changeServiceStatus = createEffect(() => this.actions$.pipe(
    ofType(servicesAction.UPDATE_SERVICE_STATUS_REQUEST),
    withLatestFrom(this.store$.select(fromServices.getServicesState), (action: any, state) => {
      return {
        payload: action.payload,
        services: state.services
      }
    }),
    switchMap((params: any) => {

      const {payload, services} = params;
      return this.serviceManger.updateServiceStatus(payload.serviceId, {
        newValue: payload.value
      }).pipe(
        map(r => {
          return new servicesAction.UpdateServiceStatusRequestComplete(payload);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    }),
  ));
  resetForm: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(serviceFormAction.SEND_SERVICE_REQUEST_COMPLETE),
    switchMap(() => [
      new SetValueAction(fromServiceForm.FORM_ID, fromServiceForm.INIT_DEFAULT_STATE),
      new ResetAction(fromServiceForm.FORM_ID)
    ])
  ));

  deleteService = createEffect(() => this.actions$.pipe(
    ofType(servicesAction.DELETE_SERVICE),
    withLatestFrom(this.store$.select(fromServices.getServicesState), (action: any) => {
      return {
        payload: action.payload
      }
    }),
    switchMap((action: any) => {
        return this.serviceManger.deleteService(action.payload).pipe(
          map(r => new servicesAction.GetServicesRequestComplete(r)),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ))

  constructor(
    private actions$: Actions,
    private store$: Store<fromServices.State>,
    private serviceManger: ServiceManagerService,
    private meterTypeService: MeterTypeService
  ) {
  }

}
