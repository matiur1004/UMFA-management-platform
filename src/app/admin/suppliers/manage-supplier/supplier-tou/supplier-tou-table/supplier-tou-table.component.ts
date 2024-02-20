import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'supplier-tou-table',
  templateUrl: './supplier-tou-table.component.html',
  styleUrls: ['./supplier-tou-table.component.less']
})
export class SupplierTouTableComponent implements OnInit {

  @Input() isTab: boolean;

  touRanges = [
    '00:00 - 01:00',
    '01:00 - 02:00',
    '02:00 - 03:00',
    '03:00 - 04:00',
    '04:00 - 05:00',
    '05:00 - 06:00',
    '06:00 - 07:00',
    '07:00 - 08:00',
    '08:00 - 09:00',
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '19:00 - 20:00',
    '20:00 - 21:00',
    '21:00 - 22:00',
    '22:00 - 23:00',
    '23:00 - 00:00'
  ]

  touSelectedRanges = {
    weekdays: {
      p: [],
      s: [],
      o: []
    },
    saturday: {
      p: [],
      s: [],
      o: []
    },
    sunday: {
      p: [],
      s: [],
      o: []
    }
  }

  constructor() {
  }

  ngOnInit() {
  }


}
