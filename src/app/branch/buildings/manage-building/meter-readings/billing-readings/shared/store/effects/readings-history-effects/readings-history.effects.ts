import {Injectable} from '@angular/core';
import {convertAnyToParams} from '@app/shared/helper/http-helper';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom} from 'rxjs/operators';
import * as buildingCommonData from '../../../../../../shared/store/selectors/common-data.selectors';
import * as commonData from '../../../../../../shared/store/selectors/common-data.selectors';
import {
  GroupedReadingsByBuildingPeriodViewModel,
  ReadingsHistoryViewModel
} from '../../../models/readings-history.model';
import {ReadingsHistoryService} from '../../../services/readings-history.service';
import * as readingsHistoryAction from '../../actions/readings-history-actions/readings-history.action';
import * as readingHistorySelector from '../../selectors/readings-history.selectors';
import * as readingsHistoryState from '../../state/readings-history.state';
import * as billingReadingsAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
import {BillingReadingChartUsagesEnum} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';


@Injectable()
export class ReadingsHistoryEffects {

  // get readings history
  getReadingsHistoryList = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.GET_READINGS_HISTORY_LIST),
    withLatestFrom(
      this.store$.pipe(select(buildingCommonData.getBuildingId)),
      this.store$.pipe(select(readingHistorySelector.getFilterData)),
      this.store$.select(buildingCommonData.getUnitsOfMeasurement),
      (action: any, buildingId, filterData, units) => (
        {
          payload: <{ skip: number, take: number, startDate: Date, endDate: Date }>action.payload,
          buildingId: buildingId,
          filterData: filterData,
          units: units
        })),
    switchMap(({payload, buildingId, filterData, units}) => {
      const startDate = payload.startDate ? payload.startDate : filterData.startDate;
      const endDate = payload.startDate ? payload.endDate : filterData.endDate;

      const filterModel = {
        requestParameters: {
          ...filterData,
          startDate: typeof (startDate) === 'string' ? startDate : startDate.toISOString(),
          endDate: typeof (endDate) === 'string' ? endDate : endDate.toISOString()
        },

        skip: payload.skip === -1 ? filterData.skip : payload.skip,
        take: payload.take === -1 ? filterData.take : payload.take
      };

      const convertObjToHttpParams = convertAnyToParams(filterModel);

      return this.readingsHistoryService.getReadingsHistory(buildingId, convertObjToHttpParams).pipe(
        mergeMap((result) => {
          console.log('reading history', result);
          result.items = result.items.map(item => {
            units.forEach(unit => {
              unit.scales.forEach(r => {
                if(r.id === item.registerScaleId) {
                  item.registerScaleRatio = r.scale;
                  item.registerScaleName = r.name
                }
              })
            });
            return item;
          });
          const [reading] = result.items;

          return [
            new billingReadingsAction.GetMeterReadingsStatsChart(
              {
                meterId: reading.meterId,
                registerId: reading.registerId,
                chartView: BillingReadingChartUsagesEnum.CurrentPeriod
              }),
            
            new readingsHistoryAction.GetReadingsHistoryListComplete(this.getGroupedReadings(result.items)),
            new readingsHistoryAction.GetReadingsHistoryAmount(result.total)];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getPinnedReadings = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.GET_PINNED_READINGS_HISTORY),
    withLatestFrom(this.store$.pipe(select(buildingCommonData.getBuildingId)),
      this.store$.pipe(select(readingHistorySelector.getFilterData)),
      (_, buildingId, filterData) => ({buildingId: buildingId, filterData: filterData})),
    switchMap(({buildingId, filterData}) => {
      return this.readingsHistoryService.getPinnedReadingsHistory(buildingId, {
        meterId: filterData.meterId,
        registerId: filterData.registerId
      }).pipe(
        map(result => new readingsHistoryAction.GetPinnedReadingsHistoryComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  // get pinned readings history
  // get meters
  getMeters = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.GET_METERS_REQUEST),
    withLatestFrom(this.store$.pipe(select(buildingCommonData.getBuildingId)),
      (_, buildingId) => ({buildingId: buildingId})),
    switchMap(({buildingId}) => {
      return this.readingsHistoryService.getMeters(buildingId).pipe(
        map(result => new readingsHistoryAction.GetMetersRequestComplete(result)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // update meter, registerTou, startDate, endDate
  updateFilterProperties = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.UPDATE_METER,
      readingsHistoryAction.UPDATE_REGISTER_TOU,
      readingsHistoryAction.UPDATE_START_DATE,
      readingsHistoryAction.UPDATE_END_DATE),
    map(result => new readingsHistoryAction.GetReadingsHistoryList())
  ));
  // toggle pin
  togglePin = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.TOGGLE_PIN_REQUEST),
    withLatestFrom(this.store$.pipe(select(buildingCommonData.getBuildingId)),
      (action: any, buildingId) => ({action: action, buildingId: buildingId})),
    switchMap(({action, buildingId}) => {
      return this.readingsHistoryService.togglePinReading(buildingId, action.payload).pipe(
        switchMap(result => {
          const newPinReadingAction = new readingsHistoryAction.TogglePinRequestComplete(action.payload);
          const readingHistoryAction = new readingsHistoryAction.GetPinnedReadingsHistory();

          return [newPinReadingAction, readingHistoryAction];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // set billing
  setBilling = createEffect(() => this.actions$.pipe(
    ofType(readingsHistoryAction.SET_BILLING_REQUEST),
    withLatestFrom(this.store$.pipe(select(buildingCommonData.getBuildingId)),
      (action: readingsHistoryAction.SetBillingRequest, buildingId) => ({action: action, buildingId: buildingId})),
    switchMap(({action, buildingId}) => {
      return this.readingsHistoryService.setBillingReading(action.payload).pipe(
        switchMap(() => {
          const {startDate, endDate} = action.payload;
          return [
            new readingsHistoryAction.GetReadingsHistoryList({startDate, endDate, skip: -1, take: -1})
          ];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  updateReadingDetails = createEffect(() => this.actions$.pipe(
    ofType(
      readingsHistoryAction.UPDATE_READING_DETAILS,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (action: readingsHistoryAction.UpdateReadingDetails, buildingId: string) => {
        return {
          buildingId: buildingId,
          data: action.payload
        };
      }),
    switchMap(({buildingId, data}) => {
      const {id} = data;

      return this.readingsHistoryService.updateReadingDetails(buildingId, id, data).pipe(
        map((r: any) => new readingsHistoryAction.GetReadingsHistoryList()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  downloadReadingDetailsFile = createEffect(() => this.actions$.pipe(
    ofType(
      readingsHistoryAction.DOWNLOAD_READING_DETAILS_FILE,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (action: readingsHistoryAction.DownloadReadingDetailsFile, buildingId: string) => {
        return {
          buildingId: buildingId,
          data: action.payload
        };
      }),
    switchMap(({buildingId, data}) => {
      this.readingsHistoryService.downloadFile(buildingId, data);

      return of({type: 'DUMMY'});
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<readingsHistoryState.State>,
    private readingsHistoryService: ReadingsHistoryService
  ) {
  }

  getGroupedReadings(readings: ReadingsHistoryViewModel[]) {
    const groupedReadingsDictionary = {};
    const groupedReadings = new Array<GroupedReadingsByBuildingPeriodViewModel>();
    readings.forEach(item => {
      if (groupedReadingsDictionary[item.buildingPeriodId]) {
        groupedReadingsDictionary[item.buildingPeriodId].push(item);
      } else {
        groupedReadingsDictionary[item.buildingPeriodId] = [item];
      }
    });

    for (const key of Object.keys(groupedReadingsDictionary)) {
      groupedReadings.push(<GroupedReadingsByBuildingPeriodViewModel>{
        buildingPeriodId: key,
        buildingPeriodName: groupedReadingsDictionary[key][0].buildingPeriodName,
        buildingPeriodStartDate: groupedReadingsDictionary[key][0].buildingPeriodStartDate,
        buildingPeriodEndDate: groupedReadingsDictionary[key][0].buildingPeriodEndDate,
        readings: groupedReadingsDictionary[key]
      });
    }

    return groupedReadings;
  }
}
