import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.less']
})
export class UserPasswordComponent implements OnInit {

  @Input() form: any;

  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();

  isOldPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isNewPasswordConfirmVisible: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

}
