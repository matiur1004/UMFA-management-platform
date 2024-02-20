import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';

import {BankAccountViewModel} from '@models';
import {BankAccountService} from '@services';

@Component({
  selector: 'bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.less']
})
export class BankAccountComponent implements OnInit {

  @Input() model: BankAccountViewModel;

  public buildingId: string;
  public isNew: boolean;
  form: FormGroup;

  formErrors = {
    "accountName": '',
    "bankName": '',
    "accountType": '',
    "accountNumber": '',
    "branchCode": ''
  }

  validationMessages = {
    "accountName": {
      "required": "Account Name is required",
    },
    "bankName": {
      "required": "Bank Name Name is required",
    },
    "accountType": {
      "required": "Account Type is required",
    },
    "accountNumber": {
      "required": "Account Number is required",
    },
    "branchCode": {
      "required": "Branch Code is required",
    }
  }

  constructor(private formBuilder: FormBuilder, private bankAccountService: BankAccountService, private activeModal: NgbActiveModal,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      accountName: ['', Validators.required],
      description: [''],
      bankName: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.required],
      branchCode: ['', Validators.required],
      swiftCode: ['']
    });

    if (this.model != null) {
      this.form.setValue({
        accountName: this.model.accountName,
        description: this.model.description,
        bankName: this.model.bankName,
        accountType: this.model.accountType,
        accountNumber: this.model.accountNumber,
        branchCode: this.model.branchCode,
        swiftCode: this.model.swiftCode
      });
    }

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  insertAccount() {
    if (this.form.valid && this.isNew) {
      this.bankAccountService.createBankAccount(this.buildingId, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else if (this.form.valid) {
      this.bankAccountService.updateBankAccount(this.buildingId, this.model.id, this.form.value).subscribe(() => {
        this.activeModal.close();
      });
    } else {
      this.onValueFormChange();
    }
  }

  save(event) {
    this.insertAccount();
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
