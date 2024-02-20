import {ReadingDetailsUpdateViewModel, ReadingFileInfoViewModel} from './../../shared/models/readings-history.model';
import {ReadingDetailsPopupMode} from '../../shared/models/reading-details-popup.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OptionViewModel, ReadingSource} from '@models';
import {ReadingsHistoryViewModel, shouldDisplayTime} from '../../shared/models/readings-history.model';
import { BuildingPeriodViewModel } from '@app/branch/buildings/manage-building/shared/models/building-period.model';

@Component({
  selector: 'history-reading-item',
  templateUrl: './history-reading-item.component.html',
  styleUrls: ['./history-reading-item.component.less']
})

export class HistoryReadingItemComponent implements OnInit {
  @Input() reading: ReadingsHistoryViewModel;
  @Input() readings: ReadingsHistoryViewModel[];
  @Input() pinnedReading = false;
  @Input() reasons: OptionViewModel[];
  @Input() buildingPeriods: BuildingPeriodViewModel[];

  @Output() togglePin = new EventEmitter();
  @Output() setBilling = new EventEmitter();
  @Output() updateReadingsList = new EventEmitter();
  @Output() readingDetailsUpdate = new EventEmitter<ReadingDetailsUpdateViewModel>();
  @Output() readingDetailsFileDownload = new EventEmitter<ReadingFileInfoViewModel>();
  readingSource = ReadingSource;
  readingStatus: string;
  pinStatus: string;
  defaultReadingUrl = 'assets/images/meter-readings/meter-reading-icon.svg';
  readingImgSrc: string;
  audioPlayback = false;
  shouldDisplayTime = shouldDisplayTime;
  audioRecord = '';
  isBilling: boolean;
  readingDetailsPopupMode = ReadingDetailsPopupMode;
  buildingPeriod: BuildingPeriodViewModel;

  private readonly ESTIMATE = 'Estimate';
  private audio: any;
  readingVersionId: any;
  previousReadingVersionId: any;

  constructor() {
  }

  ngOnInit() {
    this.getReadingStatus(this.reading);
    this.getPinStatus(this.reading.isPinned);
    this.getReadingImgSrc(this.reading.photoUrl);
    this.calculateUsages(this.reading);
    this.buildingPeriod = this.buildingPeriods.find(period => period.id == this.reading.buildingPeriodId);
  }

  getReadingStatus(reading: ReadingsHistoryViewModel) {
    if (reading.readingSource === this.readingSource['Estimate']) {
      this.readingStatus = 'Estimated';
    }

    if (reading.confirmed && reading.readingSource != this.readingSource[this.ESTIMATE]) {
      this.readingStatus = 'Confirmed';
    }

    if (!reading.confirmed && reading.readingSource != this.readingSource[this.ESTIMATE]) {
      this.readingStatus = 'Unconfirmed';
    }
  }

  getReadingImgSrc(src) {
    if (src) {
      this.readingImgSrc = src;
    } else {
      this.readingImgSrc = this.defaultReadingUrl;
    }
  }

  getPinStatus(isPinned: boolean) {
    (isPinned) ? this.pinStatus = 'Unpin' : this.pinStatus = 'Pin';
  }

  onTogglePin() {
    const model = {
      reading: this.reading,
      readingId: this.reading.id,
      meterId: this.reading.meterId,
      registerId: this.reading.registerId,
      buildingPeriodId: this.reading.buildingPeriodId,
      isPinned: !this.reading.isPinned
    };
    this.togglePin.emit(model);
  }

  onUpdateReadingsList($event) {
    this.updateReadingsList.emit($event);
  }

  onSetBilling(reading: ReadingsHistoryViewModel) {
    this.setBilling.emit({readingId: reading.id, buildingId: reading.buildingId});
  }

  calculateUsages(reading: ReadingsHistoryViewModel) {
    let currentReadingDate = this.reading.date;
    let preceding = this.readings.find(r => r.date < currentReadingDate);
    if ((preceding != null)) {
      this.reading.precedingReadingValue = preceding.value;
      this.reading.precedingUsageValue = preceding.usage;
    }
    else {
      this.reading.precedingReadingValue = 0;
      this.reading.precedingUsageValue = 0;
    }
    let currentRatio = reading.ratio * reading.registerScaleRatio;
    if (Number.isNaN(currentRatio)) { currentRatio = 0 };
    let currentReadingValue = this.reading.value;
    let currentUsageValue = this.reading.usage;
    let bvUsage = (this.reading.value - this.reading.precedingReadingValue) * currentRatio;
    let bpUsage = currentUsageValue;

    if (preceding == null) {
      bvUsage = currentUsageValue;
      bpUsage = currentUsageValue;
    }
            
    if(!Number.isNaN(bpUsage)) {
      this.reading.calculatedBPUsage = bpUsage;
      this.reading.calculatedBPUsageFormula = "CurrentUsageValue (" + currentUsageValue + ")";
    }
    else {
      this.reading.calculatedBPUsage = reading.usage;
      this.reading.calculatedBPUsageFormula = "CurrentUsageValue (" + currentUsageValue + ")";
    }
    if (!Number.isNaN(bvUsage)) {
      this.reading.calculatedBVUsage = bvUsage;
      this.reading.calculatedBVUsageFormula = "CurrentReadingValue (" + currentReadingValue + ") - PrecedingReadingValue (" + this.reading.precedingReadingValue + ") * Ratio ("+ currentRatio +") = (" + bvUsage + ")";
    }
    else {
      this.reading.calculatedBVUsage = reading.usage;
      this.reading.calculatedBVUsageFormula = "CurrentUsageValue (" + currentUsageValue + ")";
    }

    console.log("ReadingValue: " + currentReadingValue + " | PrecedingReading: " + this.reading.precedingReadingValue + " | Usage: " + currentUsageValue + " | Ratio: " + currentRatio + " | BPUsage:" + bpUsage + " | BVUsage:" + bvUsage + " | ReadingId: " + reading.id);

  }
}
