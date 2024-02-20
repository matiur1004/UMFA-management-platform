import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'dialog-confirm-delete',
  templateUrl: './dialog-confirm-delete.component.html',
  styleUrls: ['./dialog-confirm-delete.component.less']
})
export class DialogConfirmDeleteComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
