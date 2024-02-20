import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CropImageComponent} from './crop-image.component';
import {FileExtension} from 'app/shared/helper/file-extension';

@Component({
  selector: 'upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.less']
})
export class UploadImageComponent implements OnInit {

  id: string;
  @Input() maintainAspectRatio = false;
  @Input() aspectRatio = 4 / 3;
  @Input() disabled: boolean = false;
  @Input() src: string;
  @Input() outputFileName: string;
  @Input() file: File;
  @Input() maxSize = 2;
  @Input() imgWidth = 150;
  @Input() imgHeight = 225;
  @Input() defaultUrl = 'assets/images/upload-file/upload-img-border.png';
  @Input() types = 'image/png, image/jpeg, image/gif';
  @Output() fileChange = new EventEmitter<File>();

  isValidFileSize = true;
  buttonText = 'Upload Image';

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.id = Math.random().toString(36).substr(2, 5);

    if (this.file) {

      const fr = new FileReader();
      fr.onload = () => {
        this.src = fr.result as string;
      };
      fr.readAsDataURL(this.file);
      this.buttonText = 'Change image';

    } else if (!this.src && !this.file) {
      this.src = this.defaultUrl;
    }
  }

  fileChangeEvent(file: File): void {
    this.file = file;
    let fileSize = this.getFileSize();
    if (fileSize < this.maxSize) {
      this.isValidFileSize = true;
      const modalRef = this.modalService.open(CropImageComponent, {backdrop: 'static'});
      modalRef.componentInstance.file = file;
      modalRef.componentInstance.maintainAspectRatio = this.maintainAspectRatio;
      modalRef.componentInstance.aspectRatio = this.aspectRatio;
      modalRef.result.then((result) => {
        this.src = result;
        const selectedFile = FileExtension.dataURLtoFile(result, (this.outputFileName || 'image') + '.png');
        this.fileChange.emit(selectedFile);

        // fix bug with scroll when opened two modals
        if (document.querySelector('body > .modal')) {
          document.body.classList.add('modal-open');
        }
      }, (reason) => {
      });
    } else {
      this.isValidFileSize = false;
    }

  }

  onError(event) {
    this.src = 'assets/images/upload-file/upload-img-border.png';
  }

  getFileSize() {
    let fileInputId = "file-" + this.id;
    let fileSize = (<HTMLInputElement>document.getElementById(fileInputId)).files[0].size / (1024 * 1024);
    return +fileSize.toFixed(2);
  }
}
