import {Component, OnInit} from '@angular/core';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '@shared-helpers';

@Component({
  selector: 'enter-readings',
  templateUrl: './enter-readings.component.html',
  styleUrls: ['./enter-readings.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class EnterReadingsComponent implements OnInit {
  orderIndex: number;

  constructor() {
  }

  ngOnInit() {
  }

  changeOrderIndex(number: number) {
    this.orderIndex = number;
  }
}
