import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'popup-files-list',
  templateUrl: './popup.files.list.component.html',
  styleUrls: ['./popup.files.list.component.less']
})
export class PopupFilesListComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() delete = new EventEmitter<any>();
  @Output() uploadFile = (new EventEmitter<any>());

  @Input() files: any[] = new Array<any>();

  id: string;

  constructor() {
  }

  ngOnInit() {
    let randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    this.id = randLetter + Date.now();

  }

  onClose() {
    this.close.emit();
  }

  onDelete(document) {
    this.delete.emit(document);
  }

  onFileChanged($event) {
    this.uploadFile.emit({event: $event, field: this.files[0].field});
  }

}
