import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'public-holidays',
  templateUrl: './public-holidays.component.html',
  styleUrls: ['./public-holidays.component.less']
})
export class PublicHolidaysComponent implements OnInit {

  @Input() holidays: any[];
  @Input() treatedDays: string[];

  constructor() {
  }

  ngOnInit() {
  }

}
