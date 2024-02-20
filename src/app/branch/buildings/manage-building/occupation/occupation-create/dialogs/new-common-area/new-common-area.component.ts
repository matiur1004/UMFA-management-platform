import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'new-common-area',
  templateUrl: './new-common-area.component.html',
  styleUrls: ['./new-common-area.component.less']
})
export class NewCommonAreaComponent implements OnInit {

  cmnAreaNum: number[];
  selectedCmnAreaNumber: number = 1;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.cmnAreaNum = Array.from({length: 10}, (v, k) => k + 1);
  }

  close() {
    this.activeModal.close(this.selectedCmnAreaNumber);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  getNumber(i) {
    this.selectedCmnAreaNumber = i;
  }

}
