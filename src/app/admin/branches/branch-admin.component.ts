import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {NotificationService} from '@services';

import {BranchUserViewModel, BranchViewModel} from './models/branch.model';
import {BranchService} from './branch.service';

@Component({
  selector: 'branch-admin',
  templateUrl: './branch-admin.component.html',
  styleUrls: ['./branch-admin.component.less']
})
export class CreateBranchAdminComponent implements OnInit {

  @Input() model: BranchViewModel;
  @Input() isNew: boolean;

  @Output() onNext = new EventEmitter<number>();
  @Output() onDismiss = new EventEmitter<Event>();
  newUser: boolean;
  form: FormGroup;
  usersCollection: any[] = [];
  users: any[] = [];
  selectedAdmins: any[] = [];
  formErrors = {
    'fullName': '',
    'email': ''
  };
  validationMessages = {
    'fullName': {
      'required': 'Name is required',
    },
    'email': {
      'required': 'Email is required',
      'pattern': 'Email address not in the correct format',
      'used': 'User with this email already exists'
    }
  };
  private tabIndex = 1;
  private isSubmitted = false;

  constructor(private formBuilder: FormBuilder, private notificationService: NotificationService, private branchService: BranchService) {
  }

  get defalutLogo(): string {
    return '../../../assets/images/icons/user-photo.png';
  }

  ngOnInit() {
    this.newUser = false;
    this.createForm();
    this.getUsers();
  }

  createForm() {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      logo: [null]
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));

  }

  next() {
    if (this.model.admins.length == 0) {
      this.notificationService.error('At least one Branch Admin should be assigned');
      return;
    }

    this.onNext.emit(this.tabIndex + 1);
  }

  createNewUser() {
    if (this.newUser) {
      return;
    }
    this.form.reset();
    this.newUser = true;
    this.isSubmitted = false;
    this.onValueFormChange();
  }

  submit() {
    this.branchService.findUser(this.form.value.email).subscribe(exist => {
      if (exist) {
        this.formErrors['email'] = this.validationMessages.email.used;
      } else {
        this.insertNewUser();
      }
    });
  }

  insertNewUser() {
    this.isSubmitted = true;

    if (this.form.valid && this.isNew) {
      this.model.admins.push(this.form.value);
      this.form.reset();
      this.newUser = false;
    } else if (this.form.valid) {
      this.branchService.createAdmin(this.form.value, this.model.id).subscribe((user) => {
        user.logoUrl = this.branchService.getAdminLogoUrl(user.id);
        this.model.admins.push(user);
        this.form.reset();
        this.newUser = false;
      });
    } else {
      this.onValueFormChange();
    }
  }

  cancelCreateUser() {
    this.newUser = false;
  }

  removeNewUser(idx) {
    this.updateAdminUser(idx);
  }

  removeNewUserFromSelect(adminUser: any) {
    const idx = this.model.admins.findIndex(a => a.id === adminUser.id);

    this.updateAdminUser(idx);
  }

  dismiss() {
    this.onDismiss.emit();
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
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => (term.length < 2) ? [] : this.branchService.getUsers(term))
    );

  formatter(x: BranchUserViewModel) {
    return x.fullName;
  }

  logoChanged(file) {
    this.form.controls['logo'].setValue(file);
  }

  getUsers() {
    this.branchService.getUsers('').subscribe(data => {
      this.usersCollection = data;
      this.users = data;
    });
  }

  addSelectedUsers() {
    const adminsIds = this.model.admins.map(admin => admin.id);
    this.selectedAdmins.forEach(item => {
      if (adminsIds.indexOf(item.id) === -1) {
        const branchAdmin = new BranchUserViewModel();
        branchAdmin.id = item.id;
        branchAdmin.fullName = item.fullName;
        branchAdmin.email = item.email;
        branchAdmin.logoUrl = item.logoUrl;

        if (this.isNew) {
          this.model.admins.push(branchAdmin);
        } else {
          this.branchService.addAdmin(branchAdmin, this.model.id).subscribe(() => {
            this.model.admins.push(branchAdmin);
          });
        }
      }
    });
    this.filterUsersCollection(this.selectedAdmins);
  }

  filterUsersCollection(selectedAdmins) {
    const selectedAdminsIds = selectedAdmins.map(admin => admin.id);
    this.users = this.usersCollection.filter(item => selectedAdminsIds.indexOf(item.id) === -1);
  }

  private updateAdminUser(idx) {
    const admin = this.model.admins[idx];

    if (this.isNew || admin.id == null) {
      this.model.admins.splice(idx, 1);
    } else {
      this.branchService.removeAdmin(this.model.id, admin.id).subscribe(() => {
        this.model.admins.splice(idx, 1);
      });
    }
    this.filterUsersCollection(this.model.admins);
  }

}
