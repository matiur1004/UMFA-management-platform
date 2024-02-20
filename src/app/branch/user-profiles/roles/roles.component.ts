import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';

import {BranchManagerService, UserProfileService} from '@services';
import {PagingViewModel, PermissionViewModel, RoleDetailViewModel, RoleViewModel} from '@models';

@Component({
  selector: 'user-profile-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.less']
})
export class RolesComponent implements OnInit, OnDestroy {

  @Input() searchTermsSubject = new Subject<string>();

  model: PagingViewModel<RoleViewModel> = new PagingViewModel<RoleViewModel>();
  role: RoleDetailViewModel = null;
  preRoleId: string = null;

  isNew: boolean = false;

  form: FormGroup;
  isSubmitted: boolean = false;

  pageSize: number = 10;
  page: number = 1;
  formErrors = {
    "name": '',
    "description": ''
  }
  validationMessages = {
    "name": {
      "required": "Name is required",
    },
    "description": {
      "maxlength": "Description cannot be more than 500 characters"
    },
  }
  private branchSubscruber: Subscription;
  private searchTermsSubscriber: Subscription;
  private searchTerms: string = '';

  constructor(private userProfileService: UserProfileService, private branchManagerService: BranchManagerService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.loadData();
    });

    this.searchTermsSubscriber = this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.searchTermsSubscriber.unsubscribe();
  }

  setPage(page: number) {
    this.page = page;
    this.loadData();
  }

  loadData() {
    this.userProfileService.getRoles(this.searchTerms, this.page * this.pageSize - this.pageSize, this.pageSize).subscribe((roles) => {
      this.model = roles;
      if (this.isNew)
        return;
      this.preRoleId = null;
      if (roles.total > 0) {
        this.onRoleSelected(this.model.items[0]);
      } else {
        this.role = null;
      }
    }, err => {
      this.model = new PagingViewModel<RoleViewModel>();
      this.resetCreateRole();
      this.role = null;
    });
  }

  onAddRole() {
    this.userProfileService.getPermissions().subscribe((permissions) => {
      let role = new RoleDetailViewModel();
      role.canEdit = true;
      role.name = 'New Role';
      role.permissions = permissions;
      this.isNew = true;

      this.model.items.forEach(r => r.isSelected = false);

      this.createForm(role);

      this.isSubmitted = false;
      this.onValueFormChange();
    });
  }

  createForm(role: RoleDetailViewModel) {
    this.role = role;
    if (!this.form) {
      this.form = this.formBuilder.group({
        name: [role.name, Validators.required],
        description: [role.description, Validators.maxLength(500)]
      });

      this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
    } else {
      this.form.controls['name'].setValue(role.name);
      this.form.controls['description'].setValue(role.description);
    }
  }

  onCancel() {
    this.resetCreateRole();
    if (this.preRoleId && this.model.total) {
      this.onRoleSelected(this.model.items.find(r => r.id == this.preRoleId));
    } else if (this.model.total) {
      this.onRoleSelected(this.model.items[0]);
    } else {
      this.role = null;
    }
  }

  onRoleSelected(role: RoleViewModel) {
    if (this.role && role.id == this.role.id)
      return;

    this.userProfileService.getById(role.id).subscribe((roleDetail) => {
      if (this.role)
        this.preRoleId = this.role.id;
      else
        this.preRoleId = null;

      this.createForm(roleDetail);
      this.resetCreateRole();

      this.model.items.forEach(r => r.isSelected = false);
      role.isSelected = true;
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    Object.assign(this.role, this.form.value);

    this.userProfileService.create(this.role).subscribe((role) => {
      this.model.total++;

      let newRole = new RoleViewModel();
      newRole.id = role.id;
      newRole.name = role.name;
      newRole.isSelected = true;
      newRole.canEdit = true;

      let newRoles = this.model.items.map(r => Object.assign({}, r));
      newRoles.push(newRole);

      newRoles = newRoles.sort(function (a, b) {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });

      this.model.items = newRoles.slice(0, 10);
      this.isNew = false;
    });
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && (this.isSubmitted || this.isNew) && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  onRoleUpdate() {
    if (this.form.valid) {
      let role = new RoleDetailViewModel();
      role.id = this.role.id;
      role.name = this.form.value.name;
      role.description = this.form.value.description;
      this.userProfileService.update(role.id, role).subscribe(response => {
        let roleUpdate = this.model.items.find(r => r.id == this.role.id);
        if (roleUpdate)
          roleUpdate.name = role.name;
      });
    } else {
      this.onValueFormChange();
    }
  }

  onValueChanged(permission: PermissionViewModel) {
    if (!this.role.canEdit)
      return;

    permission.isActive = !permission.isActive;
    if (!this.isNew)
      this.userProfileService.update(this.role.id, this.role).subscribe();
  }

  resetCreateRole() {
    this.isNew = false;
    this.isSubmitted = false;
  }
}
