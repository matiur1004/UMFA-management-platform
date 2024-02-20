import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'bld-periods-popup',
  templateUrl: './bld-periods-popup.component.html',
  styleUrls: ['./bld-periods-popup.component.less']
})
export class BldPeriodsPopupComponent implements OnInit {

  @Input() buildingPeriod;

  constructor() {
  }

  ngOnInit() {
  }

}
