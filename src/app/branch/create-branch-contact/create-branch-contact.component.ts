import {Component, OnInit} from '@angular/core';
import {AddressViewModel, ContactInformationType, ContactViewModel, DepartmentViewModel} from '@models';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

import {UserProfileService} from '@services';

@Component({
  selector: 'create-branch-contact',
  templateUrl: './create-branch-contact.component.html',
  styleUrls: ['./create-branch-contact.component.less']
})
export class CreateBranchContactComponent implements OnInit {

  isNew = true;
  form: FormGroup;
  isSubmitted = false;
  selectedAddressText = 'New';
  currentAddressId = '-1';
  addresses: AddressViewModel[] = new Array<AddressViewModel>();
  contactExternalLinkTypes: string[] = ContactInformationType.externalLinkLabels();
  contactPhoneNumberTypes: string[] = ContactInformationType.phoneContactLabels();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  extraDepartments: any[];
  selectedDepartmentsIds: string[] = new Array<string>();
  addressChangedSubject: Subject<boolean> = new Subject();
  submitNotify = new Subject<any>();
  formErrors = {
    'fullName': '',
    'phone': '',
    'registrationNumber': '',
    'vatNumber': '',
    'email': '',
    'departments': ''
  };
  validationMessages = {
    'fullName': {
      'required': 'Name is required',
    },
    'phone': {
      'required': 'Phone is required',
      'pattern': 'Phone number is not in the correct format'
    },
    'email': {
      'required': 'Email is required',
      'email': 'Email is not in the correct format'
    },
    'departments': {
      'required': 'Department is required',
    },
    'contactExternalLinks': {
      'required': 'Value is required',
    },
    'contactPhoneNumbers': {
      'required': 'Phone is required',
      'pattern': 'Phone number is not in the correct format'
    }
  };
  file: any;

  constructor(private activeModal: NgbActiveModal, private userProfileService: UserProfileService, private formBuilder: FormBuilder) {
  }

  private _model: ContactViewModel;

  public get model(): ContactViewModel {
    return this._model;
  }

  public set model(v: ContactViewModel) {
    this._model = v;
    this.createForm();
  }

  get contactInformations(): FormArray {
    return this.form.get('contactInformations') as FormArray;
  }

  get contactExternalLinks(): FormArray {
    return this.form.get('contactExternalLinks') as FormArray;
  }

  get contactPhoneNumbers(): FormArray {
    return this.form.get('contactPhoneNumbers') as FormArray;
  }

  ngOnInit() {
    this.userProfileService.getBranchDepartments().subscribe((departments) => {
      this.departments = departments;
      this.createForm();
      this.selectedDepartmentsIds = this.getDepartmentsIds();
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [this.model.id],
      fullName: [this.model.fullName, Validators.required],
      email: [this.model.email, [Validators.required, Validators.email]],
      phone: [this.model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
      description: [this.model.description],
      address: [this.model.address],
      departments: this.formBuilder.array(this.getDepartments(), Validators.required),
      contactInformations: this.formBuilder.array([]),
      contactPhoneNumbers: this.formBuilder.array(this.model.contactPhoneNumbers.map(pn => this.formBuilder.group({
        id: [pn.id],
        label: [pn.label],
        value: [pn.value, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]]
      }))),
      contactExternalLinks: this.formBuilder.array(this.model.contactExternalLinks.map(el => this.formBuilder.group({
        id: [el.id],
        label: [el.label],
        value: [el.value, Validators.required]
      }))),
      logo: [this.model.logo]
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onAddExternalLink() {
    const control = this.formBuilder.group({
      label: [ContactInformationType.externalLinkLabels()[0]],
      value: ['', Validators.required]
    });
    this.contactExternalLinks.push(control);
  }

  onRemoveExternalLink(idx) {
    this.contactExternalLinks.removeAt(idx);
  }

  onAddPhoneNumber() {
    const control = this.formBuilder.group({
      label: [ContactInformationType.phoneContactLabels()[0]],
      value: ['', [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]]
    });
    this.contactPhoneNumbers.push(control);
  }

  onRemovePhoneNumber(idx) {
    this.contactPhoneNumbers.removeAt(idx);
  }

  getDepartments() {
    this.extraDepartments = this.model.departments.filter(ud => this.departments.find(d => d.id == ud.id) == null);
    return this.model.departments.filter(ud => this.extraDepartments.find(d => d.id == ud.id) == null)
      .map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  getDepartmentsIds() {
    return this.model.departments.map(department => department.id);
  }

  onSave() {
    this.submitNotify.next();

    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    const contactInfo = this.contactInformations;

    this.contactPhoneNumbers.controls.forEach(element => {
      contactInfo.push(element);
    });

    this.contactExternalLinks.controls.forEach(element => {
      contactInfo.push(element);
    });


    if (this.isNew) {
      this.userProfileService.createContact(this.form.value).subscribe((response: ContactViewModel) => {
        this.activeModal.close(response);
      });
    } else {
      const model = JSON.parse(JSON.stringify(this.form.value));
      model.logo = this.form.controls['logo'].value;
      this.extraDepartments.forEach(d => {
        model.departments.push(d);
      });

      model.logoUrl = this.model.logoUrl;

      this.userProfileService.updateContact(this.model.id, model).subscribe((response: ContactViewModel) => {
        this.activeModal.close(response);
      });
    }
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }

    this.validateContactInformations(form);
  }

  onDepartmentChange(departments: DepartmentViewModel[]) {
    const departmentControls = <FormArray>this.form.controls['departments'];

    while (departmentControls.length !== 0) {
      departmentControls.removeAt(0);
    }

    departments.forEach(department => {
      const formGrp = this.formBuilder.group({id: [department.id], name: [department.name]});
      departmentControls.push(formGrp);
    });
  }

  initAddresses(addresses: AddressViewModel[]) {
    this.addresses = new Array<AddressViewModel>();

    const emptyAddress = new AddressViewModel();
    emptyAddress.id = '-1';
    emptyAddress.description = 'New';

    this.addresses.push(emptyAddress);
    addresses.forEach(adr => {
      this.addresses.push(adr);
    });
  }

  onAddressChange(address: AddressViewModel) {
    if (address.id != this.currentAddressId) {
      this.currentAddressId = address.id;
      const newAddress = Object.assign({}, address);
      newAddress.id = null;
      newAddress.isEdit = false;
      this.selectedAddressText = address.description;
      this.form.controls['address'].setValue(newAddress);
    }
  }

  logoChanged(file) {
    this.form.controls['logo'].setValue(file);
  }

  onAddressChanged(event) {
    this.addressChangedSubject.next(true);
  }

  private validateContactInformations(form) {
    const contactExternalLinks = form.get('contactExternalLinks') as FormArray;
    for (let i = 0; i < contactExternalLinks.controls.length; i++) {
      const formGroupLinks = contactExternalLinks.controls[i] as FormGroup;
      const linkValue = formGroupLinks.controls.value;
      if ((linkValue && linkValue.dirty && !linkValue.valid) || (linkValue && this.isSubmitted && !linkValue.valid)) {
        for (const key in formGroupLinks.controls.value.errors) {
          this.formErrors['contactExternalLinks' + i] = this.validationMessages['contactExternalLinks'][key];
        }
      }
    }
    const contactPhoneNumbers = form.get('contactPhoneNumbers') as FormArray;
    for (let j = 0; j < contactPhoneNumbers.controls.length; j++) {
      const formGroupNumbers = contactPhoneNumbers.controls[j] as FormGroup;
      const numberValue = formGroupNumbers.controls.value;
      if ((numberValue && numberValue.dirty && !numberValue.valid) || (numberValue && this.isSubmitted && !numberValue.valid)) {
        for (const key in formGroupNumbers.controls.value.errors) {
          this.formErrors['contactPhoneNumbers' + j] = this.validationMessages['contactPhoneNumbers'][key];
        }
      }
    }
  }

}
