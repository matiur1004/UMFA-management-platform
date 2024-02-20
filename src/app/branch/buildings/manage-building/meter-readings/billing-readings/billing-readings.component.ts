import {
  ReadingDetailsUpdateViewModel,
  ReadingFileInfoViewModel,
  ReadingsHistoryViewModel
} from './shared/models/readings-history.model';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopupCreateFilterComponent} from '@app/popups/popup.create.filter/popup.create.filter.component';
import {OptionViewModel} from '@app/shared/models/option-view.model';
import {
  Dictionary,
  NewFileViewModel,
  ReadingSource,
  SupplyType,
  UNITS_PER_PAGE,
  UploadResponseViewModel
} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {BranchManagerService} from '@services';
import {NotificationService} from 'app/shared/services/notification.service';
import {Options} from 'ng5-slider';
import {Observable} from 'rxjs';
import {BuildingPeriodViewModel} from '../../shared/models/building-period.model';
import * as buildingCommonData from '../../shared/store/selectors/common-data.selectors';
import {ImportInfoComponent} from '../popups/import-info/import-info.component';
import {EnterReadingPopupComponent} from './enter-reading-popup/enter-reading-popup.component';
import {
  AbnormalityFilterData,
  BillingReadingsFilterDetailViewModel,
  BillingReadingsFilterModel,
  ReadingSourceCheck
} from './shared/models/billing-reading-filter.model';
import {BuildingBillingReadingsService} from './shared/services/billing-readings.service';
import * as billingReadingsAction from './shared/store/actions/billing-readings.actions';
import * as enterReadingFormActions from './shared/store/actions/enter-reading-form.actions';
import * as historyReadingFormActions from './shared/store/actions/readings-history-actions/readings-history.action';
import * as fromMeterReadings from './shared/store/reducers';
import {
  BillingReadingChartUsages,
  BillingReadingChartUsagesEnum,
  MeterReadingChartViewModel,
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {
  MeterDetail,
  MeterReading,
  MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';

@Component({
  selector: 'billing-readings',
  templateUrl: './billing-readings.component.html',
  styleUrls: ['./billing-readings.component.less']
})
export class BillingReadingsComponent implements OnInit, OnDestroy {
  reasons$: Observable<OptionViewModel[]>;
  meterReadingDetails$: Observable<MeterReadingDetails[]>;
  buildingPeriods$: Observable<BuildingPeriodViewModel[]>;
  filterDetail$: Observable<BillingReadingsFilterDetailViewModel>;
  selectedBuildingPeriod$: Observable<BuildingPeriodViewModel>;
  registers$: Observable<OptionViewModel[]>;
  nodes$: Observable<OptionViewModel[]>;
  locations$: Observable<OptionViewModel[]>;
  units$: Observable<OptionViewModel[]>;
  tenants$: Observable<OptionViewModel[]>;
  isShowVirtualRegisters$: Observable<boolean>;
  total$: Observable<number>;
  isShowDetails$: Observable<boolean>;
  getBillingReadingsItemsDetails$: Observable<string>;
  buildingId: string;
  branchId: string;
  reasonAvailable = false;
  supplyType = SupplyType;
  readingSource = ReadingSource;
  showFilter = false;
  billingReadingEnum = BillingReadingChartUsagesEnum;
  abnormalityLevelSliderOptions: Options = {
    floor: -100,
    ceil: 100,
    step: 1,
    hidePointerLabels: true,
    hideLimitLabels: true
  };

  readingSourcesDict: Dictionary<string> = {
    [ReadingSource[ReadingSource.ManualCapture]]: 'Manual capture',
    [ReadingSource[ReadingSource.Import]]: 'Import readings',
    [ReadingSource[ReadingSource.Estimate]]: 'Estimated',
    [ReadingSource[ReadingSource.AmrImport]]: 'AMR',
    [ReadingSource[ReadingSource.MobileApp]]: 'Mobile App'
  };

  readingCategories = [
    {title: 'All readings', value: 0},
    {title: 'Has no readings', value: 1},
    {title: 'Estimated readings', value: 2},
  ];
  itemsPerPage: number | null = UNITS_PER_PAGE[1];
  page = 1;

  checkedSupplyTypes: SupplyType[];
  public chartUsage$: Observable<BillingReadingChartUsagesEnum>;
  file: File;
  validExtentions = ['csv'];
  filters$: Observable<BillingReadingsFilterModel[]>;
  totalFilters$: Observable<number>;
  activeFilter$: Observable<BillingReadingsFilterModel>;
  filterDetails: BillingReadingsFilterDetailViewModel;
  page$: Observable<number>;
  chartUsages = BillingReadingChartUsages;
  expandedRegisters$: Observable<Array<MeterReading>>;
  meterReadingChart$: Observable<Array<MeterReadingChartViewModel>>;
  metersReadingStatsChart$: Observable<MeterReadingChartViewModel[]>;
  searchKey$: Observable<string>;
  private buildingIdChangedSubscription: any;

  constructor(
    private store: Store<fromMeterReadings.State>,
    private modalService: NgbModal,
    private billingReadingService: BuildingBillingReadingsService,
    private notificationService: NotificationService,
    private branchManager: BranchManagerService
  ) {

    this.buildingPeriods$ = this.store.select(fromMeterReadings.getBuildingPeriodsForMenu);
    this.filterDetail$ = this.store.select(fromMeterReadings.getFilterDetail);
    this.filterDetail$.subscribe((filterDetails) => {
      this.checkedSupplyTypes = filterDetails.checkedSupplyType;
      this.filterDetails = filterDetails;
      this.reasonAvailable = !!this.filterDetails.checkedReasonId;
    });
    this.metersReadingStatsChart$ = this.store.pipe(select(fromMeterReadings.getMetersReadingStatsChart))
    this.selectedBuildingPeriod$ = this.store.select(fromMeterReadings.getSelectedBuildingPeriod);
    this.total$ = this.store.select(fromMeterReadings.getTotal);
    this.meterReadingChart$ = this.store.pipe(select(fromMeterReadings.getMeterReadingChart));
    this.page$ = this.store.select(fromMeterReadings.getPage);
    this.meterReadingDetails$ = this.store.select(fromMeterReadings.getMeterReadingDetails);
    this.registers$ = this.store.select(fromMeterReadings.getAllRegisters);
    this.nodes$ = this.store.select(fromMeterReadings.getAllNodes);
    this.locations$ = this.store.select(fromMeterReadings.getAllLocations);
    this.filters$ = this.store.select(fromMeterReadings.getAllFilters);
    this.activeFilter$ = this.store.select(fromMeterReadings.getActiveFilter);
    this.units$ = this.store.select(fromMeterReadings.getAllUnits);
    this.totalFilters$ = this.store.select(fromMeterReadings.getTotalFilters);
    this.tenants$ = this.store.select(fromMeterReadings.getAllTenants);
    this.chartUsage$ = this.store.select(fromMeterReadings.getUsageChart);
    this.isShowDetails$ = this.store.select(fromMeterReadings.getIsShowDetails);
    this.isShowVirtualRegisters$ = this.store.select(fromMeterReadings.getIsShowVirtualRegisters);
    this.getBillingReadingsItemsDetails$ = this.store.select(fromMeterReadings.getBillingReadingsItemsDetails);
    this.searchKey$ = this.store.select(fromMeterReadings.getBillingReadingsSearchKey);
    this.buildingIdChangedSubscription = this.store.select(buildingCommonData.getBuildingId).subscribe((id: string) => {
      this.buildingId = id;
      this.store.dispatch(new billingReadingsAction.GetAllFilters());
    });

    this.branchId = this.branchManager.getBranchId();
  }

  ngOnInit(): void {
    this.reasons$ = this.store.select(fromMeterReadings.getFilteredReasons);
  }

  ngOnDestroy(): void {
    this.buildingIdChangedSubscription.unsubscribe();
  }

  onShowFilter() {
    this.showFilter = !this.showFilter;
  }

  onResetFilter() {
    this.reasonAvailable = false;
    this.store.dispatch(new billingReadingsAction.ResetFilter());
  }

  onCancelFilter() {
    this.store.dispatch(new billingReadingsAction.CancelFilter());
  }

  onPeriodChanged(periodId) {
    this.store.dispatch(new billingReadingsAction.UpdateBuildingPeriod(periodId));
  }

  onReadingCategoryChanged(category: number) {
    // If category is equal to estimated readings
    this.reasonAvailable = category === 2;
    this.store.dispatch(new billingReadingsAction.UpdateReadingCategory(category));
  }

  search(term: string): void {
    this.store.dispatch(new billingReadingsAction.UpdateSearchKey(term));
  }

  onSupplyTypeChange(supplyType: SupplyType): void {
    this.store.dispatch(new billingReadingsAction.UpdateSupplyType(supplyType));
  }

  onReadingSourceChange(source: ReadingSourceCheck): void {
    this.store.dispatch(new billingReadingsAction.UpdateReadingSource({
      readingSource: source.readingSource,
      isChecked: source.isChecked
    }));
  }

  onBillingOnlyChange() {
    this.store.dispatch(new billingReadingsAction.UpdateIsBillingOnlyOption());
  }

  onRegisterChanged(registerId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateRegister(registerId));
  }

  onNodeChanged(nodeId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateNode(nodeId));
  }

  onReasonChange(reasonId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateReason(reasonId));
  }

  onLocationChanged(locationId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateMeterLocation(locationId));
  }

  onUnitChanged(unitId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateUnit(unitId));
  }

  onTenantChanged(tenantId: string) {
    this.store.dispatch(new billingReadingsAction.UpdateTenant(tenantId));
  }

  onAbnormalityFilterDataChanged(abnormalityFilterData: AbnormalityFilterData) {
    this.store.dispatch(new billingReadingsAction.UpdateAbnormalityLevel(abnormalityFilterData));
  }

  onApply() {
    this.store.dispatch(new billingReadingsAction.RequestBuildingBillingReadingsList());
  }

  onShowDetailsChanged() {
    this.store.dispatch(new billingReadingsAction.UpdateIsShowDetailsOption());
  }

  onEnterReadings() {
    this.store.dispatch(new billingReadingsAction.UpdateMeterIdToEnterReadings(null));
    this.store.dispatch(new enterReadingFormActions.MarkAsUnsubmitted());

    const modalRef = this.modalService.open(EnterReadingPopupComponent, {
      backdrop: 'static',
      windowClass: 'enter-rdngs-modal'
    });
  }

  onStartEstimation($event) {
    this.store.dispatch(new billingReadingsAction.ReadingListOpenEstimation($event));
  }

  onApplyEstimation($event) {
    this.store.dispatch(new billingReadingsAction.ApplyEstimatedClickApply($event));
  }

  onResetReading($event) {
    this.store.dispatch(new billingReadingsAction.SendResetReading($event));
  }

  onToggleMeterReading(meter: MeterDetail) {
    this.store.dispatch(new billingReadingsAction.ToggleMeterReading({meter}));
  }

  onConfirmReading(readingDetails: ReadingsHistoryViewModel) {
    const {id, meterId, confirmed} = readingDetails;

    this.store.dispatch(new billingReadingsAction.RequestConfirm({
      readingId: id,
      meterId: meterId,
      confirm: confirmed
    }));
  }

  onExportToCsv() {
    this.store.dispatch(new billingReadingsAction.ExportBuildingBillingReadingsToCsv());
  }

  onPageLoad(id: string) {
    this.store.dispatch(new billingReadingsAction.RequestBuildingPeriodsList());
  }

  fileChangeEvent(event): void {
    const files = event.srcElement.files;
    if (files.length > 1) {
      this.notificationService.info('Please select only one file');
      return;
    }

    const ext = files[0].name.split('.').pop();
    if (this.validExtentions.includes(ext)) {
      this.file = files[0];
      this.parseFile(this.file);

    } else {
      this.notificationService.error('Invalid file type');
    }
  }

  parseFile(file: File) {
    const newFile = new NewFileViewModel();
    newFile.file = file;

    this.billingReadingService.importFromFile(this.buildingId, newFile).subscribe(
      (response: UploadResponseViewModel) => {
        if (!response) {
          return;
        }

        if (response.isCompleted) {
          const modalRef = this.modalService.open(ImportInfoComponent, {
            centered: true,
            windowClass: 'import-info-dialog'
          });
          modalRef.componentInstance.report = response.data;
          modalRef.result.then(
            () => {
            },
            () => {
              this.onPageLoad(this.buildingId);
            }
          );
          return;
        }
      }, r => {
      });
  }

  isTypeActive(supplyType: SupplyType): boolean {
    if (this.checkedSupplyTypes.length > 0) {
      return this.checkedSupplyTypes.some(sType => sType === supplyType);
    }
    return false;
  }

  updateMetersList() {
    this.store.dispatch(new billingReadingsAction.RequestBuildingBillingReadingsList());
  }

  updateReadingDetails(readingDetailsUpdate: ReadingDetailsUpdateViewModel) {
    this.store.dispatch(new billingReadingsAction.UpdateReadingDetails(readingDetailsUpdate));
  }

  downloadReadingDetailsFile(fileInfo: ReadingFileInfoViewModel) {
    this.store.dispatch(new historyReadingFormActions.DownloadReadingDetailsFile(fileInfo));
  }

  onShowVirtualRegister() {
    this.store.dispatch(new billingReadingsAction.UpdateIsShowVirtualRegisters());
  }

  onSaveFilter(isNew: boolean = false) {
    const modalRef = this.modalService.open(PopupCreateFilterComponent, {
      backdrop: 'static',
      size: 'lg'
    });

    modalRef.componentInstance.isNew = isNew;
    modalRef.componentInstance.filterDetail$ = this.activeFilter$;

    modalRef.result.then((filterName: string) => {
      if (!filterName || !filterName.length) {
        return;
      }

      isNew ? this.store.dispatch(new billingReadingsAction.AddFilter(filterName))
        : this.store.dispatch(new billingReadingsAction.UpdateFilter(filterName));
    }, () => {
    });
  }

  onRemoveFilter(filter: BillingReadingsFilterModel) {
    this.store.dispatch(new billingReadingsAction.RemoveFilter(filter));
  }

  onChangeFilter(filter: BillingReadingsFilterModel) {
    this.store.dispatch(new billingReadingsAction.ChangeActiveFilter(filter));
  }

  onChangeChartUsages(chartUsage: BillingReadingChartUsagesEnum) {
    this.store.dispatch(new billingReadingsAction.ChangeChartUsage(chartUsage));
    this.store.dispatch(new billingReadingsAction.UpdateIsShowVirtualRegisters());
    if (chartUsage !== BillingReadingChartUsagesEnum.None) {
      this.store.dispatch(new billingReadingsAction.GetMeterReadingsChart({isCall: true}));
    }
  }
}
