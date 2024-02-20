import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ApplyResultPopupComponent} from './apply-result-popup.component';
import {VersionStatusViewModel} from '@models';
import {Injectable} from '@angular/core';

@Injectable()
export class ApplyResultService {
  constructor(
    private modalService: NgbModal
  ) {
  }

  showVersionUpdateResults(versionUpdateResults: VersionStatusViewModel[]) {
    if (!versionUpdateResults || !versionUpdateResults.length) {
      return;
    }

    const modalRef = this.modalService.open(ApplyResultPopupComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.applyVersions = versionUpdateResults;
  }
}
