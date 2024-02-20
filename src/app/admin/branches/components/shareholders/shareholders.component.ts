import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BranchViewModel} from '../../models/branch.model';

@Component({
  selector: 'branch-shareholders',
  templateUrl: './shareholders.component.html',
  styleUrls: ['./shareholders.component.less']
})
export class CreateBranchShareholdersComponent implements OnInit {

  @Input() model: BranchViewModel;
  @Input() isNew: boolean;
  @Input() detailedShareholder: boolean;

  @Output() onDismiss = new EventEmitter<Event>();
  @Output() onNext = new EventEmitter<number>();
  newShareholder: boolean = true;
  form: FormGroup;
  shareholderIndex: number;
  formErrors = {
    "fullName": '',
    "percentages": ''
  }
  validationMessages = {
    "fullName": {
      "required": "Full Name is required"
    },
    "percentages": {
      "required": "Percentages is required",
      "pattern": "Should be a valid percent number"
    }
  }
  private tabIndex: number = 2;
  private isSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      percentages: ['', [Validators.required, Validators.pattern(/^100$|^\d{0,2}(\.\d{1,4})?$/)]]
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  create() {
    this.newShareholder = true;
    this.detailedShareholder = true;
    this.isSubmitted = false;
    this.form.reset();

    this.onValueFormChange();
  }

  editBank(idx) {
    this.shareholderIndex = idx;
    let shareholder = this.model.shareholders[idx];
    this.newShareholder = false;
    this.detailedShareholder = true;
    this.isSubmitted = false;
    this.form.patchValue({
      fullName: shareholder.fullName,
      percentages: shareholder.percentages
    });

    this.onValueFormChange();
  }

  update() {
    this.isSubmitted = true;

    if (this.form.valid && this.newShareholder) {
      this.model.shareholders.push(this.form.value);
      this.form.reset();
      this.newShareholder = false;
      this.detailedShareholder = false;
    } else if (this.form.valid) {
      this.model.shareholders[this.shareholderIndex] = this.form.value;
      this.form.reset();
      this.detailedShareholder = false;
    } else {
      this.onValueFormChange();
    }
  }

  cancelCreate() {
    this.newShareholder = false;
    this.detailedShareholder = false;
  }

  remove(idx) {
    this.model.shareholders.splice(idx, 1);
  }

  dismiss() {
    this.onDismiss.emit();
  }

  next() {
    this.onNext.emit(this.tabIndex + 1);
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
}
