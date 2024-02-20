import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressViewModel} from 'app/shared/models/address.model';
import {AddressComponent} from '../../../widgets/address/address.component';
import {ClientViewModel} from '../shared/client.model';
import {ContactInformationType} from '@models';
import {Subject} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../shared/client.service';


@Component({
  selector: 'client-general-info',
  templateUrl: './client-general-info.component.html',
  styleUrls: ['./client-general-info.component.less']
})
export class ClientGeneralInfoComponent {
  @ViewChild('editAddressCmp') editAddressCmp: AddressComponent;
  @Output() submit: EventEmitter<ClientViewModel> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Input() isNew: boolean;
  isSubmitted: boolean = false;
  form: FormGroup;
  src = "assets/images/upload-file/upload-image.svg";
  contactInformationTypes: string[] = ContactInformationType.externalLinkLabels();
  submitNotify = new Subject<any>();
  formErrors = {
    "name": '',
    "phone": '',
    "registrationNumber": '',
    "vatNumber": '',
    "email": '',
    "addresses": ''
  }
  validationMessages = {
    "name": {
      "required": "Name is required",
    },
    "phone": {
      "required": "Phone is required",
      "pattern": "Phone number is not in the correct format"
    },
    "email": {
      "required": "Email is required",
      "pattern": "Email is not in the correct format"
    },
    "registrationNumber": {
      "required": "Registration Number is required"
    },
    "vatNumber": {
      "required": "Vat Number is required"
    },
    "addresses": {
      "required": "At least one Address should be selected"
    }
  }
  editAddress: boolean;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private clientService: ClientService) {
  }

  private _model: ClientViewModel;

  get model(): ClientViewModel {
    return this._model;
  }

  @Input() set model(value: ClientViewModel) {
    if (value.addresses.length == 0)
      value.addresses.push(new AddressViewModel());

    this._model = value;
    this.createForm();
  }

  get addresses(): FormArray {
    return this.form.get('addresses') as FormArray;
  }

  get contactInformations(): FormArray {
    return this.form.get('contactInformations') as FormArray;
  }

  createForm() {
    let addresss = new AddressViewModel();
    addresss.line1 = '';

    this.form = this.formBuilder.group({
      id: [this.model.id],
      name: [this.model.name, Validators.required],
      phone: [this.model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
      registrationNumber: [this.model.registrationNumber],
      vatNumber: [this.model.vatNumber],
      email: [this.model.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      addresses: this.formBuilder.array(this.model.addresses.map(address => this.formBuilder.control(address)), Validators.required),
      logo: this.model.logo,
      contactInformations: this.formBuilder.array(this.model.contactInformations.map(ci => this.formBuilder.group({
        id: ci.id,
        label: ci.label,
        value: ci.value
      })))
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;
    Object.assign(this.model, this.form.value);

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

  onSubmit() {
    this.submitNotify.next();
    this.isSubmitted = true;
    if (!this.form.valid) {
      this.onValueFormChange();
      return;
    }

    Object.assign(this.model, this.form.value);

    let model = this.form.value as ClientViewModel;
    model.logoUrl = this.model.logoUrl;

    this.submit.emit(model);
  }

  onCancel() {
    this.cancel.emit(null);
  }

  onAddAddress() {
    let control = this.formBuilder.control(new AddressViewModel());
    this.addresses.push(control);
  }

  onRemoveAddress(idx) {
    this.addresses.removeAt(idx);
  }

  addExternalLink() {

    let control = this.formBuilder.group({label: ContactInformationType.externalLinkLabels()[0], value: ''});
    this.contactInformations.push(control);
  }

  onRemoveContact(idx) {
    this.contactInformations.removeAt(idx);
  }

  logoChanged(file) {
    this.model.logo = file;
    this.form.controls["logo"].setValue(file);
  }
}
