import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchSettingsService} from '@services';


@Component({
  selector: 'branch-bank-accounts',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.less']
})
export class BankAccountDetailComponent implements OnInit {

  @Input() branchId: string;

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
  private isSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchSettingsService,
    public activeModal: NgbActiveModal
  ) {
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

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
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

  submit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.branchService.addBankAccount(this.form.value, this.branchId).subscribe((bankAccount) => {
        this.activeModal.close(bankAccount);
      });
    } else {
      this.onValueFormChange();
    }
  }
}
