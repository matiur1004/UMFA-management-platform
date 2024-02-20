import {Injectable} from '@angular/core';
import {ReadingSource} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {EmptyValuePipe} from 'app/shared/pipes/empty-value.pipe';
import {SupplyTypeLetterPipe} from 'app/shared/pipes/supply-type-letter.pipe';
import {box, SetValueAction} from 'ngrx-forms';
import {of, Observable} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import * as buildingCommonData from '../../../../../shared/store/selectors/common-data.selectors';
import {EnterReadingRegisterViewModel, EnterReadingViewModel, ReadingViewModel} from '../../models';
import {BuildingBillingReadingsService} from '../../services/billing-readings.service';
import * as billingReadingsAction from '../actions/billing-readings.actions';
import * as enterReadingActions from '../actions/enter-reading-form.actions';
import * as fromBillingReading from '../reducers';
import * as enterReadingState from '../reducers/enter-reading-form.store';

const supplyTypeLetter = new SupplyTypeLetterPipe();
const emptyValue = new EmptyValuePipe();

@Injectable()
export class EnterReadingEffects {
  // Get all readings
  getFilterOptions: any = createEffect((): Observable<any> => this.actions$.pipe(
    ofType(
      enterReadingActions.REQUEST_READING_LIST,
      enterReadingActions.CHANGE_FILTER_AS_ALL_READINGS,
      enterReadingActions.CHANGE_FILTER_AS_HAS_NO_READINGS,
      enterReadingActions.CHANGE_FILTER_AS_OF_DATE,
      enterReadingActions.UPDATE_SEARCH_KEY,
      enterReadingActions.UPDATE_SEARCH_LOCATION
    ),
    debounceTime(300),
    distinctUntilChanged(),
    withLatestFrom(
      this.store$.select(buildingCommonData.getBuildingId),
      this.store$.select(buildingCommonData.getActiveBuildingPeriod),
      this.store$.select(fromBillingReading.getMeterIdToEnterReadings),
      this.store$.select(fromBillingReading.getEnterReadingFormShowFilter),
      this.store$.select(fromBillingReading.getEnterReadingFormShowFilterDate),
      this.store$.select(fromBillingReading.getLatestBuildingPeriodShortModel),
      this.store$.select(fromBillingReading.getEnterReadingSearchKey),
      this.store$.select(fromBillingReading.getEnterReadingSearchLocation),
      this.store$.select(buildingCommonData.getUnitsOfMeasurement),
      (_, buildingId, buildingPeriod, meterId, showFilter, showFilterDate, latestBuildingPeriod, searchKey, searchLocation, units) => {
        return {
          buildingId: buildingId,
          buildingPeriodId: buildingPeriod.id,
          meterId: meterId,
          showFilter: showFilter,
          showFilterDate: showFilterDate,
          latestBuildingPeriod: latestBuildingPeriod,
          searchKey: searchKey,
          searchLocation: searchLocation,
          units: units
        };
      }),
    switchMap((action: any) => {
      const actualDate = action.latestBuildingPeriod ? action.latestBuildingPeriod.endDate : new Date().toISOString();
      const units = action.units;
      return this.billingReadingsService.getEnterMeterReadings(
        action.buildingId, action.buildingPeriodId, action.meterId, action.showFilter, action.showFilterDate, action.searchKey, action.searchLocation).pipe(
        map((r) => {

          let readings = this.mapToEnterReadingViewModel(r.items);
          readings = readings.filter(r => r.registers.length);
          //set scale
          readings = readings.map(reading => {
            reading.registers = reading.registers.map(register => {
              units.forEach(unit => {
                unit.scales.forEach(r => {
                  if(r.id === register.registerScaleId) {
                    register.registerScaleRatio = r.scale;
                    register.registerScaleName = r.name
                  }
                })
              });
              return register;
            })
            return reading;
          })
          return [new enterReadingActions.RequestReadingListComplete(r),
            new SetValueAction(enterReadingState.FORM_ID, {
              date: actualDate,
              readings: readings,
            })];
        }),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    }),
    switchMap((actions: any) => {
      return actions;
    })
  ));
  sendReadings: any = createEffect(() => this.actions$.pipe(
    ofType(
      enterReadingActions.SEND_READING_LIST
    ),
    withLatestFrom(
      this.store$.select(buildingCommonData.getBuildingId),
      this.store$.select(fromBillingReading.getSelectedBuildingPeriodId),
      this.store$.select(fromBillingReading.getEnterReadingFormState),
      this.store$.select(fromBillingReading.getEnterReadingRegisterFiles),
      this.store$.select(fromBillingReading.getAbnormalityStatusAndUsage),
      (_,
       buildingId,
       buildingPeriodId,
       enterReadingState,
       files,
       usages) => {
        return {
          buildingId: buildingId,
          buildingPeriodId: buildingPeriodId,
          enterReadingState: enterReadingState,
          files: files,
          usages: usages
        };
      }),
    switchMap((action: any) => {
      if (!action.enterReadingState.isValid) {
        return of({type: 'DUMMY'});
      }

      const date = action.enterReadingState.value.date;
      const value = action.enterReadingState.value.readings;
      const files = action.files;
      const usages = action.usages;

      let model = new Array<ReadingViewModel>();

      value.forEach(meterReading => {
        const meterReadingFile = files[meterReading.meterId];
        const readings = meterReading.registers.filter(r => r.currentReadingValue != null || r.currentReadingValue != undefined).map(r => {
          const reading = <ReadingViewModel>{
            meterId: meterReading.meterId,
            date: date,
            readingSource: ReadingSource.ManualCapture,
            confirmed: r.confirmed,
            registerId: r.registerId,
            timeOfUse: r.timeOfUse,
            value: r.currentReadingValue,
            notes: r.notes,
            usage: usages[meterReading.meterId][r.registerId]['usage'],
            isRollover: r.isRollover,
            ratio: r.ratio,
            registerScaleId: r.registerScaleId
          };
          if (meterReadingFile) {
            reading.photo = meterReadingFile[r.registerTouKey];
          }

          return reading;
        });

        model = [...model, ...readings];
      });
      if (model.length) {
        return this.billingReadingsService.addBulkReading(action.buildingId, {readings: model}).pipe(
          mergeMap((r) => {
            return [
              new enterReadingActions.SendReadingListComplete(r),
              new enterReadingActions.MarkAsSubmitted(),
              new SetValueAction(enterReadingState.FORM_ID, enterReadingState.INIT_DEFAULT_STATE),
              new billingReadingsAction.RequestBuildingBillingReadingsList()
            ];
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
      return of(new enterReadingActions.MarkAsSubmitted());
    })
  ));
  getMeterReadingsForDate = createEffect(() => this.actions$.pipe(
    ofType(enterReadingActions.REQUEST_READINGS_FOR_DATE),
    withLatestFrom(
      this.store$.select(buildingCommonData.getBuildingId),
      this.store$.select(buildingCommonData.getSelectedVersionId),
      (action: enterReadingActions.RequestReadingsForDate, buildingId, versionId) => {
        return {
          buildingId,
          versionId,
          year: action.payload.year,
          month: action.payload.month,
          day: action.payload.day,
          readingSource: action.payload.readingSource
        };
      }
    ),
    switchMap(({buildingId, versionId, year, month, day, readingSource}) => {
      return this.billingReadingsService.getMeterReadingsForDate(buildingId, versionId, year, month, day, readingSource).pipe(
        map((readings) => {
          return new enterReadingActions.RequestReadingsForDateComplete({readings});
        })
      )
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromBillingReading.State>,
    private billingReadingsService: BuildingBillingReadingsService
  ) {
  }

  mapToEnterReadingViewModel(readings: any[]) {
    return readings.map(meterReading => {
      const meterDetail = meterReading.meterDetails;

      const result = <EnterReadingViewModel>{
        meterId: meterDetail.meterId,
        serialNumber: meterDetail.serialNumber,
        supplyType: meterDetail.supplyType,
        meterName: emptyValue.transform(meterDetail.serialNumber).slice(-4) + '-' + supplyTypeLetter.transform(meterDetail.supplyType)
      };
      result.registers = [];

      const getRegTouKey = (regId, tou) => tou === null || tou === undefined ? regId : `${regId}_${tou}`;
      meterDetail.registers.filter(r => !r.isRegisterVirtual).forEach(reg => {
        const reading = meterReading.registerReadings.find(r => r.registerId === reg.id);
        const register = <EnterReadingRegisterViewModel>{
          registerTouKey: getRegTouKey(reg.id, null),
          registerId: reg.id,
          timeOfUse: reg.timeOfUse,
          name: reg.unit,
          previousReadingValue: reading ? reading.previousReadingValue : 0,
          averageUsage: reading ? Math.round(reading.averageUsage * 100) / 100 : 0,
          estimatedReadingValue: reading ? Math.round(reading.estimatedReadingValue * 100) / 100 : 0,
          currentReadingValue: null,
          usage: 0,
          confirmed: false,
          notes: box({
            currentReadingNotes: reading.currentReadingNotes,
            currentReadingCreatedByUserName: reading.currentReadingCreatedByUserName
          }),
          registerType: reg.registerType,
          lastReadingValue: reading?.currentReadingValue || reading?.previousReadingValue || 0,
          dialCount: reg.dialCount,
          isRollover: reading?.isRollover || reg.isRollover || null,
          ratio: reg.ratio,
          registerScaleId: reg.registerScaleId
        };
        result.registers.push(register);
      });

      return result;
    });
  }
}
