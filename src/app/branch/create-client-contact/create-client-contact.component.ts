import {Component, OnInit} from '@angular/core';
import {ClientService} from 'app/branch/clients/shared/client.service';
import {AddressViewModel, ContactInformationType, ContactViewModel, DepartmentViewModel} from '@models';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

@Component({
  selector: 'create-client-contact',
  templateUrl: './create-client-contact.component.html',
  styleUrls: ['./create-client-contact.component.less'],
  providers: [ClientService]
})
export class CreateClientContactComponent implements OnInit {

  isNew: boolean = true;
  clientId: string;
  form: FormGroup;
  isSubmitted: boolean = false;
  selectedAddressText: string = 'New';
  addresses: AddressViewModel[] = new Array<AddressViewModel>();
  currentAddressId: string = '-1';
  contactExternalLinkTypes: string[] = ContactInformationType.externalLinkLabels();
  contactPhoneNumberTypes: string[] = ContactInformationType.phoneContactLabels();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  selectedDepartmentsIds: string[] = new Array<string>();
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
      'pattern': 'Email is not in the correct format'
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

  constructor(private activeModal: NgbActiveModal, private clientService: ClientService, private formBuilder: FormBuilder) {
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
    this.clientService.getDepartments().subscribe((departments) => {
      this.departments = departments;
      this.selectedDepartmentsIds = this.getDepartmentsIds();
    });
  }

  getDepartmentsIds() {
    return this.model.departments.map(department => department.id);
  }

  createForm() {
    let emptyAddress = new AddressViewModel();
    emptyAddress.id = '-1';
    emptyAddress.description = 'New';
    this.addresses.push(emptyAddress);

    this.form = this.formBuilder.group({
      id: [this.model.id],
      fullName: [this.model.fullName, Validators.required],
      email: [this.model.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
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
    let control = this.formBuilder.group({
      label: [ContactInformationType.externalLinkLabels()[0]],
      value: ['', Validators.required]
    });
    this.contactExternalLinks.push(control);
  }

  onRemoveExternalLink(idx) {
    this.contactExternalLinks.removeAt(idx);
  }

  onAddPhoneNumber() {
    let control = this.formBuilder.group({
      label: [ContactInformationType.phoneContactLabels()[0]],
      value: ['', [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]]
    });
    this.contactPhoneNumbers.push(control);
  }

  onRemovePhoneNumber(idx) {
    this.contactPhoneNumbers.removeAt(idx);
  }

  getDepartments() {
    return this.model.departments.map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  onSave() {
    this.submitNotify.next();
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    let contactInfo = this.contactInformations;

    this.contactPhoneNumbers.controls.forEach(element => {
      contactInfo.push(element);
    });

    this.contactExternalLinks.controls.forEach(element => {
      contactInfo.push(element);
    });

    if (this.isNew) {
      this.clientService.createContact(this.clientId, this.form.value).subscribe(response => {
        this.activeModal.close(true);
      });
    } else {
      this.clientService.updateContact(this.clientId, this.model.id, this.form.value).subscribe(response => {
        this.activeModal.close(true);
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

    this.validateContactInformations(form);
  }

  onDepartmentChange(departments: DepartmentViewModel[]) {
    let departmentControls = <FormArray>this.form.controls['departments'];

    while (departmentControls.length !== 0) {
      departmentControls.removeAt(0);
    }

    departments.forEach(department => {
      let formGrp = this.formBuilder.group({id: [department.id], name: [department.name]});
      departmentControls.push(formGrp);
    });
  }

  initAddresses(addresses: AddressViewModel[]) {
    this.addresses = new Array<AddressViewModel>();

    let emptyAddress = new AddressViewModel();
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
      let newAddress = Object.assign({}, address);
      newAddress.id = null;
      newAddress.isEdit = false;
      this.selectedAddressText = address.description;
      this.form.controls['address'].setValue(newAddress);
    }
  }

  logoChanged(file) {
    this.form.controls['logo'].setValue(file);
  }

  private validateContactInformations(form) {
    let contactExternalLinks = form.get('contactExternalLinks') as FormArray;
    for (let i = 0; i < contactExternalLinks.controls.length; i++) {
      let formGroupLinks = contactExternalLinks.controls[i] as FormGroup;
      let linkValue = formGroupLinks.controls.value;
      if ((linkValue && linkValue.dirty && !linkValue.valid) || (linkValue && this.isSubmitted && !linkValue.valid)) {
        for (let key in formGroupLinks.controls.value.errors) {
          this.formErrors['contactExternalLinks' + i] = this.validationMessages['contactExternalLinks'][key];
        }
      }
    }
    let contactPhoneNumbers = form.get('contactPhoneNumbers') as FormArray;
    for (let j = 0; j < contactPhoneNumbers.controls.length; j++) {
      let formGroupNumbers = contactPhoneNumbers.controls[j] as FormGroup;
      let numberValue = formGroupNumbers.controls.value;
      if ((numberValue && numberValue.dirty && !numberValue.valid) || (numberValue && this.isSubmitted && !numberValue.valid)) {
        for (let key in formGroupNumbers.controls.value.errors) {
          this.formErrors['contactPhoneNumbers' + j] = this.validationMessages['contactPhoneNumbers'][key];
        }
      }
    }
  }

}
