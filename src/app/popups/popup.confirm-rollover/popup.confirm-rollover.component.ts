import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './popup.confirm-rollover.component.html',
  styleUrls: ['./popup.confirm-rollover.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopupConfirmRolloverComponent {
  @Input() popupText: string;

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
