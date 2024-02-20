import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService} from '@services';

@Component({
  selector: 'img-modal',
  templateUrl: './img-modal.component.html',
  styleUrls: ['./img-modal.component.less']
})
export class ImgModalComponent implements OnInit {
  @Input() isReadonlyImage: boolean;
  @Input() url: string;

  showCropper = false;
  croppedImage = '';
  maintainAspectRatio = false;
  aspectRatio = 4 / 3;

  defaultUrl: string =
    '../../../assets/images/upload-file/upload-img-preview.png';

  file: File;
  imageChangedEvent: any = '';

  constructor(
    public activeModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    if (!this.url) {
      this.setDefaultURL();
    }
  }

  setDefaultURL(): void {
    this.url = this.defaultUrl;
  }

  imageCropped(image: string) {
    this.url = image;
  }

  onClose() {
    this.activeModal.dismiss();
  }

  onSave() {
    if (this.url !== this.defaultUrl) {
      this.activeModal.close(this.url);
    }
  }

  loadImageFailed() {
    this.notificationService.error('Please choose correct phormat!');
    this.setDefaultURL();
  }

  imageLoaded() {
    this.showCropper = true;
  }

  fileChangeEvent(event: any) {
    const {
      target: {files}
    } = event;

    this.imageChangedEvent = event;
    this.file = files[0];

    if (this.file) {
      const fr = new FileReader();
      fr.onload = () => {
        this.url = fr.result as string;
      };
      fr.readAsDataURL(this.file);
    } else if (!this.url && !this.file) {
      this.setDefaultURL();
    }
  }

  onError(event) {
    this.setDefaultURL();
  }
}
