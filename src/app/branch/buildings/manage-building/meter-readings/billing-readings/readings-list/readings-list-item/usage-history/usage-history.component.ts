import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'usage-history',
  templateUrl: './usage-history.component.html',
  styleUrls: ['./usage-history.component.less']
})
export class UsageHistoryComponent implements OnInit {

  @Input() history;

  constructor() {
  }

  ngOnInit() {
  }

}
