import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import {SetValueAction} from 'ngrx-forms';
import {MeterService} from '../../meter.service';
import {SupplyToViewModel} from '@models';

import * as locationStepActions from '../actions/location-step.actions';
import * as locationFormActions from '../actions/location-form.actions';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import * as wizardActions from '../actions/wizard.actions';
import * as fromLocationStepStore from '../reducers/location-step.store';
import * as fromEquipment from '../reducers';
import {LocationService} from '../../location.service';

@Injectable()
export class LocationStepEffects {

  // Get list of locations
  getLocations = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.GET_LOCATIONS_REQUEST, locationFormActions.SEND_LOCATION_REQUEST_COMPLETE),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          buildingId: buildingId,
          versionId: <{ payload: { versionId: string } }>action.payload ? action.payload.versionId : versionId
        }
      }),
    switchMap(({buildingId, versionId}) => {

      return this.equipmentService.getLocations(buildingId, versionId).pipe(
        map(items => {
          return new locationStepActions.GetLocationsRequestComplete(items);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getSupplies = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.GET_SUPPLIES_REQUEST),
    withLatestFrom(this.store$.select(commonData.getBuildingId), this.store$.select(fromEquipment.getEquipmentStepFormState), (_, buildingId, equipmentStepFormState) => {
      return {
        buildingId: buildingId,
        equipmentStepFormState: equipmentStepFormState
      }
    }),
    switchMap(({buildingId, equipmentStepFormState}) => {
      const supplyType = equipmentStepFormState.value.supplyType;

      if (supplyType == null)
        return [new locationStepActions.GetSuppliesRequestComplete([])];

      return this.equipmentService.getSupplies(buildingId, supplyType).pipe(
        map(items => {
          let suppliesTo = items.map(s => {
            let supplyTo = new SupplyToViewModel();
            supplyTo.id = s.id;
            supplyTo.name = s.name;
            supplyTo.supplyTypes = s.supplyTypes.filter(t => t.supplyType === supplyType);

            return supplyTo;
          });

          return new locationStepActions.GetSuppliesRequestComplete(suppliesTo);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getTechnicians = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.GET_TECHNICIANS_REQUEST),
    withLatestFrom(this.store$.select(commonData.getBuildingId), (_, buildingId) => {
      return {
        buildingId: buildingId
      }
    }),
    switchMap(({buildingId}) => {

      return this.equipmentService.getUsers(buildingId).pipe(
        map(r => {
          let technicians = r.items.filter(i => i.isApproved);
          return new locationStepActions.GetTechniciansRequestComplete(technicians);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Change selected locations
  selectedLocation = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.LOCATION_CHANGED),
    withLatestFrom(this.store$.select(fromEquipment.getLocationStepLocations), (action: locationStepActions.LocationChanged, locations) => {
      return {
        locationId: action.payload,
        locations: locations
      }
    }),
    switchMap(({locationId, locations}) => {

      let formState: any;
      const location = locationId == null ? locations[0] : locations.find(l => l.id === locationId);

      if (location) {
        formState = Object.assign({}, {
          id: location.id,
          location: location.name
        });
      } else {
        formState = fromLocationStepStore.INIT_DEFAULT_STATE;
      }

      return of(new SetValueAction(fromLocationStepStore.FORM_ID, formState));
    })
  ));
  // Set location for second step
  resetWizard = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.SET_LOCATION_DATA),
    withLatestFrom(this.store$.select(fromEquipment.getLocationEquipmentDetail),
      this.store$.select(fromEquipment.getLocationStepFormState),
      (_, currectLocation, formState) => {
        return {
          currectLocation: currectLocation,
          formState: formState
        }
      }),
    switchMap(({currectLocation, formState}) => {

      let updatedFormState = {
        ...formState.value,
        id: currectLocation.id,
        name: currectLocation.name
      };

      return of(new SetValueAction(fromLocationStepStore.FORM_ID, updatedFormState));
    })
  ));
  // Set default location for second step
  resetWizardForEquipment = createEffect(() => this.actions$.pipe(
    ofType(locationStepActions.SET_LOCATION_DATA_FOR_EQUIPMENT),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromEquipment.getLocationStepFormState),
      this.store$.select(commonData.getSelectedVersionId),
      (_, buildingId, formState, versionId) => {
        return {
          buildingId: buildingId,
          formState: formState,
          versionId: versionId
        }
      }),
    switchMap(({buildingId, formState, versionId}) => {

      return this.locationService.getDefaultLocation(buildingId, versionId).pipe(
        mergeMap(r => {
          let updatedFormState = {
            ...formState.value,
            id: r.id,
            name: r.name
          };
          return [
            new SetValueAction(fromLocationStepStore.FORM_ID, updatedFormState),
            new wizardActions.ToggleWizard()
          ]
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(private actions$: Actions, private store$: Store<fromEquipment.State>, private equipmentService: MeterService, private locationService: LocationService) {
  }

}
