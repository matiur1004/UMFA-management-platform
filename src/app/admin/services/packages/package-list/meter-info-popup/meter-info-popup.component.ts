import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'meter-info-popup',
  templateUrl: './meter-info-popup.component.html',
  styleUrls: ['./meter-info-popup.component.less']
})
export class MeterInfoPopupComponent implements OnInit {

  @Input() meterTypes: any[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  getMeterTypeTitle(meterType) {
    switch (meterType.supplyType) {
      case 0:
        return 'Electricity';

      case 1:
        return 'Water';

      case 2:
        return 'Gas';

      case 3:
        return 'Sewerage';

      case 4:
        return 'Ad Hoc';

      default:
        return 'N/A'
    }
  }
}
