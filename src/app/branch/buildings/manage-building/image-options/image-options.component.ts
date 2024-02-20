import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ImageOptions} from '@app/shared/models/image-options';
import {Options} from 'ng5-slider';
import {
  allowedImageTypes,
  isAllowedFile
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/reading-details-popup/utils';
import {NotificationService} from '@services';

@Component({
  selector: 'image-options',
  templateUrl: './image-options.component.html',
  styleUrls: ['./image-options.component.less']
})
export class ImageOptionsComponent {
  @Input() imageFile: File | string;
  @Input() photoName: string;
  @Input() isEditable: boolean;
  @Output() uploadPhoto: EventEmitter<File> = new EventEmitter<File>();
  ImageOptions = ImageOptions;
  isActiveBrightness: boolean;
  brightnessControl = 0;
  sliderOptions: Options = {
    floor: -100,
    ceil: 100,
    vertical: true
  };
  allowedFileTypes = [...allowedImageTypes];
  public isCropped: boolean;
  private maxFileSizeInBytes = 1000000;


  constructor(private notificationService: NotificationService) {
  }

  uploadedPhoto(file: File) {
    this.uploadPhoto.emit(file);
  }

  uploadImage($event: Event) {
    const target = $event.target as HTMLInputElement;
    const files = Array.from(target.files) || [];

    const [file] = files;

    if (isAllowedFile(this.allowedFileTypes, file)) {
      if (file.size > this.maxFileSizeInBytes) {
        this.notificationService.error('Please upload max. 1MB image');

        return;
      }
      this.uploadPhoto.emit(file);

      return;
    }

    this.notificationService.error('Invalid file type');
  }

  onTriggerCrop(crop: boolean) {
    this.isCropped = crop;
  }

  onSetActive() {
    if (!this.isCropped) {
      this.isActiveBrightness = !this.isActiveBrightness;
    }
  }
}
