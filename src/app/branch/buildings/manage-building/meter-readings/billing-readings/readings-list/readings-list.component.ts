import {ReadingDetailsUpdateViewModel, ReadingFileInfoViewModel} from './../shared/models/readings-history.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeterReading, MeterReadingDetails} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {BuildingPeriodViewModel} from '../../../shared/models/building-period.model';
import {OptionViewModel} from '@app/shared/models/option-view.model';
import {Store} from '@ngrx/store';
import * as fromBuildingPeriods from '../../billing-readings/shared/store/reducers';
import * as buildingPeriodsAction from '../../building-periods/shared/store/actions/building-periods.actions';
import {BillingReadingChartUsagesEnum, MeterReadingChartViewModel} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {UNITS_PER_PAGE} from '@models';
import * as billingReadingsAction
  from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions';

@Component({
  selector: 'readings-list',
  templateUrl: './readings-list.component.html',
  styleUrls: ['./readings-list.component.less']
})

export class ReadingsListComponent implements OnInit {
  @Input() meterReadingChart: Array<MeterReadingChartViewModel>;
  @Input() metersReadingStatsChart: MeterReadingChartViewModel[];
  @Input() isShowDetails: boolean;
  @Input() isShowVirtualRegisters: boolean;
  @Input() expandedRegisters: Array<MeterReading>;
  @Input() total: number;
  @Input() page: number;
  @Input() meterReadingDetails: Array<MeterReadingDetails>;
  @Input() buildingId: string;
  @Input() branchId: string;
  @Input() reasons: OptionViewModel[];
  @Input() buildingPeriod: BuildingPeriodViewModel;
  @Input() chartUsage: BillingReadingChartUsagesEnum;

  @Output() resetReading = new EventEmitter();
  @Output() applyEstimation = new EventEmitter();
  @Output() startEstimation = new EventEmitter();
  @Output() toggleMeterReading = new EventEmitter();
  @Output() confirmReading = new EventEmitter();
  @Output() readingDetailsUpdate = new EventEmitter<ReadingDetailsUpdateViewModel>();
  @Output() updateReadingsList = new EventEmitter();
  @Output() readingDetailsFileDownload = new EventEmitter<ReadingFileInfoViewModel>();
  itemsPerPage = UNITS_PER_PAGE[1];
  billingReadingChart = BillingReadingChartUsagesEnum;

  constructor(private store: Store<fromBuildingPeriods.State>) {
  }

  ngOnInit(): void {
    this.loadBillingReadings();
  }

  onUpdateReadingsList($event) {
    this.updateReadingsList.emit($event);
  }

  onPageChange(page: number) {
    this.store.dispatch(new billingReadingsAction.UpdatePage(page));
  }

  readingStatsByMeterId(meterId: string) {
    if (this.metersReadingStatsChart.length) {
      return this.metersReadingStatsChart.find(x => x.meterId === meterId);
    }
  }

  readingTypeByMeterId(meterId: string) {
    if (this.meterReadingDetails.length) {
      return this.meterReadingDetails.find(x => x.meterDetails.meterId === meterId);
    }
  }

  private loadBillingReadings() {
    this.store.dispatch(new buildingPeriodsAction.GetBuildingPeriods());
  }
}
