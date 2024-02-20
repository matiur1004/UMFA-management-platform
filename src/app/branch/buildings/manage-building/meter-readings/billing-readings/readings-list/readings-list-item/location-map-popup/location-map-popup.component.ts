import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'location-map-popup',
  templateUrl: './location-map-popup.component.html',
  styleUrls: ['./location-map-popup.component.less']
})
export class LocationMapPopupComponent implements OnInit {

  @Output() close = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
