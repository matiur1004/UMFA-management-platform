import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'save-tariff',
  templateUrl: './save-tariff.component.html',
  styleUrls: ['./save-tariff.component.less']
})
export class SaveTariffComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  save() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

}
