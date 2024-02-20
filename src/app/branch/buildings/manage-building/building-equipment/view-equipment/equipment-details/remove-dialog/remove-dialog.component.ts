import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ConfimationPopupActions, ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';

@Component({
  selector: 'app-remove-dialog',
  templateUrl: './remove-dialog.component.html',
  styleUrls: ['./remove-dialog.component.less']
})
export class RemoveDialogComponent {

  validationMessage: ConfirmationPopupMessage;
  popupActions = ConfimationPopupActions;

  constructor(private activeModal: NgbActiveModal) {
  }

  onConfirm() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}
