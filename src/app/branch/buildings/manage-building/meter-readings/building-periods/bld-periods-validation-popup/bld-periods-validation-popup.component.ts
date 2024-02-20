import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Component} from "@angular/core";

@Component({
  selector: 'bld-periods-validation-popup',
  templateUrl: './bld-periods-validation-popup.component.html',
  styleUrls: ['./bld-periods-validation-popup.component.less'],
})
export class BldPeriodsValidationPopupComponent {

  public message: string;

  constructor(private activeModal: NgbActiveModal) {
  }

  onClose() {
    this.activeModal.dismiss();
  }
}
