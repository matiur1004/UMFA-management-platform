import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'import-info',
  templateUrl: './import-info.component.html',
  styleUrls: ['./import-info.component.less']
})
export class ImportInfoComponent implements OnInit {

  @Input() report: any;

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
