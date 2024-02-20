import {ChangeDetectionStrategy, Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'node-tariffs-applied-popup',
  templateUrl: './node-tariffs-applied-popup.component.html',
  styleUrls: ['./node-tariffs-applied-popup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTariffsAppliedPopup {
  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  public close(): void {
    this.activeModal.dismiss();
  }
}
