import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.less']
})
export class UserAccountComponent implements OnInit {

  tabId: string = 'tab-0'
  constructor() {
  }

  ngOnInit() {
  }
}
