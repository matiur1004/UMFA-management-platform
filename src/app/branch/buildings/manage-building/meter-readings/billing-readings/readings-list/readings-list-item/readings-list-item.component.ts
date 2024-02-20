import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
    BillingReadingChartUsagesEnum,
    MeterReadingChartViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {
    MeterReading,
    MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import { OptionViewModel } from '@app/shared/models/option-view.model';
import { ReadingSource, TimeOfUse } from '@models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { select, Store } from '@ngrx/store';
import { BuildingPeriodViewModel } from 'app/branch/buildings/manage-building/shared/models/building-period.model';
import { ImgModalComponent } from 'app/widgets/img-modal/img-modal.component';
import { Observable, Subscription } from 'rxjs';
import * as fromBuildingPeriods from '../../../billing-readings/shared/store/reducers';
import { EnterReadingPopupComponent } from '../../enter-reading-popup/enter-reading-popup.component';
import * as billingReadingsAction from '../../shared/store/actions/billing-readings.actions';
import * as enterReadingFormActions from '../../shared/store/actions/enter-reading-form.actions';
import * as fromMeterReadings from '../../shared/store/reducers';
import { ReadingDetailsUpdateViewModel, ReadingFileInfoViewModel } from './../../shared/models/readings-history.model';
import { ApplyEstimatedPopupComponent } from './apply-estimated-popup/apply-estimated-popup.component';

@Component({
  selector: 'readings-list-item',
  templateUrl: './readings-list-item.component.html',
  styleUrls: ['./readings-list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingsListItemComponent implements OnInit, OnDestroy {
  @Input() meter: MeterReadingDetails;
  @Input() meterReadingChart: MeterReadingChartViewModel;
  @Input() meterReadingStatsChart: MeterReadingChartViewModel;
  @Input() expandedRegisters: Array<MeterReading>;
  @Input() isShowVirtualRegisters: boolean;
  @Input() branchId: string;
  @Input() reasons: OptionViewModel[];
  @Input() buildingId: string;
  @Input() buildingPeriodId: string;
  @Output() registerId: string;
  @Output() resetReading = new EventEmitter();
  @Output() startEstimation = new EventEmitter();
  @Output() applyEstimation = new EventEmitter();
  @Output() toggleMeterReading = new EventEmitter();
  @Output() confirmReading = new EventEmitter();
  @Output() readingDetailsUpdate = new EventEmitter<ReadingDetailsUpdateViewModel>();
  @Output() updateReadingsList = new EventEmitter();
  @Output() readingDetailsFileDownload = new EventEmitter<ReadingFileInfoViewModel>();
  readingSource = ReadingSource;
  buildingPeriodSubscription: Subscription;
  buildingPeriod: BuildingPeriodViewModel;
  currentUsageChart$: Observable<BillingReadingChartUsagesEnum>;
  billingReadingChartEnum = BillingReadingChartUsagesEnum;

  constructor(private modalService: NgbModal,
              private store: Store<fromMeterReadings.State>,
              private buildingPeriodStore: Store<fromBuildingPeriods.State>,
              private router: Router) {
    this.currentUsageChart$ = this.store.pipe(select(fromMeterReadings.getUsageChart));
  }

  get virtualRegistersReadings() {
    return this.meter.registerReadings.filter(register => register.virtualRegisterType !== null);
  }

  get registersReadings() {
    return this.meter.registerReadings.filter(register => register.virtualRegisterType === null);
  }

  ngOnInit(): void {
    this.buildingPeriodSubscription =
      this.buildingPeriodStore.pipe(select(fromBuildingPeriods.getBuildingPeriods)).subscribe(buildingPeriods => {
        this.buildingPeriod = buildingPeriods.find(item => item.id === this.buildingPeriodId);
      });

    this.meter.registerReadings = this.meter.registerReadings.map(registerReading => {
      const result = {...registerReading};
      let registerId = registerReading['registerId'];
      let register = this.meter.meterDetails.registers.find(item => item.id == registerId);
      result['registerScaleRatio'] = register['registerScaleRatio'] ?? 1;
      result['registerScaleName'] = register['registerScaleName'] ?? '-';
      return result;
    })
  }

  ngOnDestroy(): void {
    this.buildingPeriodSubscription?.unsubscribe();
  }

  onStartEstimation($event) {
    this.startEstimation.emit($event);
    const modalRef = this.modalService.open(ApplyEstimatedPopupComponent, {
      backdrop: 'static',
      windowClass: 'apl-estmtd-modal'
    });

    modalRef.componentInstance.meterId = $event.meterId;
    modalRef.componentInstance.registerId = $event.registerId;

    modalRef.result.then(({notes, value, reason, isRollover}) => {
      this.applyEstimation.emit({
        meterId: $event.meterId,
        registerId: $event.registerId,
        timeOfUse: $event.timeOfUse,
        notes: notes,
        value: value,
        isRollover: isRollover,
        reason
      });
    }, () => {
    });
  }

  onEnterReadings() {
    this.store.dispatch(new billingReadingsAction.UpdateMeterIdToEnterReadings(this.meter.meterDetails.meterId));
    this.store.dispatch(new enterReadingFormActions.MarkAsUnsubmitted());

    this.modalService.open(EnterReadingPopupComponent, {
      backdrop: 'static',
      windowClass: 'enter-rdngs-modal'
    });
  }

  onOpenImage(url: string) {
    const modalRef = this.modalService.open(ImgModalComponent);
    modalRef.componentInstance.url = url;
    modalRef.componentInstance.isReadonlyImage = true;
  }

  onGetReadingHistory($event) {
    this.router.navigate([
      '/branch',
      this.branchId,
      'buildings',
      this.buildingId,
      'meter-readings',
      'readings-history',
      $event.meterId,
      $event.registerId,
      $event.timeOfUse !== null ? TimeOfUse[$event.timeOfUse] : TimeOfUse[TimeOfUse.None]]);
  }

  onUpdateReadingsList($event) {
    this.updateReadingsList.emit($event);
  }

  onChangeChartView({chartView, meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeChartView({chartView, meterId}));
  }

  onChangeRegister({register, meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeRegisterStats({register, meterId}));
  }

  readingTypeByMeterId(meterId: string) {
    if (this.registersReadings.length) {
      return this.registersReadings.find(x => x.meterId === meterId);
    }
  }

  onChangeAverage({meterId}) {
    this.store.dispatch(new billingReadingsAction.ChangeRegisterAverageUsage({meterId}));
  }

  onToggleFilter(register: MeterReading) {
    this.store.dispatch(new billingReadingsAction.ToggleRegisterDetails({
      meterId: register.meterId,
      registerId: register.registerId
    }));
  }

  onChangeTab({meterId, tabId}) {
    this.store.dispatch(new billingReadingsAction.ChangeActiveTab({tabId, meterId}));
  }
}
