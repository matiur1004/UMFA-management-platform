import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserAccountService} from '../../../shared/services/user-account.service';
import {UserAccountViewModel} from '../../../shared/models/user-account.model';
import {AuthService, DataService} from '@services';
import {forkJoin, Subject} from 'rxjs';
import {Location} from '@angular/common';
import {ContactInformationType, DepartmentViewModel} from '@models';


@Component({
  selector: 'user-general-info',
  templateUrl: './user-general-info.component.html',
  styleUrls: ['./user-general-info.component.less']
})
export class UserGeneralInfoComponent implements OnInit {

  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  selecedDepartmentIds: string[] = new Array<string>();
  contactInformationTypes: string[] = ContactInformationType.externalLinkLabels();
  isSubmitted: boolean = false;
  form: FormGroup;
  logoUrl: string = null;
  submitNotify = new Subject<any>();
  formErrors = {
    "fullName": '',
    "phone": '',
    "email": '',
    "departmentIds": ''
  }
  validationMessages = {
    "fullName": {
      "required": "Name is required",
    },
    "phone": {
      "required": "Phone is required",
      "pattern": "Phone number not in the correct format"
    },
    "email": {
      "required": "Email is required",
      "pattern": "Email address not in the correct format"
    },
    "departmentIds": {
      "required": "Department is required",
    },
  }

  constructor(private userAccountService: UserAccountService, private fb: FormBuilder, private location: Location,
              private authService: AuthService, private dataService: DataService) {

  }

  get defaultLogo(): string {
    return '../../../assets/images/icons/user-photo.png';
  }

  get contactInformations(): FormArray {
    return this.form.get('contactInformations') as FormArray;
  }

  ngOnInit() {
    this.createForm(new UserAccountViewModel());

    let userAccount = this.userAccountService.get();
    let departments = this.userAccountService.getDepartments();

    let join = forkJoin(userAccount, departments);
    join.subscribe(result => {
      let userAccount = result[0];
      this.departments = result[1];
      this.selecedDepartmentIds = userAccount.departmentIds;

      this.logoUrl = this.authService.getLogoUrl();

      this.createForm(userAccount);
    });
  }

  departmentsChanged() {
    let departmentIds = <FormArray>this.form.controls["departmentIds"];

    while (departmentIds.length !== 0) {
      departmentIds.removeAt(0)
    }

    this.selecedDepartmentIds.forEach(id => {
      departmentIds.push(this.fb.control(id));
    });

  }

  createForm(model: UserAccountViewModel) {
    this.form = this.fb.group({
      id: [model.id],
      fullName: [model.fullName, Validators.required],
      departmentIds: this.fb.array(model.departmentIds.map(c => this.fb.control(c))),
      phone: [model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
      email: [model.email, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      address: [model.address],
      description: [model.description],
      contactInformations: this.fb.array(model.contactInformations.map(ci => this.fb.group({
        id: ci.id,
        label: ci.label,
        value: ci.value
      }))),
      logo: [null]
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  save() {
    this.submitNotify.next();
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    this.userAccountService.update(this.form.value).subscribe(response => {
      this.authService.setFullName(this.form.value.fullName);
      this.dataService.userUpdated();
      this.location.back();
    });
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

  addExternalLink() {
    let control = this.fb.group({label: ContactInformationType.externalLinkLabels()[0], value: ''});
    this.contactInformations.push(control);
  }

  removeExternalLink(idx) {
    this.contactInformations.removeAt(idx);
  }

  logoChanged(file) {
    this.form.controls["logo"].setValue(file);
  }

}
