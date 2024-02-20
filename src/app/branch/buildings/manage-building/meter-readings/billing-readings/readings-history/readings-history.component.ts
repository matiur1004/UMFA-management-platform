import {ReadingDetailsUpdateViewModel, ReadingFileInfoViewModel} from './../shared/models/readings-history.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';

import * as meterReadings from '../shared/store/reducers';
import * as readingHistoryAction from '../shared/store/actions/readings-history-actions/readings-history.action';
import * as billingReadingAction from '../../billing-readings/shared/store/actions/billing-readings.actions';
import * as readingsHistorySelectors from '../shared/store/selectors/readings-history.selectors';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {
  GroupedReadingsByBuildingPeriodViewModel,
  ReadingHistoryFilterViewModel,
  ReadingsHistoryViewModel,
  SORT_BY,
  sortByText
} from '../shared/models/readings-history.model';
import {ActivatedRoute, Router} from '@angular/router';
import {TimeOfUse, TimeOfUseMap, UNITS_PER_PAGE} from '@models';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {addDays, NgbDateFRParserFormatter} from '@shared-helpers';
import * as fromMeterReadings
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers';
import * as fromBillingReading
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers';
import {OptionViewModel} from '@app/shared/models/option-view.model';
import {EquipmentService} from '@services';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import * as billingReadingsAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
import {
  MeterReading,
  MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {
  BillingReadingChartUsagesEnum,
  MeterReadingChartViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {switchMap} from 'rxjs/operators';
import { BuildingPeriodViewModel } from '../../../shared/models/building-period.model';
import * as fromBuildingPeriods from '../../billing-readings/shared/store/reducers';
@Component({
  selector: 'readings-history',
  templateUrl: './readings-history.component.html',
  styleUrls: ['./readings-history.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ReadingsHistoryComponent implements OnInit, OnDestroy {
  readonly URL_SEGMENT = 'readings-history';
  public readonly sortByText = sortByText;
  public meterReadingStatsChart$: Observable<MeterReadingChartViewModel>;
  public readonly sortByList = [
    SORT_BY['Reading date'],
    SORT_BY['Created date']];
  readingsHistoryList$: Observable<GroupedReadingsByBuildingPeriodViewModel[]>;
  pinnedReadingsHistory$: Observable<ReadingsHistoryViewModel[]>;
  buildingPeriods$: Observable<BuildingPeriodViewModel[]>;
  metersSub$: Subscription;
  meters: any[];
  registers: any[];
  startDate$: Observable<Date>;
  endDate$: Observable<Date>;
  meterDetails: MeterReadingDetails;
  pathFromRoot$: Subscription;
  branchId: string;
  buildingId: string;
  meterId: string;
  registerId: string;
  timeOfUse: string;
  selectedMeter: any;
  selectedRegister: string;
  skippedReadings = 0;
  currentPageNumber = 1;
  pageSize = UNITS_PER_PAGE[1];
  pageSizes: number[] = UNITS_PER_PAGE;
  totalReadingsAmount: number;
  startDate: Date;
  endDate: Date;


  public sortBy$: Observable<SORT_BY>;
  public estimatedReasons$: Observable<OptionViewModel[]>;
  public meterReading$: Observable<MeterReadingDetails>;
  private readonly DEFAULT_REGISTER_ID = 'all';
  private readingAmountSub: Subscription;
  private selectedBuildingPeriodId: string;
  private selectedBuildingPeriod: BuildingPeriodViewModel;

  constructor(
    private store: Store<meterReadings.State>,
    private buildingPeriodStore: Store<fromBuildingPeriods.State>,
    private localStorage: LocalStorageService,
    private activatedRoute: ActivatedRoute,
    private equipmentService: EquipmentService,
    private router: Router
  ) {
  }

  private static getDatesFromLocalStorage(data: NgbDateStruct) {
    const date = new Date();
    date.setFullYear(data.year);
    date.setMonth(data.month - 1);
    date.setDate(data.day);

    return date;
  }

  ngOnInit() {
    const pathFromRoot = this.activatedRoute.pathFromRoot;
    this.pathFromRoot$ = combineLatest(
      pathFromRoot[2].params,
      pathFromRoot[4].params,
      pathFromRoot[6].params,
      this.store.pipe(select(readingsHistorySelectors.getSortBy))
    ).pipe(
      switchMap(([branchParams, buildingParams, readingParams, sortBy]) => {
        this.branchId = branchParams['branchid'];
        this.buildingId = buildingParams['id'];
        this.meterId = readingParams['meterId'];
        this.registerId = readingParams['registerId'];
        this.timeOfUse = readingParams['timeOfUse'];
        this.estimatedReasons$ = this.store.select(fromMeterReadings.getEstimatedReasons);
        this.meterReadingStatsChart$ = this.store.pipe(select(fromMeterReadings.getMeterReadingStatsChart, {meterId: this.meterId}));
        this.meterReading$ = this.store.pipe(select(fromMeterReadings.getMeterReadingDetail, {
          meterId: this.meterId,
          registerId: this.registerId
        }));

        this.initializeFilter(sortBy);

        this.store.dispatch(new readingHistoryAction.GetMetersRequest());
        this.store.dispatch(new billingReadingAction.EstimationReasonsLoad());


        return this.store.select(fromBillingReading.getSelectedBuildingPeriod);
      })
    ).subscribe((period: BuildingPeriodViewModel) => {
      this.selectedBuildingPeriodId = period.id;
      this.selectedBuildingPeriod = period;

      this.startDate$ = of(new Date(period.startDate));
      this.endDate$ = of(new Date(period.endDate));

      this.startDate = addDays(period.startDate, 0);
      this.endDate = addDays(period.endDate, 1);

      this.initializeReadingHistoryList();
      this.initMeterReadingStats(this.startDate, this.endDate);
    });

    this.readingsHistoryList$ = this.store.pipe(select(readingsHistorySelectors.getReadings));
    this.buildingPeriods$ = this.buildingPeriodStore.pipe(select(fromBuildingPeriods.getBuildingPeriods));

    this.readingAmountSub = this.store.pipe(select(readingsHistorySelectors.getReadingsAmount))
      .subscribe(item => this.totalReadingsAmount = item);

    this.pinnedReadingsHistory$ = this.store.pipe(select(readingsHistorySelectors.getPinnedReadings));
    this.sortBy$ = this.store.pipe(select(readingsHistorySelectors.getSortBy));

    this.metersSub$ = this.store.pipe(select(readingsHistorySelectors.getMeters),
      switchMap((res) => {
        this.meters = res.meters;

        if (res.selectedMeter) {
          this.selectedMeter = res.selectedMeter;
          if (this.meterId !== res.selectedMeter.id) {
            this.meterId = res.selectedMeter.id;
          }
        }

        return this.store.pipe(select(readingsHistorySelectors.getRegisters));
      })
    ).subscribe(registers => {
      this.registers = registers.registersTimeOfUses;
      if (this.registerId === this.DEFAULT_REGISTER_ID) {
        this.selectedRegister = this.DEFAULT_REGISTER_ID;
      } else {
        this.selectedRegister = this.registers.find(el => {
          return el.id === this.registerId && el.timeOfUse === TimeOfUseMap[this.timeOfUse];
        });
        if (!this.selectedRegister && registers.registersTimeOfUses.length) {
          this.selectedRegister = this.DEFAULT_REGISTER_ID;
          this.filterNavigation(this.buildingId, this.meterId, this.selectedRegister, 'None');
        }
      }
    });

  }

  ngOnDestroy() {
    this.readingAmountSub && this.readingAmountSub.unsubscribe();
    this.pathFromRoot$.unsubscribe();
    this.metersSub$.unsubscribe();
  }

  onUpdateMeter($event) {
    if ($event.serialNumber) {
      this.filterNavigation(this.buildingId, $event.id, this.registerId, this.timeOfUse);
    }
  }

  onUpdateRegisterTou($event) {
    if ($event && $event.name) {
      this.registerId = $event.id;
      this.timeOfUse = ($event.timeOfUse !== null) ? TimeOfUse[$event.timeOfUse] : TimeOfUse[TimeOfUse.None];
    } else {
      this.registerId = this.DEFAULT_REGISTER_ID;
      this.timeOfUse = 'None';
    }
    this.filterNavigation(this.buildingId, this.meterId, this.registerId, this.timeOfUse);
  }

  onUpdateStartDate($event) {
    this.startDate = new Date($event.year, $event.month - 1, $event.day);
    this.initializeReadingHistoryList();
    //this.store.dispatch(new readingHistoryAction.UpdateStartDate(this.startDate));
    //const endDate = this.getDate('endDate');
    this.initMeterReadingStats(this.startDate, this.endDate);
  }

  onUpdateEndDate($event) {
    this.endDate = new Date($event.year, $event.month - 1, $event.day, 23, 59, 59);
    this.initializeReadingHistoryList();
    //this.store.dispatch(new readingHistoryAction.UpdateEndDate(this.endDate));
    //const startDate = this.getDate('startDate');
    this.initMeterReadingStats(this.startDate, this.endDate);
  }

  getDate(dateKey: string) {
    const url = this.getUrl();
    const data = JSON.parse(this.localStorage.get(url));
    if (!data) {
      return;
    }

    return ReadingsHistoryComponent.getDatesFromLocalStorage(data[dateKey]);
  }

  onTogglePin($event) {
    this.store.dispatch(new readingHistoryAction.TogglePinRequest($event));
  }

  filterNavigation(buildingId: string, meterId: string, registerId: string, timeOfUse: string) {
    if (registerId) {
      this.router.navigate(['/branch', this.branchId, 'buildings', buildingId, 'meter-readings', 'readings-history',
        meterId, registerId, timeOfUse]);
    } else {
      this.router.navigate(['/branch', this.branchId, 'buildings', buildingId, 'meter-readings']);
    }
  }

  getUrl(): string {
    const searchStrUrl = this.router.url.indexOf(this.URL_SEGMENT);
    return this.router.url.slice(0, searchStrUrl);
  }

  initializeReadingHistoryList() {
    this.store.dispatch(new readingHistoryAction.GetReadingsHistoryList({
      skip: this.skippedReadings,
      take: this.pageSize,
      startDate: this.startDate,
      endDate: this.endDate
    }));

    this.store.dispatch(new readingHistoryAction.GetPinnedReadingsHistory());
  }

  onPageChange(selectedPageNumber: number) {
    this.currentPageNumber = selectedPageNumber;
    this.skippedReadings = (this.currentPageNumber - 1) * this.pageSize;

    this.store.dispatch(new readingHistoryAction.InitFilter(<ReadingHistoryFilterViewModel>{
      page: selectedPageNumber,
    }));

    this.initializeReadingHistoryList();
  }

  onPageSizeChanged(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageNumber = 1;
    this.skippedReadings = 0;

    this.store.dispatch(new readingHistoryAction.InitFilter(<ReadingHistoryFilterViewModel>{
      page: 1,
      unitsPerPage: pageSize
    }));

    this.initializeReadingHistoryList();
  }

  onSortByChange(sortBy: number) {
    this.store.dispatch(new readingHistoryAction.InitFilter(<ReadingHistoryFilterViewModel>{
      sortBy,
    }));
  }

  onSetBilling({readingId, buildingId}) {
    const startDate = this.getDate('startDate');
    const endDate = this.getDate('endDate');
    this.store.dispatch(new readingHistoryAction.SetBillingRequest({readingId, buildingId, startDate, endDate}));
  }

  updateReadingDetails(readingDetailsUpdate: ReadingDetailsUpdateViewModel) {
    this.store.dispatch(new readingHistoryAction.UpdateReadingDetails(readingDetailsUpdate));
  }

  downloadReadingDetailsFile(fileInfo: ReadingFileInfoViewModel) {
    this.store.dispatch(new readingHistoryAction.DownloadReadingDetailsFile(fileInfo));
  }

  onChangeChartView({chartView, meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeChartView({chartView, meterId}));
    const startDate = this.getDate('startDate');
    const endDate = this.getDate('endDate');
    this.initMeterReadingStats(this.startDate, this.endDate);
  }

  onChangeRegister({register, meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeRegisterStats({register, meterId}));
    const endDate = this.getDate('endDate');
    this.initMeterReadingStats(this.endDate, register);
  }

  onChangeAverage({meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeRegisterAverageUsage({meterId}));
    const startDate = this.getDate('startDate');
    const endDate = this.getDate('endDate');
    this.initMeterReadingStats(this.startDate, this.endDate);
  }

  onChangeTab({meterId, tabId}) {
    this.store.dispatch(new billingReadingsAction.ChangeActiveTab({tabId, meterId}));
  }

  private initializeFilter(sortBy: SORT_BY) {
    this.store.dispatch(new readingHistoryAction.InitFilter(<ReadingHistoryFilterViewModel>{
      meterId: this.meterId,
      sortBy,
      registerId: this.registerId === this.DEFAULT_REGISTER_ID ? null : this.registerId,
      timeOfUse: TimeOfUse[TimeOfUse.None] !== this.timeOfUse ? TimeOfUse[this.timeOfUse] : null
    }));
  }

  private initMeterReadingStats(startDate: Date, endDate: Date, register?: MeterReading) {
    if (this.selectedBuildingPeriodId) {
      this.store.dispatch(new billingReadingsAction.GetMeterReadingsStatsChart({
        meterId: this.meterId,
        registerId: register?.registerId || this.registerId,
        endDate,
        startDate,
        chartView: BillingReadingChartUsagesEnum.CurrentPeriod,
        buildingPeriodId: this.selectedBuildingPeriodId
      }));
    }
  }
}
