import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {ResetAction, SetValueAction} from 'ngrx-forms';

import * as locationAction from '../actions/location.actions';
import * as locationFormAction from '../actions/location-form.actions';
import * as commonDataActions from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import * as fromLocation from '../reducers';
import * as fromLocationForm from '../reducers/location-form.store';

import {LocationService} from '../../location.service';
import {LocationViewModel, VersionActionType, VersionViewModel} from '@models';
import {ApplyResultService} from 'app/popups/apply-result-popup/apply-result.service';
import {convertNgbDateToDate} from '@app/shared/helper/date-extension';

@Injectable()
export class LocationEffects {

  // Get locations
  getLocationRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      locationAction.REQUEST_LOCATION_LIST
    ),
    withLatestFrom(
      this.store$.select(fromLocation.getLocationState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, locationState, buildingId, versionId) => {
        return {
          payload: action.payload,
          state: locationState,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap((action) => {

        return this.locationService.getAllLocationsByBuilding(
          action.buildingId,
          action.versionId,
          action.state.searchKey,
          action.state.order).pipe(
          map(r => new locationAction.RequestLocationListComplete(r)),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  // Update locations
  updateLocationsRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationAction.UPDATE_LOCATIONS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromLocation.getLocations),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, locations, versionId) => {
        return {
          indexes: action.payload,
          buildingId: buildingId,
          locations: locations,
          versionId: versionId
        };
      }),
    switchMap((action) => {
        const locations = action.locations.map(i => Object.assign({}, i));

        const sequenceNumber = locations[action.indexes.previousIndex].sequenceNumber;
        locations[action.indexes.previousIndex].sequenceNumber = locations[action.indexes.currentIndex].sequenceNumber;
        locations[action.indexes.currentIndex].sequenceNumber = sequenceNumber;

        return this.locationService.updateLocations(action.buildingId, locations, action.versionId).pipe(
          map(r => new commonDataActions.GetHistoryWithVersionId(r.id)),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  // Start edit location
  editLocation: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationFormAction.EDIT_LOCATION),
    withLatestFrom(
      this.store$.select(fromLocation.getLocations),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, locations, buildingId, versionId) => {
        return {
          locationId: action.payload.id,
          locations: locations,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap((action) => {

      return this.locationService.getLocation(action.buildingId, action.locationId, action.versionId).pipe(
        map(r => {

          const editLocation = Object.assign({}, r);

          return new SetValueAction(fromLocationForm.FORM_ID, {...fromLocationForm.INIT_DEFAULT_STATE, ...editLocation});
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  // Create/Update location
  saveLocation = createEffect(() => this.actions$.pipe(
    ofType(locationFormAction.SEND_LOCATION_REQUEST),
    withLatestFrom(
      this.store$.select(fromLocation.getLocationFormState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedHistoryLog),
      this.store$.select(commonData.getIsComplete), (_, state, buildingId, selectedVersion, isDocumentComplete) => {
        return {
          state: state,
          buildingId: buildingId,
          selectedVersion: selectedVersion,
          isDocumentComplete: isDocumentComplete
        };
      }),
    switchMap(({state, buildingId, selectedVersion, isDocumentComplete}) => {

      if (!state.formState.isValid) {
        return of({status: false, shouldReloadData: false, actions: [{type: 'DUMMY'}]});
      }

      const location = state.formState.value;
      let actionType = location.actionType;

      if (!isDocumentComplete && actionType != VersionActionType.Init) {
        actionType = VersionActionType.Init;
      }

      let date = null;
      if (actionType == VersionActionType.Insert) {
        const dateObject = location.date.value || location.date;
        date = convertNgbDateToDate(dateObject);
      } else {
        date = selectedVersion.startDate;
      }

      const model = Object.assign(new LocationViewModel(), location);
      const version = new VersionViewModel<LocationViewModel>(model, null, actionType,
        date, selectedVersion.id);

      if (state.isNew) {
        return this.locationService.createLocation(buildingId, version).pipe(
          map(r => {
            return {status: true, shouldReloadData: selectedVersion.id == r.current.id, payload: r};
          }),
          catchError(r => {
            return of({status: false, shouldReloadData: false, actions: null});
          })
        );
      } else {
        return this.locationService.updateLocation(buildingId, location.id, version).pipe(
          map(r => {
            return {status: true, shouldReloadData: selectedVersion.id == r.current.id, payload: r};
          }),
          catchError(r => {
            return of({status: false, shouldReloadData: false, payload: null});
          })
        );
      }
    }),
    switchMap((result: any) => {

      if (result.status) {
        const versionDate = result.payload.current.versionDate;
        this.versionUpdateService.showVersionUpdateResults(result.payload.next);
        const actions: any[] = [
          new commonDataActions.UpdateUrlVersionAction(versionDate),
          new locationFormAction.SendLocationRequestComplete({versionId: result.payload.current.id}),
          new commonDataActions.GetHistoryWithVersionId(result.payload.current.id)
        ];

        if (result.shouldReloadData) {
          actions.push(new locationAction.RequestLocationList());
        }

        return actions;
      } else {
        return of({type: 'DUMMY'});
      }
    })
  ));
  // Delete location
  deleteLocation: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationAction.DELETE_LOCATION),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          locationId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        };
      }),
    switchMap((action) => {
      return this.locationService.deleteLocation(action.buildingId, action.locationId, action.versionId).pipe(
        map(r => {
          return new commonDataActions.GetHistoryWithVersionId(r.id);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationAction.UPDATE_SEARCH_KEY),
    withLatestFrom((action: any) => {
      return {
        searchKey: action.payload
      };
    }),
    debounceTime(700),
    distinctUntilChanged(),
    map((action) => {
      return new locationAction.RequestLocationList();
    })
  ));
  // Clone location
  cloneLocation: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationAction.CLONE_LOCATION),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, selectedVersionId) => {
        return {
          location: action.payload,
          buildingId: buildingId,
          selectedVersionId: selectedVersionId
        };
      }),
    switchMap((action) => {

      return this.locationService.cloneLocation(action.buildingId, action.location.id, action.selectedVersionId).pipe(
        map(r => {
          return new commonDataActions.GetHistoryWithVersionId(r.id);
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  resetForm: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationFormAction.SEND_LOCATION_REQUEST_COMPLETE),
    switchMap(() => [
      new SetValueAction(fromLocationForm.FORM_ID, fromLocationForm.INIT_DEFAULT_STATE),
      new ResetAction(fromLocationForm.FORM_ID)
    ])
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromLocation.State>,
    private locationService: LocationService,
    private versionUpdateService: ApplyResultService
  ) {
  }
}
