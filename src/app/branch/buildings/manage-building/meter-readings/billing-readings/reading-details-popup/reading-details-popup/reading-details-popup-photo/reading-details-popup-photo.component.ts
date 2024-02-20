import {allowedImageTypes, isAllowedFile} from './../../utils';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation,} from '@angular/core';
import {ReadingDetailsNavigation, ReadingsHistoryViewModel,} from './../../../shared/models/readings-history.model';

@Component({
  selector: 'reading-details-popup-photo',
  templateUrl: './reading-details-popup-photo.component.html',
  styleUrls: ['../reading-details-popup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ReadingDetailsPopupPhotoComponent {
  defaultReadingIconUrl = 'assets/images/meter-readings/meter-reading-icon.svg';
  uploadInputValue: string;
  allowedImageTypes = allowedImageTypes.join(', ');
  imageFile: File;
  @Input() readingsNavigation: ReadingDetailsNavigation;
  @Input() showPhotosNavigation = true;
  @Input() allowPhotoUpload = true;
  @Input() uploadedPhotoUrl: string | ArrayBuffer;
  @Output()
  photoChange = new EventEmitter();
  @Output()
  photoUpload = new EventEmitter<File>();

  private _readingDetails: ReadingsHistoryViewModel;

  get readingDetails(): ReadingsHistoryViewModel {
    return this._readingDetails;
  }

  @Input() set readingDetails(readingDetails: ReadingsHistoryViewModel) {
    this._readingDetails = readingDetails;
  };

  imageToBase64(url: string) {

  }

  uploadedPhoto(event: Event | File) {
    if (event instanceof File) {
      if (isAllowedFile(allowedImageTypes, event)) {
        this.photoUpload.emit(event);
        this.imageFile = event;
      }
      return;
    }

    const target = event.target as HTMLInputElement;
    const files: File[] = Array.from(target.files) || [];

    if (files.length) {
      const file = files[0];

      if (isAllowedFile(allowedImageTypes, file)) {
        this.photoUpload.emit(file);
        this.imageFile = file;
      }
    } else {
      this.photoUpload.emit(null);
      this.imageFile = null;
    }

    target.value = '';
  }
}
