import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

declare var $: any;

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UploadFileComponent implements OnInit, AfterViewInit {
  @Input() multyFiles = false;
  @Input() fileExtend = 'any';
  @Input() disabled = false;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  @ViewChild('uploadForm', {static: false}) uploadForm: ElementRef;
  @Output() selectedFile: EventEmitter<any> = new EventEmitter<any>();
  public files: any;
  public selectedFileName: string;

  constructor() {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const rootEl = $(this.uploadForm.nativeElement);
    rootEl.on('dragover', this.onDragover.bind(this));
    rootEl.on('dragenter', this.onDragenter.bind(this));
    rootEl.on('dragend', this.onDragend.bind(this));
    rootEl.on('dragleave', this.onDragleave.bind(this));
    rootEl.on('drop', this.onDrop.bind(this));
  }

  onDragover(e) {
    $(this.uploadForm.nativeElement).addClass('file-drag');
    e.preventDefault();
    e.stopPropagation();
  }

  onDragenter(e) {
    $(this.uploadForm.nativeElement).addClass('file-drag');
    e.preventDefault();
    e.stopPropagation();
  }

  onDragend(e) {
    $(this.uploadForm.nativeElement).removeClass('file-drag');
    e.preventDefault();
    e.stopPropagation();
  }

  onDragleave(e) {
    $(this.uploadForm.nativeElement).removeClass('file-drag');
    e.preventDefault();
    e.stopPropagation();
  }

  onDrop(e) {
    $(this.uploadForm.nativeElement).removeClass('file-drag');
    e.preventDefault();
    e.stopPropagation();
    const dataTransfer = e.originalEvent.dataTransfer;
    if (dataTransfer && !$(this.fileInput.nativeElement).attr('disabled')) {
      if (dataTransfer.files.length >= 1) {
        this.selectedFileName = dataTransfer.files[0].name;
        const temp = this.selectedFileName.split('.');
        if (this.fileExtend === 'any' || temp[temp.length - 1] === this.fileExtend) {
          this.selectedFile.emit(this.multyFiles ? dataTransfer.files : dataTransfer.files[0]);
        } else {
          this.selectedFile.emit(null);
        }
      }
    }
    return false;
  }

  onClickSelectFile() {
    $(this.fileInput.nativeElement).trigger('click');
  }

  onChange(ev: any) {
    const files = ev.target.files;
    if (files && files.length) {
      this.selectedFileName = files[0].name;
      this.selectedFile.emit(this.multyFiles ? files : files[0]);
    } else {
      this.selectedFileName = '';
    }
  }
}
