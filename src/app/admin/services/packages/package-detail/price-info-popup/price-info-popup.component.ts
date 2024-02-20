import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'price-info-popup',
  templateUrl: './price-info-popup.component.html',
  styleUrls: ['./price-info-popup.component.less']
})
export class PriceInfoPopupComponent implements OnInit {

  @Input() price: string;

  constructor() {
  }

  ngOnInit() {
  }

}
