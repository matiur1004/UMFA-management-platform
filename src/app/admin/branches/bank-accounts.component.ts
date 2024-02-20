import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BranchService} from './branch.service';
import {BranchViewModel} from './models/branch.model';

@Component({
  selector: 'branch-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.less']
})
export class CreateBranchBankAccountsComponent implements OnInit {

  @Input() model: BranchViewModel;
  @Input() detailedAccount: boolean;

  @Output() onDismiss = new EventEmitter<Event>();
  @Output() onSave = new EventEmitter<Event>();

  private isSubmitted = false;
  private newAccount = true;
  bankAccountIndex: number;
  form: FormGroup;
  formErrors = {
    'accountName': '',
    'bankName': '',
    'accountType': '',
    'accountNumber': '',
    'branchCode': '',
    'description': ''
  };
  validationMessages = {
    'accountName': {
      'required': 'Account Name is required',
    },
    'bankName': {
      'required': 'Bank Name Name is required',
    },
    'accountType': {
      'required': 'Account Type is required',
    },
    'accountNumber': {
      'required': 'Account Number is required',
    },
    'branchCode': {
      'required': 'Branch Code is required',
    },
    'description': {
      'required': 'Description is required'
    }
  };
  
  constructor(private formBuilder: FormBuilder, private branchService: BranchService) {

  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      accountName: ['', Validators.required],
      description: ['', Validators.required],
      bankName: ['', Validators.required],
      accountType: ['', Validators.required],
      accountNumber: ['', Validators.required],
      branchCode: ['', Validators.required],
      swiftCode: ['']
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  createAccount() {
    this.newAccount = true;
    this.detailedAccount = true;
    this.isSubmitted = false;
    this.form.reset();

    this.onValueFormChange();
  }

  editBankAccount(idx) {
    this.bankAccountIndex = idx;
    const bankAccount = this.model.bankAccounts[idx];
    this.newAccount = false;
    this.detailedAccount = true;
    this.isSubmitted = false;
    this.form.patchValue({
      accountName: bankAccount.accountName,
      description: bankAccount.description,
      bankName: bankAccount.bankName,
      accountType: bankAccount.accountType,
      accountNumber: bankAccount.accountNumber,
      branchCode: bankAccount.branchCode,
      swiftCode: bankAccount.swiftCode
    });

    this.onValueFormChange();
  }

  updateAccount() {
    this.isSubmitted = true;

    if (this.form.valid && this.newAccount) {
      this.model.bankAccounts.push(this.form.value);
      this.form.reset();
      this.newAccount = false;
      this.detailedAccount = false;
    } else if (this.form.valid) {
      this.model.bankAccounts[this.bankAccountIndex] = this.form.value;
      this.form.reset();
      this.detailedAccount = false;
    } else {
      this.onValueFormChange();
    }
  }

  cancelCreateAccount() {
    this.newAccount = false;
    this.detailedAccount = false;
  }

  dismiss() {
    this.onDismiss.emit();
  }

  save(event) {
    this.onSave.emit(event);
  }

  removeAccount(idx) {
    this.model.bankAccounts.splice(idx, 1);
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      return;
    }
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = '';
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }
}
