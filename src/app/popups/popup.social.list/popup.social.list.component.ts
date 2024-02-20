import {Component, Input, OnInit} from '@angular/core';
import {ContactInformationViewModel} from "app/shared/models/contact-infomation.model";

@Component({
  selector: 'popup-social-list',
  templateUrl: './popup.social.list.component.html',
  styleUrls: ['./popup.social.list.component.less']
})
export class PopupSocialListComponent implements OnInit {

  @Input() model: ContactInformationViewModel[];

  constructor() {
  }

  ngOnInit() {
  }

}
