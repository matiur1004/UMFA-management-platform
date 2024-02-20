import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {
  MeterReading,
  MeterReadingDetails
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {
  ReadingDetailsUpdateViewModel,
  ReadingFileInfoViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models/readings-history.model';
import {ReadingSource, TimeOfUse} from '@models';
import {BuildingPeriodViewModel} from '@app/branch/buildings/manage-building/shared/models/building-period.model';
import {ReadingDetailsPopupMode} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models/reading-details-popup.model';
import * as Constants from '../../../shared/billing-reading-constants';

@Component({
  selector: 'reading-item-view',
  templateUrl: './reading-item-view.component.html',
  styleUrls: ['./reading-item-view.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadingItemViewComponent {
  @Input() registersReadings: Array<MeterReading>;
  @Input() buildingId: string;
  @Input() branchId: string;
  @Input() buildingPeriod: BuildingPeriodViewModel;
  @Input() readingSource: ReadingSource;
  @Input() meter: MeterReadingDetails;
  @Input() virtualRegistersReadings: Array<MeterReading>;
  @Input() isShowVirtualRegisters: boolean;
  @Output() confirmReading = new EventEmitter();
  @Output() readingDetailsUpdate = new EventEmitter<ReadingDetailsUpdateViewModel>();
  @Output() readingDetailsFileDownload = new EventEmitter<ReadingFileInfoViewModel>();
  @Output() updateReadingsList = new EventEmitter();
  @Output() enterReadings = new EventEmitter();
  @Output() startEstimation = new EventEmitter();
  resetReading = new EventEmitter();

  readingDetailsPopupMode = ReadingDetailsPopupMode;
  trendUpValue = Constants.TREND_UP_VALUE;
  trendDownValue = Constants.TREND_DOWN_VALUE;
  consecutiveEstimatedLimit = Constants.CONSECUTIVE_ESTIMATED_LIMIT;

  buildingFinalized: boolean = false;
  getTimeOfUse(timeOfUse) {
    return timeOfUse !== null ? TimeOfUse[timeOfUse] : TimeOfUse[TimeOfUse.None];
  }

  ngOnInit() {
    this.buildingFinalized = this.buildingPeriod?.isFinalized;
  }
}
