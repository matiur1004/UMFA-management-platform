import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NotificationService, OccupationService} from '@app/shared/services';
import {NewFileViewModel, UploadResponseViewModel} from '@app/shared/models';

import * as fromOccupation from '../../../shared/store/reducers';
import * as occupationAction from '../../../shared/store/actions/occupation.actions';

@Component({
  selector: 'app-upload-data-modal',
  templateUrl: './upload-data-modal.component.html',
  styleUrls: ['./upload-data-modal.component.less']
})
export class UploadDataModalComponent implements OnInit {

  file: File;
  validExtentions = ['csv'];
  public buildingId: string;

  constructor(
    private activeModal: NgbActiveModal,
    private occupationService: OccupationService,
    private store: Store<fromOccupation.State>,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  close() {
    if (this.file) {
      this.parseFile(this.file);
      this.activeModal.close();
    }
  }

  dismiss() {
    this.activeModal.dismiss();
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
    } else {
      this.notificationService.error('Invalid file type');
    }
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
          return;
        }
      },
      r => {
      });
  }

}
