import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfimationPopupActions, ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './popup.confirm-report.component.html',
  styleUrls: ['./popup.confirm-report.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupConfirmReportComponent {
  form: FormGroup;
  popupDialog: ConfirmationPopupMessage;
  popupActions = ConfimationPopupActions;

  constructor(private activeModal: NgbActiveModal) {
    this.createForm();
  }

  onCancel() {
    this.activeModal.close();
  }

  onSave() {
    const formValue = this.form.getRawValue();
    this.activeModal.close(formValue);
  }

  private createForm() {
    this.form = new FormGroup({
      calculationMode: new FormControl([], Validators.required)
    });
  }
}
