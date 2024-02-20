import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {VersionStatusViewModel} from '@models';

@Component({
  selector: 'apply-result-popup',
  templateUrl: './apply-result-popup.component.html',
  styleUrls: ['./apply-result-popup.component.less']
})
export class ApplyResultPopupComponent implements OnInit {
  public applyVersions: VersionStatusViewModel[];

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onClose() {
    this.activeModal.close();
  }
}
