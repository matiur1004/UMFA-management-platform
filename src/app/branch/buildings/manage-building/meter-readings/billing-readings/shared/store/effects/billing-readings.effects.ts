import {ReadingsHistoryService} from './../../services/readings-history.service';
import {Injectable} from '@angular/core';
import {
  BillingReadingChartUsagesEnum,
  BillingReadingsFilterDetailViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {RegisterType} from '@models';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Action, select, Store} from '@ngrx/store';
import {EquipmentService, NotificationService} from '@services';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {BuildingPeriodViewModel} from '../../../../../shared/models/building-period.model';
import {BuildingPeriodsService} from '../../../../../shared/services/building-periods.service';
import * as commonData from '../../../../../shared/store/selectors/common-data.selectors';
import * as formBuildingPeriodsAction
  from '../../../../building-periods/shared/store/actions/building-period-form.actions';
import {BuildingBillingReadingsService} from '../../services/billing-readings.service';
import * as billingReadingAction from '../actions/billing-readings.actions';
import * as fromBillingReading from '../reducers';
import {PagingOptions} from '@app/shared/models/paging-options.model';


@Injectable()
export class BillingReadingsEffects {

  // Get building periods
  getBuildingPeriods: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.REQUEST_BUILDING_PERIODS_LIST,
      formBuildingPeriodsAction.EDIT_BUILDING_PERIOD_COMPLETED,
    ),
    withLatestFrom(
      this.store$.select(fromBillingReading.getBillingReadingsState),
      this.store$.select(commonData.getBuildingId),
      (action: any, billingReadingState, buildingId) => {
        return {
          payload: action.payload,
          state: billingReadingState,
          buildingId: buildingId
        };
      }),
    switchMap((action: any) => {
      return this.buildingPeriodsService.getAllShort(action.buildingId).pipe(
        map((r: BuildingPeriodViewModel[]) => new billingReadingAction.RequestBuildingPeriodsListComplete(r.sort((a, b) => {
          const endDate1 = new Date(a.endDate);
          const endDate2 = new Date(b.endDate);

          if (endDate1 > endDate2) {
            return -1;
          }
          if (endDate1 < endDate2) {
            return 1;
          }
          return 0;
        }))),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  getFilterOptions: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.UPDATE_BUILDING_PERIOD,
      billingReadingAction.REQUEST_BUILDING_PERIODS_LIST_COMPLETE,
      billingReadingAction.RESET_FILTER,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getSelectedBuildingPeriodId),
      this.store$.pipe(select(fromBillingReading.getUsageChart)),
      (action: any, buildingId, buildingPeriodId, usageChart) => {
        return {
          buildingId: buildingId,
          buildingPeriodId: buildingPeriodId,
          usageChart
        };
      }),
    switchMap((action: any) => {
      const actions = [];
      actions.push(new billingReadingAction.InitFilterDetail());

      if (action.usageChart !== BillingReadingChartUsagesEnum.None) {
        actions.push(new billingReadingAction.GetMeterReadingsChart());
      }
      return this.billingReadingsService.getFilter(action.buildingId, action.buildingPeriodId).pipe(
        switchMap((r: any) => [
          new billingReadingAction.InitFilterDataComplete(r),
          ...actions
        ]),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  // Estimation Reasons Loaded
  reasonsLoad: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.ESTIMATION_REASONS_LOAD),
    switchMap(() => {
      return this.equipmentService.getAllReasons('');
    }),
    map(reasons => new billingReadingAction.EstimationReasonsLoaded(reasons))
  ));
  // Get all filters
  getAllFilters: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.GET_ALL_FILTERS),
    withLatestFrom(this.store$.select(commonData.getBuildingId),
      (_, buildingId) => {
        return {
          buildingId
        };
      }),
    switchMap(({buildingId}) => {
      return this.billingReadingsService.getFilters(buildingId).pipe(
        map(filters => {
          return new billingReadingAction.GetAllFiltersSuccess(filters);
        })
      );
    })
  ));
  // Change Active filters
  changeActiveFilter: Observable<Action | null> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.CHANGE_ACTIVE_FILTER),
    withLatestFrom(this.store$.select(commonData.getBuildingId),
      (action: billingReadingAction.ChangeActiveFilter, buildingId) => {
        return {
          payload: action.payload,
          buildingId
        };
      }),
    map(({payload, buildingId}) => {
      if (payload.active) {
        return new billingReadingAction.ResetFilter();
      }

      return new billingReadingAction.RequestBuildingBillingReadingsList();
    })
  ));
  // Save filter
  saveFilter: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.ADD_FILTER),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getFilterDetail),
      (action: billingReadingAction.AddFilter, buildingId: string, filterDetail: BillingReadingsFilterDetailViewModel) => {
        return {
          payload: action.payload,
          buildingId,
          filterDetail
        };
      }),
    switchMap(({payload, buildingId, filterDetail}) => {
      return this.billingReadingsService.addFilter(buildingId, filterDetail, payload).pipe(
        map((filter) => {
          return new billingReadingAction.AddFilterSuccess(filter);
        })
      );
    })
  ));
  // After Save Filter
  saveFilterSuccess: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.ADD_FILTER_SUCCESS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (action: billingReadingAction.AddFilterSuccess, buildingId: string) => {
        return {
          payload: action.payload,
          buildingId,
        };
      }),
    map(({payload, buildingId}) => {
      return new billingReadingAction.ChangeActiveFilter(payload);
    })
  ));
  updateIsShowDetails = createEffect(() =>this.actions$.pipe(
    ofType(billingReadingAction.UPDATE_IS_SHOW_DETAILS),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.pipe(select(fromBillingReading.getIsShowDetails)),
      (_, buildingId: string, showDetails: boolean) => {
        return {
          buildingId,
          showDetails
        };
      }),
    map(({buildingId, showDetails}) => {
      return (
        showDetails
          ? this.store$.dispatch(new billingReadingAction.GetMeterReadingsChart({
            chartUsage: BillingReadingChartUsagesEnum.CurrentPeriod,
            isCall: true
          }))
          : null
      );
    })
  ), {dispatch: false});
  toggleMeterReading: Observable<void> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.TOGGLE_METER_READING),
    map((action: billingReadingAction.ToggleMeterReading) => {
        const {meter} = action.payload;
        const isExpanded = !meter.isExpanded;

        return (
          isExpanded ? this.store$.dispatch(new billingReadingAction.GetMeterReadingsStatsChart({
              meterId: meter.meterId,
              chartView: meter.meterReadingStats?.activeTabId || BillingReadingChartUsagesEnum.CurrentPeriod
            })
          ) : null
        );
      }
    )), {dispatch: false});
  changeActiveTab: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.CHANGE_ACTIVE_TAB),
    map((action: billingReadingAction.ChangeActiveTab) => new billingReadingAction.GetMeterReadingsStatsChart({
      meterId: action.payload.meterId,
      chartView: action.payload.tabId
    }))
  ));
  toggleRegisterDetails: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.TOGGLE_REGISTER_DETAILS),
    map((action: billingReadingAction.ToggleRegisterDetails) => new billingReadingAction.GetMeterReadingsStatsChart({
      meterId: action.payload.meterId,
      registerId: action.payload.registerId,
      chartView: BillingReadingChartUsagesEnum.CurrentPeriod
    }))
  ));
  getMeterReadingStatsChart: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.GET_METER_READINGS_STATS_CHART),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(fromBillingReading.getBillingReadingsState)),
      (action: billingReadingAction.GetMeterReadingsStatsChart, buildingId, state) => {
        return {
          meterId: action.payload.meterId,
          startDate: action.payload.startDate,
          endDate: action.payload.endDate,
          chartView: action.payload.chartView,
          buildingPeriodId: action.payload.buildingPeriodId,
          registerId: action.payload?.registerId,
          buildingId: buildingId,
          state: state
        };
      }),
    switchMap(({meterId, startDate, endDate, chartView, buildingPeriodId, buildingId, state, registerId}) => {

      const filterModel = getFilterMeterStatsModel(buildingId, startDate, endDate, state, chartView, buildingPeriodId);

      return this.billingReadingsService.getMeterReadingsStatsCharts(buildingId, meterId, filterModel).pipe(
        map(res => new billingReadingAction.GetMeterReadingsStatsChartSuccess(res)),
        catchError(() => of({type: 'DUMMY'}))
      );
    })
  ));
  // Update filter
  updateFilter: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.UPDATE_FILTER),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getFilterDetail),
      (action: billingReadingAction.UpdateFilter, buildingId: string, filterDetail: BillingReadingsFilterDetailViewModel) => {
        return {
          payload: action.payload,
          buildingId,
          filterDetail
        };
      }),
    switchMap(({payload, buildingId, filterDetail}) => {
      return this.billingReadingsService.updateFilter(buildingId, filterDetail, payload).pipe(
        map((filter) => {
          return new billingReadingAction.UpdateFilterComplete(filter);
        })
      );
    })
  ));
  // Update filter success
  updateFilterSuccess: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.UPDATE_FILTER_COMPLETE),
    map(_ => {
      return new billingReadingAction.RequestBuildingBillingReadingsList();
    })
  ));
  // Remove Filter
  removeFilter: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.REMOVE_FILTER),
    switchMap((action: billingReadingAction.RemoveFilter) => {
      return this.billingReadingsService.deleteFilter(action.payload).pipe(
        switchMap(_ => {
          return [
            new billingReadingAction.RemoveFilterSuccess(action.payload),
            new billingReadingAction.ResetFilter()
          ];
        })
      );
    })
  ));
  getMeterReadingsChartSucess: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.GET_METER_READINGS_CHART_SUCCESS),
    tap((action: billingReadingAction.GetMeterReadingsChartSuccess) => {
      if (action.payload.isShowDetails) {
        this.store$.dispatch(new billingReadingAction.GetMeterReadingsStatsChartSuccess(action.payload.charts));
      }
    })
  ), {dispatch: false});
  // Get meter chart for readings
  getMeterChartReadings: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.GET_METER_READINGS_CHART),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.pipe(select(fromBillingReading.getBillingReadingsState)),
      this.store$.pipe(select(fromBillingReading.getUsageChart)),
      this.store$.pipe(select(commonData.getActiveBuildingPeriod)),
      (action: billingReadingAction.GetMeterReadingsChart, buildingId, state, usageChart, selectedBuildingPeriod) => {
        return {
          payload: action.payload,
          usageChart,
          buildingId: buildingId,
          state: state,
          periodId: selectedBuildingPeriod.id
        };
      }),
    switchMap(({payload, usageChart, buildingId, state, periodId}) => {
      const isShowDetails = payload.isCall;
      const chartUsage = payload?.chartUsage || usageChart;
      const filterModel = getFilterMeterModel(buildingId, state, true, chartUsage, periodId);

      return this.billingReadingsService.getMeterReadingsCharts(buildingId, filterModel).pipe(
        map(res => new billingReadingAction.GetMeterReadingsChartSuccess(
          {charts: res.items, isShowDetails}
        )),
        catchError(() => of({type: 'DUMMY'}))
      );
    })
  ));
  // Get billing readings for building meters
  getMeterReadingsRequest: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.INIT_FILTER_DETAIL,
      billingReadingAction.UPDATE_PAGE,
      billingReadingAction.REQUEST_BUILDING_BILLING_READINGS_LIST
    ),
    withLatestFrom(
      this.store$.select(fromBillingReading.getBillingReadingsState),
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getRegisters),
      this.store$.pipe(select(fromBillingReading.getUsageChart)),
      this.store$.select(commonData.getUnitsOfMeasurement),
      (action: any, state, buildingId, registers, usageChart, units) => {
        return {
          payload: action.payload,
          state: state,
          buildingId: buildingId,
          registers: registers,
          usageChart,
          units
        };
      }),
    switchMap((action: any) => {

        const state = action.state;
        const periodId = state.selectedBuildingPeriodId ? state.selectedBuildingPeriodId : action.payload.periodId;
        const filterModel = getFilterMeterModel(action.buildingId, state, false, action.usageChart, periodId);
        const units = action.units;
        return this.billingReadingsService.getMeterReadings(action.buildingId, periodId, filterModel).pipe(
          map(r => {
            r.items = r.items.map(item => {
              item.registerReadings = item.registerReadings.map(registerReading => {
                const result = {...registerReading};

                const currentReadingValue = result.currentReadingValue;
                const previousReadingValue = result.previousReadingValue;
                const averageUsage = result.averageUsage;

                const registerInfo = action.registers.find(r => r.id === registerReading.registerId);
                let usage = 0;
                if (registerInfo && registerInfo.registerType === RegisterType.ResetMax) {
                  usage = currentReadingValue;
                } else {
                  usage = currentReadingValue ? currentReadingValue - previousReadingValue : null;
                }

                result.isEndDateReading = isEndDateReading(registerReading);

                result.averageUsage = averageUsage
                  ? Math.round(averageUsage * 100) / 100 : averageUsage;
                result.estimatedReadingValue = result.estimatedReadingValue
                  ? Math.round(result.estimatedReadingValue * 100) / 100 : result.estimatedReadingValue;

                return result;
              });

              item.meterDetails.registers = item.meterDetails.registers.map(register => {
                const result = {...register};
                units.forEach(unit => {
                  unit.scales.forEach(r => {
                    if(r.id === register.registerScaleId) {result.registerScaleRatio = r.scale; result.registerScaleName = r.name}
                  })
                });
                return result;
              })
              item.meterDetails.isExpanded = false;

              return item;
            });

            return new billingReadingAction.RequestBuildingBillingReadingsListComplete(r);
          }),
          catchError(r => {
            return of({type: 'DUMMY'});
          })
        );
      }
    )
  ));
  resetReading: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.REQUEST_RESET_READING,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getSelectedBuildingPeriodId),
      (action: any, buildingId, buildingPeriodId) => {
        return {
          buildingId: buildingId,
          buildingPeriodId: buildingPeriodId,
          model: action.payload
        };
      }),
    switchMap(({buildingId, buildingPeriodId, model}) => {
      model.buildingPeriodId = buildingPeriodId;

      return this.billingReadingsService.resetReading(buildingId, buildingPeriodId, model).pipe(
        map((r: any) => new billingReadingAction.RequestBuildingBillingReadingsList()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  loadEstimationOptions: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.READINGS_LIST_OPEN_ESTIMATION_FROM_CONTEXT_MENU
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(commonData.getActiveBuildingPeriod),
      (action: any, buildingId, buildingPeriod) => {
        let buildingPeriodId = buildingPeriod.id;
        return {
          buildingId: buildingId,
          buildingPeriodId: buildingPeriodId,
          model: action.payload
        };
      }),
    switchMap((action: any) => {
      return this.billingReadingsService.getEstimationOptions(action.buildingId, action.buildingPeriodId, action.model).pipe(
        map((r: any) => new billingReadingAction.EstimationOptionsLoaded(r)),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  //
  saveApplyEstimated: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.APPLY_ESTIMATION_CLICK_APPLY,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getSelectedBuildingPeriodId),
      (action: any, buildingId: string, buildingPeriodId: string) => {
        return {
          buildingId: buildingId,
          model: {
            buildingPeriodId: buildingPeriodId,
            value: action.payload.value,
            isRollover: action.payload.isRollover,
            notes: action.payload.notes,
            reasonId: action.payload.reason,
            meterId: action.payload.meterId,
            registerId: action.payload.registerId,
            timeOfUse: action.payload.timeOfUse
          }
        };
      }),
    switchMap(({buildingId, model}) => {
      return this.billingReadingsService.applyEstimate(buildingId, model).pipe(
        map((r: any) => new billingReadingAction.RequestBuildingBillingReadingsList()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  confirmReading: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.REQUEST_CONFIRM,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getSelectedBuildingPeriodId),
      (action: any, buildingId) => {
        return {
          buildingId: buildingId,
          data: action.payload
        };
      }),
    switchMap(({buildingId, data}) => {
      const {readingId, confirm} = data;

      return this.billingReadingsService.confirmReading(buildingId, readingId, {confirm: confirm}).pipe(
        map((r: any) => new billingReadingAction.RequestBuildingBillingReadingsList()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));
  exportReadingsToCsv: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.EXPORT_BUILDING_BILLING_READINGS_TO_CSV
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      this.store$.select(fromBillingReading.getBillingReadingsState),
      this.store$.select(fromBillingReading.getBuildingPeriodsForMenu),
      this.store$.select(fromBillingReading.getUsageChart),
      (action: any, buildingId: string, state: any, buildingPeriods: any, chartUsage: BillingReadingChartUsagesEnum) => {
        return {
          buildingId: buildingId,
          state: state,
          buildingPeriods: buildingPeriods,
          chartUsage
        };
      }),
    switchMap(({buildingId, state, buildingPeriods, chartUsage}) => {

      const filterModel = getFilterMeterModel(buildingId, state, false, chartUsage);
      const buildingPeriod = buildingPeriods.find(b => b.id === state.selectedBuildingPeriodId);
      const fileName = 'Meter readings ' + buildingPeriod.name + '.csv';

      this.billingReadingsService.exportToCsvFile(buildingId, state.selectedBuildingPeriodId, filterModel, fileName);
      this.notificationService.message('The document is exported successfully');

      return of({type: 'DUMMY'});
    })
  ));
  // Update search key
  updateSearchKey: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(billingReadingAction.UPDATE_SEARCH_KEY),
    withLatestFrom((action: any) => {
      return {
        searchKey: action.payload
      };
    }),
    debounceTime(300),
    distinctUntilChanged(),
    map(({searchKey}) => {
      return new billingReadingAction.RequestBuildingBillingReadingsList();
    })
  ));
  updateReadingDetails = createEffect(() => this.actions$.pipe(
    ofType(
      billingReadingAction.UPDATE_READING_DETAILS,
    ),
    withLatestFrom(
      this.store$.select(commonData.getBuildingId),
      (action: billingReadingAction.UpdateReadingDetails, buildingId: string) => {
        return {
          buildingId: buildingId,
          data: action.payload
        };
      }),
    switchMap(({buildingId, data}) => {
      const {id} = data;

      return this.readingsHistoryService.updateReadingDetails(buildingId, id, data).pipe(
        map((r: any) => new billingReadingAction.RequestBuildingBillingReadingsList()),
        catchError(r => {
          return of({type: 'DUMMY'});
        })
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromBillingReading.State>,
    private equipmentService: EquipmentService,
    private buildingPeriodsService: BuildingPeriodsService,
    private billingReadingsService: BuildingBillingReadingsService,
    private readingsHistoryService: ReadingsHistoryService,
    private notificationService: NotificationService
  ) {
  }
}

const isEndDateReading = (reading) => {
  if (!reading || !reading.currentReadingDate) {
    return false;
  }
  const current = new Date(reading.currentReadingDate);
  const periodEnd = new Date(reading.periodEndDate);

  return current.getFullYear() === periodEnd.getFullYear()
    && current.getMonth() === periodEnd.getMonth() && current.getDate() === periodEnd.getDate();
};

const getFilterMeterStatsModel = (buildingId: string, startDate: Date, endDate: Date, state: any, usagesChartPeriods: BillingReadingChartUsagesEnum, buildingPeriodId: string) => {
  const commonFilterModel = commonFilterData(buildingId, state, buildingPeriodId);
  commonFilterModel['usagesChartPeriod'] = usagesChartPeriods;

  if (startDate) {
    commonFilterModel['fromDate'] = startDate;
  }

  if (endDate) {
    commonFilterModel['toDate'] = endDate;
  }

  return commonFilterModel;
};

const getFilterMeterModel = (buildingId: string, state: any, isChart: boolean = false,
                             usagesChartPeriods: BillingReadingChartUsagesEnum = BillingReadingChartUsagesEnum.None,
                             periodId?: string) => {
  const commonFilterModel = commonFilterData(buildingId, state, periodId);
  commonFilterModel['offset'] = state.page * state.total - state.total;
  commonFilterModel['total'] = state.total;
  commonFilterModel['usagesChartPeriod'] = usagesChartPeriods;

  if (isChart) {
    const filterModel: PagingOptions<any> = {
      requestParameters: commonFilterModel,
      skip: state.page * state.total - state.total,
      take: state.total,
    };

    return filterModel;
  }

  return commonFilterModel;
};

const commonFilterData = (buildingId: string, state: any, buildingPeriodId?: string) => {

  const filterDetail = state.filterDetail;
  const sources = filterDetail.sources.filter(s => s.isChecked);

  return {
    abnormalityFilterData: {
      levelFrom: filterDetail.abnormalityFilterData?.levelFrom,
      levelTo: filterDetail.abnormalityFilterData?.levelTo,
      absoluteUsageAbove: filterDetail.abnormalityFilterData?.absoluteUsageAbove,
    },
    buildingId: buildingId,
    buildingPeriodId: buildingPeriodId ? buildingPeriodId : state.selectedBuildingPeriodId,
    supplyTypes: filterDetail.checkedSupplyType,
    readingSources: sources.filter(s => s.isChecked).map(s => s.readingSource),
    registerId: filterDetail.checkedRegisterId,
    billingRegistersOnly: filterDetail.isBillingOnlyRegisters,
    nodeId: filterDetail.checkedNodeId,
    reasonId: filterDetail.checkedReasonId,
    locationId: filterDetail.checkedLocationId,
    unitId: filterDetail.checkedUnitId,
    tenantId: filterDetail.checkedTenantId,
    searchText: state.searchKey.trim(),
    readingCategory: filterDetail.readingCategory
  };
};
