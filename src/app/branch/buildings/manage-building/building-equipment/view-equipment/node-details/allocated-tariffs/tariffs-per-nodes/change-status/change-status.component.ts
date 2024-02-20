import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

// sample of using: this.modalService.open(DeleteDialogComponent, { windowClass: "confirm-del-modal" });
@Component({
  selector: 'change-tariff-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.less']
})
export class ChangeStatusComponent implements OnInit {

  @Input() status: string;

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
