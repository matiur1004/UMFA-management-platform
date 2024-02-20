import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'user-general-info',
  templateUrl: './user-general-info.component.html',
  styleUrls: ['./user-general-info.component.less']
})
export class UserGeneralInfoComponent implements OnInit {

  @Input() form: any;

  @Output() changeLogo = new EventEmitter();

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  defaultLogo = '../../../assets/images/icons/user-photo.png';

  constructor() {
  }

  ngOnInit() {
  }

}
