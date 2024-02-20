import {Component} from '@angular/core';

@Component({
  selector: 'calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.less']
})
export class CalculationsComponent {

  testList = [1, 1, 1, 1, 1, 1];
  orderIndex: number;

  constructor() {
  };

  changeOrderIndex(number: number) {
    this.orderIndex = number;
  }
}
