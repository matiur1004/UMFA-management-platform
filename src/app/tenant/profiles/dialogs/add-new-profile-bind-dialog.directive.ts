import {Directive, HostListener} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {DialogAddNewProfileComponent} from './dialog-add-new-profile/dialog-add-new-profile.component';

@Directive({
  selector: '[add-new-profile-bind-dialog]'
})
export class AddNewProfileBindDialogDirective {
  constructor(private modalService: NgbModal) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.openDialog();
  }

  openDialog() {
    const options: any = {
      backdrop: 'static',
      windowClass: 'add-new-profile-modal'
    };
    const modalRef = this.modalService.open(DialogAddNewProfileComponent, options);
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }
}
