import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';


import * as locationEquipmentAction from '../actions/location-equipment.action';
import * as commonDataAction from '../../../../shared/store/actions/common-data.action';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';
import * as fromLocationEquipment from '../reducers';
import {LocationEquipmentService} from '../../location-equipment.service';
import {LocationService} from '../../location.service';

@Injectable()
export class LocationEquipmentEffects {

  // //Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.UPDATE_SEARCH_KEY),
    withLatestFrom((action: any) => {
      return action.payload;
    }),
    debounceTime(300),
    map((action) => {
      return new locationEquipmentAction.UpdateSearchKeyComplete(action);
    })
  ));
  //Get location
  getLocation: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.GET_LOCATION),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          locationId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        }
      }),
    switchMap((action) => {
      return this.locationService.getLocation(action.buildingId, action.locationId, action.versionId).pipe(
        map(r => {
          let nodesAndUnits = this.fetchNodesAndUnits(r);
          return new locationEquipmentAction.SetLocation({location: r, ...nodesAndUnits});
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Reload location data
  reloadLocationData: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.RELOAD_LOCATION_DATA),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromLocationEquipment.getLocationEquipmentDetail),
      this.store$.select(commonData.getSelectedVersionId),

      (action: any, buildingId, locationDetail, versionId) => {
        return {
          locationId: locationDetail.id,
          buildingId: buildingId,
          versionId: <{ payload: { versionId: string } }>action.payload ? action.payload.versionId : versionId
        }
      }),
    switchMap(({buildingId, locationId, versionId}) => {
      return this.locationService.getLocation(buildingId, locationId, versionId).pipe(
        map(r => {
          let nodesAndUnits = this.fetchNodesAndUnits(r);
          return new locationEquipmentAction.SetLocation({location: r, ...nodesAndUnits});
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  //Delete equipment
  deleteEquipment: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.DELETE_EQUIPMENT),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromLocationEquipment.getLocationEquipmentDetail),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, location, versionId) => {
        return {
          equipmentId: action.payload,
          buildingId: buildingId,
          location: location,
          versionId: versionId
        }
      }),
    switchMap((action) => {
      return this.locationEquipmentService.deleteEquipment(action.buildingId, action.location.id,
        action.equipmentId, action.versionId).pipe(
        map(r => {
          return new locationEquipmentAction.ReloadLocationData();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  //Clone equipment
  cloneEquipment: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.CLONE_EQUIPMENT_REQUEST),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, versionId) => {
        return {
          equipmentId: action.payload,
          buildingId: buildingId,
          versionId: versionId
        }
      }),
    switchMap(({equipmentId, buildingId, versionId}) => {

      return this.locationEquipmentService.cloneEquipment(buildingId, equipmentId, versionId).pipe(
        map(r => {
          return new locationEquipmentAction.ReloadLocationData();
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );

    })
  ));
  // Update equipments
  updateEquipmentsRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(locationEquipmentAction.UPDATE_EQUIPMENTS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromLocationEquipment.getLocationEquipmentDetail),
      this.store$.select(commonData.getSelectedVersionId),
      (action: any, buildingId, location, versionId) => {
        return {
          indexes: action.payload,
          buildingId: buildingId,
          location: location,
          versionId: versionId
        }
      }),
    switchMap((action) => {
      let equipments = action.location.meters.map(i => Object.assign({}, i));

      let sequenceNumber = equipments[action.indexes.previousIndex].sequenceNumber;
      equipments[action.indexes.previousIndex].sequenceNumber = equipments[action.indexes.currentIndex].sequenceNumber;
      equipments[action.indexes.currentIndex].sequenceNumber = sequenceNumber;

      return this.locationEquipmentService.updateEquipments(action.buildingId, action.location.id, action.versionId, equipments).pipe(
        mergeMap(r => [new commonDataAction.HistoryChange(r.id), new locationEquipmentAction.ReloadLocationData()]),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromLocationEquipment.State>,
    private locationEquipmentService: LocationEquipmentService,
    private locationService: LocationService
  ) {
  }

  fetchNodesAndUnits(location) {
    let result = {
      nodes: {},
      units: {}
    }

    location.meters.forEach(m => {
      result.nodes[m.nodeId] = {
        id: m.nodeId,
        name: m.nodeName
      };

      m.unitIds.forEach(id => {
        let unit = location.units.find(u => u.id === id);
        if (unit) {
          result.units[id] = {
            id: id,
            name: unit.name
          }
        }
      });
    });

    return result;
  }
}
