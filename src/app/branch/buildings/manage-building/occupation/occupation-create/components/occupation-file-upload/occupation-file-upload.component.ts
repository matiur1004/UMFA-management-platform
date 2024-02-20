import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {OccupationService} from '@services';
import {NewFileViewModel, UploadResponseViewModel} from '@models';
import {Store} from '@ngrx/store';
import {NotificationService} from 'app/shared/services/notification.service';

import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';

@Component({
  selector: 'occupation-file-upload',
  templateUrl: './occupation-file-upload.component.html',
  styleUrls: ['./occupation-file-upload.component.less']
})
export class OccupationFileUploadComponent implements OnInit, IWizardComponent {

  file: File;
  isOver = false;
  validExtentions = ['csv'];

  @Input("model") model: any;
  @Input() buildingId: string;
  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();


  constructor(
    private occupationService: OccupationService,
    private store: Store<fromOccupation.State>,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  fileChangeEvent(event): void {
    const files = event.srcElement.files;
    if (files.length > 1) {
      this.notificationService.info('Please select only one file');
      return;
    }

    const ext = files[0].name.split('.').pop();
    if (this.validExtentions.includes(ext)) {
      this.file = files[0];
      this.parseFile(this.file);

    } else {
      this.notificationService.error('Invalid file type');
    }
  }

  dropped(files: NgxFileDropEntry[]): void {
    if (files.length > 1) {
      this.notificationService.info('Please select only one file');
      this.isOver = false;
      return;
    }

    const fileEntry = files[0].fileEntry as FileSystemFileEntry;
    if (fileEntry.isFile) {

      fileEntry.file((file: File) => {
        const ext = file.name.split('.').pop();
        if (this.validExtentions.includes(ext)) {
          this.file = file;
          this.parseFile(this.file);

        } else {
          this.notificationService.error('Invalid file type');
        }
        this.isOver = false;
      });

    } else {
      this.notificationService.error('Wrong file is selected');
    }
  }

  fileOver(event) {
    this.isOver = true;
  }

  fileLeave(event) {
    this.isOver = false;
  }

  removeFiles() {
    this.file = null;
  }

  canNavigate(): boolean {
    return true;
  }

  parseFile(file: File) {
    let newFile = new NewFileViewModel();
    newFile.file = file;

    this.occupationService.uploadFile(this.buildingId, newFile).subscribe(
      (response: UploadResponseViewModel) => {
        if (response == null)
          return;

        if (response.isCompleted) {
          this.store.dispatch(new occupationAction.SetShops(response.data));
          this.next.emit(1);

          return;
        }
      },
      r => {
      });
  }
}
