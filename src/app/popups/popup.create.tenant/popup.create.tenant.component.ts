import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TenantService} from '@services';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ContactInformationType} from '@models';
import {TenantViewModel} from 'app/shared/models/tenant.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'popup-create-tenant',
  templateUrl: './popup.create.tenant.component.html',
  styleUrls: ['./popup.create.tenant.component.less']
})
export class PopupCreateTenantComponent implements OnInit {

  isNew: boolean = true;
  buildingId: string;
  form: FormGroup;
  isSubmitted: boolean = false;
  contactExternalLinkTypes: string[] = ContactInformationType.externalLinkLabels();
  contactPhoneNumberTypes: string[] = ContactInformationType.phoneContactLabels();
  submitNotify = new Subject<any>();
  nationalTenantsList: any;

  constructor(
    public activeModal: NgbActiveModal,
    private tenantService: TenantService,
    private formBuilder: FormBuilder
  ) {
  }

  private _model: TenantViewModel;

  public get model(): TenantViewModel {
    return this._model;
  }

  public set model(v: TenantViewModel) {
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
  }

  createForm() {

    this.form = this.formBuilder.group({
      id: [this.model.id],
      buildingId: [this.buildingId],
      name: [this.model.name, Validators.required],
      email: [this.model.email, [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/)]],
      nationalTenantId: [this.model.nationalTenantId],
      phone: [this.model.phone, [Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
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
    });
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

  onSave() {
    this.submitNotify.next();
    if (!this.form.valid) {
      this.isSubmitted = true;
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
      this.tenantService.create(this.buildingId, this.form.value).subscribe(response => {
        this.activeModal.close(true);
      });
    } else {
      this.tenantService.update(this.buildingId, this.model.id, this.form.value).subscribe(response => {
        this.activeModal.close(true);
      });
    }
  }

  onCancel() {
    this.activeModal.dismiss();
  }

}
