import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'shops-list-popup',
  templateUrl: './shops-list-popup.component.html',
  styleUrls: ['./shops-list-popup.component.less']
})
export class ShopsListPopupComponent implements OnInit {

  @Input() shops: any[];

  @Output() close = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}
