import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConstants } from 'app/core/helpers';
import { IAmrUser } from 'app/core/models';
import { DialogService } from 'app/shared/services/dialog.service';
import { ModalService } from 'app/shared/services/modal.service';
import { SnackBarService } from 'app/shared/services/snack-bar.service';
import { UserService } from 'app/shared/services/user.service';
import { lastValueFrom, Observable } from 'rxjs';
import { AmrUserPasswordComponent } from '../amr-user-password/amr-user-password.component';


function pwdMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const newPwd = c.get('newPwd');
  const confPwd = c.get('confPwd');

  if (newPwd.pristine || confPwd.pristine) return null;

  if (newPwd.value === confPwd.value) return null;

  return { match: true };
}

function checkPwd(pwd: string): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (c.value != pwd)) {
      //console.log(pwd);
      return { check: true };
    }
    return null;
  };
}

@Component({
  templateUrl: './amr-user-edit.component.html',
  styleUrls: ['./amr-user-edit.component.scss']
})
export class AmrUserEditComponent implements OnInit {

  pageTitle = 'Edit Amr Scada User';

  fieldTextType: boolean;

  opUsrId: number;
  amrUser: IAmrUser;
  errMessage: string;
  errMessageModal: string;

  formChangePwd: FormGroup;
  form: FormGroup;
  
  constructor(private route: ActivatedRoute,
    private usrService: UserService,
    private router: Router,
    private modalService: ModalService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
    private _matDialog: MatDialog,
  ) { }

  getAmrScadaUser(id: number): void {
    this.usrService.getAmrScadaUser(id).subscribe({
      next: au => {
        this.onAmrScadaUserRetrieved(au)
        this.initForm();
      },
      error: err => this.errMessage = err
    });
  }

  initForm() {
    console.log(this.amrUser);
    if(this.amrUser) {
      this.form.patchValue(this.amrUser);
    }
  }

  async onAmrScadaUserRetrieved(aU: IAmrUser): Promise<void> {
    this.amrUser = aU;

    if (!this.amrUser) {
      this.pageTitle = 'User not found';
    } else {
      if (this.amrUser.Id === 0) {
        this.pageTitle = 'Add New User';
      } else {
        var pwd = (await this.usrService.decryptWrapper(aU.ScadaPassword)).toString();
        this.pageTitle = `Edit User: ${this.amrUser.ScadaUserName}`;
        this.formChangePwd.controls['currPwd'].clearValidators();
        this.formChangePwd.controls['currPwd'].setValidators([Validators.required, Validators.minLength(3), checkPwd(pwd)])
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      ProfileName: [null, [Validators.required, Validators.minLength(3)]],
      ScadaUserName: [null, [Validators.required, Validators.minLength(3)]],
      SgdUrl: [null, [Validators.required, Validators.minLength(3)]],
      ScadaPassword: [null, [Validators.required, Validators.minLength(3)]]
    });

    this.route.paramMap.subscribe(
      (params) => {
        this.opUsrId = +params.get('opId');
        const id = +params.get('asuId');
        this.getAmrScadaUser(id);
      });
    this.buildChangePwdForm();
  }

  openModal(id: string) {
    //this.modalService.open(id);
    this._matDialog.open(AmrUserPasswordComponent, {autoFocus: false, data: {}})
      .afterClosed()
      .subscribe((res) => {

      });
  }

  closeModalNoMsg(id: string) {
    this.errMessageModal = '';
    this.formChangePwd.clearValidators;
    this.formChangePwd.reset();
    this.modalService.close(id);
  }

  closeModal(id: string, msg?: string, style?: string) {
    this.errMessageModal = '';
    this.formChangePwd.clearValidators;
    this.formChangePwd.reset();
    this.modalService.close(id);
    if (!msg && !style) {
      this.snackBarService.passDataToSnackComponent({ msg: 'Operation Cancelled', style: style });
      //this.snackBarService.openSnackBar('Hello...', 'Close')
    }
    else {
      this.snackBarService.passDataToSnackComponent({ msg: msg, style: style });
      //this.snackBarService.openSnackBar('Hello...', 'Close')
    }
  }

  async changePwd(id: string) {
    var pwd = this.formChangePwd.get('pwdGroup.newPwd').value;
    this.closeModalNoMsg(id);
    const dialData = DialogConstants.updateDialog;
    this.dialogService.confirmDialog(dialData).subscribe({
      next: async resp => {
        if (resp) {
          this.amrUser.ScadaPassword = pwd;
          try {
            this.amrUser = await lastValueFrom(this.usrService.changePwd(this.amrUser));
            this.getAmrScadaUser(this.amrUser.Id);
            this.snackBarService.passDataToSnackComponent({ msg: 'Password Changed', style: 'success' });
          } catch (e: any) {
            this.errMessage = e.message;
          }
        } else this.snackBarService.passDataToSnackComponent({ msg: 'Operation Cancelled', style: 'cancel' });
      },
      error: err => this.errMessage = err
    });
  }

  private buildChangePwdForm(): void {
    this.formChangePwd = this.fb.group({
      currPwd: ['', [Validators.required, Validators.minLength(3)]],
      pwdGroup: this.fb.group({
        newPwd: ['', [Validators.required, Validators.minLength(3)]],
        confPwd: ['', Validators.required],
      }, { validator: pwdMatcher }),
    });
  }

  async saveAmrUser() {
    // if (amrScadaUserForm.valid) {
    //   if (amrScadaUserForm.dirty) {
    //     const asu = { ...this.amrUser, ...amrScadaUserForm.value };
    //     asu.scadaPassword = (await this.usrService.encryptWrapper(asu.scadaPassword)).toString();
    //      if (asu.id === 0) {
    //       const dialDataCreate = DialogConstants.createDialog;
    //       this.dialogService.confirmDialog(dialDataCreate).subscribe({
    //         next: resp => {
    //           if (resp) {
    //             this.usrService.updateAmrScadaUser(this.opUsrId, asu).subscribe({
    //               next: () => {
    //                 this.onSaveComplete(amrScadaUserForm);
    //                 this.snackBarService.passDataToSnackComponent({ msg: 'New User Created', style: 'success' });
    //               },
    //               error: err => this.errMessage = err
    //             });
    //           } else this.snackBarService.passDataToSnackComponent({ msg: 'Operation Cancelled', style: 'cancel' });
    //         },
    //         error: err => this.errMessage = err
    //       });
    //     } else {
    //       const dialDataUpdate = DialogConstants.updateDialog;
    //       this.dialogService.confirmDialog(dialDataUpdate).subscribe({
    //         next: resp => {
    //           if (resp) {
    //             this.usrService.updateAmrScadaUser(this.opUsrId, asu).subscribe({
    //               next: () => {
    //                 this.onSaveComplete(amrScadaUserForm);
    //                 this.snackBarService.passDataToSnackComponent({ msg: 'User Saved', style: 'success' });
    //               },
    //               error: err => this.errMessage = err
    //             });
    //           } else this.snackBarService.passDataToSnackComponent({ msg: 'Operation Cancelled', style: 'cancel' });
    //         },
    //         error: err => this.errMessage = err
    //       });
    //     }
    //   } else {
    //     this.snackBarService.passDataToSnackComponent({ msg: 'No Changes to apply', style: 'cancel' });
    //     this.onSaveComplete(amrScadaUserForm);
    //   }
    // } else {
    //   this.errMessage = 'Please correct the validation errors.'
    // }
  }

  deleteAmrUser() {
    const dialDataDel = DialogConstants.deleteDialog;
    this.dialogService.confirmDialog(dialDataDel).subscribe({
      next: resp => {
        if (resp) {
          this.usrService.deleteAmrScadaUser(this.opUsrId, this.amrUser).subscribe({
            next: () => {
              this.getAmrScadaUser(this.amrUser.Id);
              this.router.navigate(['/admin']);
              this.snackBarService.passDataToSnackComponent({ msg: 'User Removed', style: 'success' });
            },
            error: err => this.errMessage = err
          });
        }
      },
      error: err => this.errMessage = err
    });
  }

  onSaveComplete(frmPassed: NgForm) {
    frmPassed.reset();
    this.getAmrScadaUser(this.amrUser.Id);
    this.router.navigate(['/admin']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
