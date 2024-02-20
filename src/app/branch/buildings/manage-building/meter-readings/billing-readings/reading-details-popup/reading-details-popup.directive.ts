import {ReadingFileInfoViewModel} from './../shared/models/readings-history.model';
import {ReadingDetailsPopupMode} from '../shared/models/reading-details-popup.model';
import {BuildingPeriodViewModel} from './../../../shared/models/building-period.model';
import {Directive, EventEmitter, HostListener, Input, OnDestroy, Output} from '@angular/core';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Subject, Subscription} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {
  InvalidateReadingViewModel,
  MeterViewModel,
  ReadingDetailsNavigation,
  ReadingDetailsUpdateViewModel,
  ReadingsHistoryViewModel,
  ResetReadingModel
} from '../shared/models/readings-history.model';
import {ReadingsHistoryService} from '../shared/services/readings-history.service';
import {ReadingDetailsPopupComponent} from './reading-details-popup/reading-details-popup.component';

@Directive({
  selector: '[readingDetailsPopup]'
})
export class ReadingDetailsPopupDirective implements OnDestroy {
  @Input()
  buildingId: string;
  @Input()
  meterId: string;
  @Input()
  readingId: string;
  @Input()
  mode: ReadingDetailsPopupMode = ReadingDetailsPopupMode.DetailsOnly;
  @Input()
  buildingPeriod: BuildingPeriodViewModel;
  @Output()
  updateReadingsList = new EventEmitter();
  @Output()
  resetReading = new EventEmitter<ResetReadingModel>();
  @Output()
  confirmReading = new EventEmitter<ReadingsHistoryViewModel>();
  @Output()
  readingDetailsUpdate = new EventEmitter<ReadingDetailsUpdateViewModel>();
  @Output()
  readingDetailsFileDownload = new EventEmitter<ReadingFileInfoViewModel>();
  private sliderReadingId: string;
  private readingHistorySub: Subscription;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private modalService: NgbModal,
              private readingsHistoryService: ReadingsHistoryService) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.getReadingHistoryData(this.readingId, this.buildingId, true).subscribe(
      (result: {
        meterDetails: MeterViewModel,
        readingDetails: ReadingsHistoryViewModel,
        readingsNavigation: ReadingDetailsNavigation
      }) => {
        // set default active
        result.readingsNavigation.registerReadings = this.getReadingsWithActiveStatus(result.readingsNavigation, result.readingDetails);

        this.openPopup(result);
      }
    );
  }

  invalidateReading(readingId: string, model: InvalidateReadingViewModel) {
    this.readingsHistoryService.invalidateReading(readingId, model).pipe(first())
      .subscribe((result: {
        meterDetails: MeterViewModel,
        readingDetails: ReadingsHistoryViewModel,
        readingsNavigation: ReadingDetailsNavigation
      }) => {
        this.openPopup(result);
        this.updateReadingsList.emit();
      });
  }

  onResetReading(model: ResetReadingModel): void {
    this.resetReading.emit(model);
  }

  verifyReading(readingDetails: ReadingsHistoryViewModel) {
    this.confirmReading.emit(readingDetails);
  }

  openPopup(result: {
    meterDetails: MeterViewModel,
    readingDetails: ReadingsHistoryViewModel,
    readingsNavigation: ReadingDetailsNavigation
  }) {
    const options: NgbModalOptions = {
      backdrop: 'static',
      windowClass: 'reading-details'
    };

    const {meterDetails, readingDetails, readingsNavigation} = result;
    const modalRef = this.modalService.open(ReadingDetailsPopupComponent, options);

    const subscriptions = [];

    // add extra variable
    // readingDetails.isEditable = false;
    // initialize popup data
    modalRef.componentInstance.readingDetails = readingDetails;
    modalRef.componentInstance.meter = meterDetails;
    modalRef.componentInstance.readingsNavigation = readingsNavigation;
    modalRef.componentInstance.mode = this.mode;
    modalRef.componentInstance.buildingPeriod = this.buildingPeriod;

    subscriptions.push(modalRef.componentInstance.downloadFile.subscribe(fileInfo => {
      if (fileInfo) {
        this.readingDetailsFileDownload.emit(fileInfo);
      }
    }));

    subscriptions.push(modalRef.componentInstance.confirmReading.subscribe(details => {
      this.verifyReading(details);
    }));

    this.onReadingNavigationChange(modalRef);

    modalRef.result.then((modalData: {
      readingDetails: ReadingsHistoryViewModel,
      readingDetailsUpdate: ReadingDetailsUpdateViewModel,
      fileToDownload: ReadingFileInfoViewModel
    }) => {
      const details: { id, meterId, value, notes, buildingId, timeOfUse, registerId, confirmed } = readingDetails;

      if (modalData.readingDetailsUpdate) {
        this.readingDetailsUpdate.emit(modalData.readingDetailsUpdate);
      } else {
        switch (this.mode) {
          case ReadingDetailsPopupMode.DetailsOnly:
            if (details.confirmed) {
              this.verifyReading(readingDetails);
            }

            break;

          case ReadingDetailsPopupMode.DetailsWithMarkAsIncorrect:
            this.invalidateReading(readingDetails.id, details);

            break;

          case ReadingDetailsPopupMode.Reset:
            this.onResetReading({
              ...details,
              readingId: details.id
            });

            break;
        }
      }
    }, () => {
    })
      .finally(() => {
        for (const item of subscriptions) {
          item?.unsubscribe();
        }
      });
  }

  ngOnDestroy() {
    this.readingHistorySub?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getReadingHistoryData(readingId: string, buildingId: string, includePredefinedBp: boolean) {
    var readingsHistoryData = this.readingsHistoryService.getReadingHistoryDetails(readingId, { buildingId, includePredefinedBp });
    return readingsHistoryData;
  }

  private onReadingNavigationChange(modalRef: NgbModalRef) {
    modalRef.componentInstance.emitReading
      .pipe(takeUntil(this.destroy$))
      .subscribe(readingId => {
        this.sliderReadingId = readingId;
        return this.getReadingHistoryData(readingId, this.buildingId, true)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (result: {
              meterDetails: MeterViewModel,
              readingDetails: ReadingsHistoryViewModel,
              readingsNavigation: ReadingDetailsNavigation
            }) => {
              // set active reading register
              result.readingsNavigation = {
                ...result.readingsNavigation,
                registerReadings: this.getReadingsWithActiveStatus(result.readingsNavigation, result.readingDetails)
              };

              // we should update Popup Data
              modalRef.componentInstance.readingDetails = result.readingDetails;
              modalRef.componentInstance.meter = result.meterDetails;
              modalRef.componentInstance.readingsNavigation = result.readingsNavigation;
            });
      });
  }

  private getReadingsWithActiveStatus(readingsNavigation: ReadingDetailsNavigation, readingDetails: ReadingsHistoryViewModel) {
    const newReadingRegisters = (readingsNavigation.registerReadings || []).map(r => ({...r, active: false}));
    const selectedReadingIndex = newReadingRegisters.findIndex(r => r.registerId === readingDetails.registerId);

    if (selectedReadingIndex < 0) {
      if (!!newReadingRegisters.length) {
        newReadingRegisters[0].active = true;
      }
    } else {
      newReadingRegisters[selectedReadingIndex].active = true;
    }

    return newReadingRegisters;
  }
}
