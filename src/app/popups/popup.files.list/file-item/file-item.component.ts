import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileExtension} from 'app/shared/helper/file-extension';

@Component({
  selector: 'file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.less']
})
export class FileItemComponent implements OnInit {

  @Input() file: any;
  @Output() delete = new EventEmitter<any>();

  fileType: string;

  constructor() {
  }

  ngOnInit() {
    this.detectFileType();
  }

  detectFileType() {
    let fileType = FileExtension.getFileExtenion(this.file.fileName);

    switch (fileType) {

      case 'txt':
        this.fileType = 'txt-icon';
        break;

      case 'pdf':
        this.fileType = 'pdf-icon';
        break;

      case 'doc':
        this.fileType = 'doc-icon';
        break;

      case 'jpeg':
      case 'jpg':
        this.fileType = 'jpg-icon';
        break;

      case 'xls':
        this.fileType = 'xls-icon';
        break;

      case 'bmp':
        this.fileType = 'bmp-icon';
        break;

      case 'gif':
        this.fileType = 'gif-icon';
        break;

      case 'png':
        this.fileType = 'png-icon';
        break;

      case 'ppt':
        this.fileType = 'ppt-icon';
        break;

      case 'zip':
        this.fileType = 'zip-icon';
        break;

      default:
        this.fileType = 'other-icon';
    }
  }

  openFile() {
    window.open("/api/v1/buildings/operations-agreement/files/" + this.file.id, "_blank");
  }

  getIcon() {
    return 'pdf-icon';
  }

  onDelete($event) {
    this.delete.emit(this.file);
  }
}
