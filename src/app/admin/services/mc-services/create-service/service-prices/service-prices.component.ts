import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'service-prices',
  templateUrl: './service-prices.component.html',
  styleUrls: ['./service-prices.component.less']
})
export class ServicePricesComponent implements OnInit {

  @Input() model: any;
  @Input() isSubmitted: boolean;
  @Input() errors: any;
  @Input() meterTypes: any[] = [];

  @Output() addMeterType = new EventEmitter();
  @Output() removeMeterType = new EventEmitter();


  constructor() {
  }

  ngOnInit() {
  }

  trackById(index, item) {
    return index;
  }

}
