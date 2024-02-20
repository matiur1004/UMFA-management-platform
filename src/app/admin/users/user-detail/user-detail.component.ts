import {Component, Input, OnInit} from '@angular/core';
import {AddressHomeViewModel, ContactInformationType, DepartmentViewModel} from '@models';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {UserService} from '../shared/user.service';
import {UserDetailViewModel} from '../shared/model/user.model';
import {BranchViewModel} from '../shared/model/branch.model';
import {RoleViewModel} from '../shared/model/role.model';

@Component({
  selector: 'user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.less']
})
export class UserDetailComponent implements OnInit {

  @Input() model: UserDetailViewModel;
  @Input() isNew: boolean;

  form: FormGroup;
  isSubmitted: boolean = false;

  contactInformationTypes: string[] = ContactInformationType.externalLinkLabels();
  departments: DepartmentViewModel[] = new Array<DepartmentViewModel>();
  branches: BranchViewModel[] = new Array<BranchViewModel>();
  roles: RoleViewModel[] = new Array<RoleViewModel>();

  selectedDepartmentsIds: string[] = new Array<string>();
  selectedBranchesIds: string[] = new Array<string>();
  selectedRoleText: string = "Select role";

  branchAdminRoleName: string = "Branch Admin";
  isBranchesDisabled = true;

  submitNotify = new Subject<any>();

  formErrors = {
    "fullName": '',
    "phone": '',
    "registrationNumber": '',
    "vatNumber": '',
    "email": '',
    "departments": ''
  }

  validationMessages = {
    "fullName": {
      "required": "Name is required",
    },
    "phone": {
      "required": "Phone is required",
      "pattern": "Phone number is not in the correct format"
    },
    "email": {
      "required": "Email is required",
      "email": "Email is not in the correct format"
    },
    "departments": {
      "required": "Department is required",
    },
    "contactInformations": {
      "required": "Value is required",
    }
  }
  file: any;

  constructor(private activeModal: NgbActiveModal, private userService: UserService, private formBuilder: FormBuilder) {
  }

  get contactInformations(): FormArray {
    return this.form.get('contactInformations') as FormArray;
  }

  ngOnInit() {
    this.userService.getBranches().subscribe(response => {
      this.branches = response;
      this.selectedBranchesIds = this.getBranchesIds();
      if (!this.isNew) {
        this.branches = this.branches.map(b => {
          b.isSelected = this.model.branches.find(m => m.id == b.id) != null;
          return b;
        });
      }
    });

    this.userService.getRoles('', 0, 2000).subscribe(response => {
      this.roles = response.items;
    });

    this.userService.getDepartments().subscribe(response => {
      this.departments = response;
      this.selectedDepartmentsIds = this.getDepartmentsIds();
      if (!this.isNew) {
        this.departments = this.departments.map(b => {
          b.isSelected = this.model.departments.find(m => m.id == b.id) != null;
          return b;
        });
      }
    });
    this.createForm();
  }

  getDepartmentsIds() {
    return this.model.departments.map(department => department.id);
  }

  getBranchesIds() {
    return this.model.branches.map(branch => branch.id);
  }

  createForm() {

    this.form = this.formBuilder.group({
      id: [this.model.id],
      fullName: [this.model.fullName, Validators.required],
      email: [this.model.email, [Validators.required, Validators.email]],
      phone: [this.model.phone, [Validators.required, Validators.pattern(/^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/)]],
      description: [this.model.description],
      address: [this.model.address ? this.model.address : new AddressHomeViewModel()],
      role: [this.model.role],
      branches: this.formBuilder.array(this.getBranches()),
      departments: this.formBuilder.array(this.getDepartments(), Validators.required),
      contactInformations: this.formBuilder.array(this.model.contactInformations.map(ci => this.formBuilder.group({
        id: [ci.id],
        label: [ci.label],
        value: [ci.value, Validators.required]
      }))),
      logo: [this.model.logo],
      isApproved: [this.model.isApproved]
    });

    if (this.model.role)
      this.isBranchesDisabled = this.model.role.name !== this.branchAdminRoleName;

    this.updateSelectedRoleText();
    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  onAddExternalLink() {
    let control = this.formBuilder.group({
      label: [ContactInformationType.externalLinkLabels()[0]], value: ['', Validators.required]
    });
    this.contactInformations.push(control);
  }

  onRemoveExternalLink(idx) {
    this.contactInformations.removeAt(idx);
  }

  getDepartments() {
    return this.model.departments.map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  getBranches() {
    return this.model.branches.map(d => this.formBuilder.group({id: [d.id], name: [d.name]}));
  }

  onSave() {
    this.submitNotify.next();

    this.isSubmitted = true;
    if (!this.form.valid) {
      this.onValueFormChange();
      return;
    }
    const formValue = this.form.value;
    const userModel = {
      ...formValue,
      branches: formValue.branches.map(b => b.id),
      departments: formValue.departments.map(b => b.id),
      roleId: formValue.role && formValue.role.id
    };

    if (this.isNew) {
      this.userService.createUser(userModel).subscribe(response => {
        this.activeModal.close(true);
      });
    } else {
      userModel.logoUrl = this.model.logoUrl;

      this.userService.updateUser(this.model.id, userModel).subscribe(response => {
        this.activeModal.close(true);
      });
    }
  }

  onCancel() {
    this.activeModal.close(false);
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

    this.validateContactInformations(form);
  }

  onDepartmentChange(departments: DepartmentViewModel[]) {
    let departmentControls = <FormArray>this.form.controls["departments"];

    while (departmentControls.length !== 0) {
      departmentControls.removeAt(0)
    }

    departments.forEach(department => {
      var formGrp = this.formBuilder.group({id: [department.id], name: [department.name]});
      departmentControls.push(formGrp);
    });
  }

  onBranchChange(branches: BranchViewModel[]) {
    let branchControls = <FormArray>this.form.controls['branches'];

    while (branchControls.length !== 0) {
      branchControls.removeAt(0)
    }

    branches.forEach(branch => {
      var formGrp = this.formBuilder.group({id: [branch.id], name: [branch.name]});
      branchControls.push(formGrp);
    });
  }

  onRoleChange(role: RoleViewModel) {
    const control = <FormControl>this.form.get('role');

    if (control.value) {
      if (control.value.id == role.id) {
        control.setValue(null);
      } else {
        control.setValue(role);
      }
    } else {
      control.setValue(role);
    }

    this.isBranchesDisabled = control.value.name !== this.branchAdminRoleName;
    this.updateSelectedRoleText();
  }

  updateSelectedRoleText() {
    const control = <FormControl>this.form.get('role');

    if (control.value)
      this.selectedRoleText = control.value.name;
    else
      this.selectedRoleText = "Select Role";
  }

  logoChanged(file) {
    this.form.controls["logo"].setValue(file);
  }

  private validateContactInformations(form) {
    let contactInformations = form.get('contactInformations') as FormArray;
    for (let i = 0; i < contactInformations.controls.length; i++) {
      let formGroup = contactInformations.controls[i] as FormGroup;
      let value = formGroup.controls.value;
      if ((value && value.dirty && !value.valid) || (value && this.isSubmitted && !value.valid)) {
        for (let key in formGroup.controls.value.errors) {
          this.formErrors['contactInformations' + i] = this.validationMessages['contactInformations'][key];
        }
      }
    }
  }

}
