import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';

import {BranchViewModel} from '../../models/branch.model';
import {BranchService} from '../../branch.service';


@Component({
  selector: 'branch-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.less']
})
export class CreateBranchGeneralInfoComponent implements OnInit {

  @Input() model: BranchViewModel;
  @Input() isNew: boolean;
  @Input() tabChanged: Subject<any>;

  @Output() modelChange = new EventEmitter<BranchViewModel>();

  @Output() onNext = new EventEmitter<number>();
  @Output() onDismiss = new EventEmitter<Event>();

  nextNotify = new Subject<any>();
  isSubmitted: boolean = false;
  form: FormGroup;
  formErrors = {
    "name": '',
    "email": '',
    "phone": '',
    "registeredName": '',
    "registeredNumber": '',
    "vatNumber": '',

  }
  validationMessages = {
    "name": {
      "required": "Name is required",
    },
    "registeredName": {
      "required": "Registered Name is required",
    },
    "registeredNumber": {
      "required": "registered Number is required",
    },
    "vatNumber": {
      "required": "Vat Number is required",
    },
    "phone": {
      "required": "Phone is required",
      "pattern": "Phone number is not in the correct format"
    },
    "email": {
      "required": "Email is required",
      "pattern": "Email address is not in the correct format"
    }
  }
  private tabIndex: number = 0;

  constructor(private fb: FormBuilder, private branchService: BranchService) {
  }

  ngOnInit() {
    this.createForm();
    this.tabChanged.subscribe((event) => {
      this.isSubmitted = true;
      this.nextNotify.next();
      if (this.form.valid) {
        this.model.email = this.form.value.email;
        this.model.name = this.form.value.name;
        this.model.phone = this.form.value.phone;
        this.model.physicalAddress = this.form.value.physicalAddress;
        this.model.postAddress = this.form.value.postAddress;
        this.model.registeredName = this.form.value.registeredName;
        this.model.registeredNumber = this.form.value.registeredNumber;
        this.model.vatNumber = this.form.value.vatNumber;
      } else {
        event.preventDefault();
        this.onValueFormChange();
      }
    });
  }

  createForm() {
    if (this.model) {
      this.form = this.fb.group({
        name: [this.model.name, Validators.required],
        registeredName: [this.model.registeredName, Validators.required],
        registeredNumber: [this.model.registeredNumber, Validators.required],
        vatNumber: [this.model.vatNumber, Validators.required],
        phone: [this.model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
        physicalAddress: [{
          line1: this.model.physicalAddress.line1,
          line2: this.model.physicalAddress.line2,
          suburb: this.model.physicalAddress.suburb,
          city: this.model.physicalAddress.city,
          code: this.model.physicalAddress.code,
          province: this.model.physicalAddress.province,
          country: this.model.physicalAddress.country,
          description: this.model.physicalAddress.description
        }],
        postAddress: [{
          line1: this.model.postAddress.line1,
          line2: this.model.postAddress.line2,
          suburb: this.model.postAddress.suburb,
          city: this.model.postAddress.city,
          code: this.model.postAddress.code,
          province: this.model.postAddress.province,
          country: this.model.postAddress.country,
          description: this.model.postAddress.description
        }],
        email: [this.model.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      });
    } else {
      this.form = this.fb.group({
        name: ['', Validators.required],
        registeredName: ['', Validators.required],
        registeredNumber: ['', Validators.required],
        vatNumber: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
        physicalAddress: [{
          line1: '',
          line2: '',
          suburb: '',
          city: '',
          code: '',
          province: '',
          country: '',
          description: ''
        }],
        postAddress: [{
          line1: '',
          line2: '',
          suburb: '',
          city: '',
          code: '',
          province: '',
          country: '',
          description: ''
        }],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      });
    }

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  save() {
    this.branchService.update(this.model).subscribe();
    this.dismiss();
  }

  next() {
    this.isSubmitted = true;
    this.nextNotify.next();
    if (this.form.valid) {
      this.model.email = this.form.value.email;
      this.model.name = this.form.value.name;
      this.model.phone = this.form.value.phone;
      this.model.physicalAddress = this.form.value.physicalAddress;
      this.model.postAddress = this.form.value.postAddress;
      this.model.registeredName = this.form.value.registeredName;
      this.model.registeredNumber = this.form.value.registeredNumber;
      this.model.vatNumber = this.form.value.vatNumber;
      this.onNext.emit(this.tabIndex + 1);
    } else {
      this.onValueFormChange();
    }
  }

  dismiss() {
    this.onDismiss.emit();
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

  logoChanged(file) {
    if (this.isNew) {
      this.model.logo = file;
    } else {
      this.branchService.updateLogo(this.model.id, file).subscribe((response: string) => {
        this.model.logoUrl = response;
      });
    }
  }
}
