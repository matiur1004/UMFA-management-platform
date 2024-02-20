import {Component, Input, OnInit} from '@angular/core';
import {ShopGeneralInfoViewModel} from '../../models/shop-detail.model';

@Component({
  selector: 'general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.less']
})
export class GeneralInfoComponent implements OnInit {

  @Input() generalInfo: ShopGeneralInfoViewModel;
  tabId: string = 'tab-0';

  constructor() {
  }

  ngOnInit() {
  }

}
