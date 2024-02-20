import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'supplier-tou',
  templateUrl: './supplier-tou.component.html',
  styleUrls: ['./supplier-tou.component.less']
})
export class SupplierTouComponent implements OnInit {


  tabId: string = "tab-0"

  @Input() isTabset: boolean;

  constructor() {
  }

  ngOnInit() {
  }


}
