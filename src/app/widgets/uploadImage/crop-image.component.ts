import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'crop-image',
  templateUrl: './crop-image.component.html',
  styleUrls: ['./crop-image.component.less']
})
export class CropImageComponent {

  file: File;
  croppedImage = '';
  maintainAspectRatio = false;
  aspectRatio = 4 / 3;

  constructor(public activeModal: NgbActiveModal) {
  }

  imageCropped(image: string) {
    this.croppedImage = image;
  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  close() {
    this.activeModal.close(this.croppedImage);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

}
