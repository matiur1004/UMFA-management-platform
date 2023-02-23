import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { UmfaUtils } from '@core/utils/umfa.utils';
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
    private _ufUtils: UmfaUtils
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
        this.pageTitle = `Edit User: ${this.amrUser.ScadaUserName}`;
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      Id: [0],
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
  }

  async openModal(id: string) {
    var pwd = (await this.usrService.decryptWrapper(this.amrUser.ScadaPassword)).toString();
    this._matDialog.open(AmrUserPasswordComponent, {autoFocus: false, data: {currentPassword: pwd}})
      .afterClosed()
      .subscribe(async (res) =>  {
        if(res) {
          this.amrUser.ScadaPassword = res['newPwd'];
          try {
            this.amrUser = await lastValueFrom(this.usrService.changePwd(this.amrUser));
            this.getAmrScadaUser(this.amrUser.Id);
            this.snackBarService.passDataToSnackComponent({ msg: 'Password Changed', style: 'success' });
          } catch (e: any) {
            this.errMessage = e.message;
          }
        } 
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
    }
    else {
      this.snackBarService.passDataToSnackComponent({ msg: msg, style: style });
    }
  }

  async saveAmrUser() {
    if(this.form.valid) {
      const asu = {...this.amrUser, ...this.form.value};
      asu.ScadaPassword = (await this.usrService.encryptWrapper(asu.ScadaPassword)).toString();

      const dialogRef = this._ufUtils.fuseConfirmDialog(
        CONFIRM_MODAL_CONFIG,
        '', 
        `Are you sure you want to save?`);
      dialogRef.afterClosed().subscribe((result) => {
        if(result == 'confirmed') {
          this.usrService.updateAmrScadaUser(this.opUsrId, asu).subscribe({
            next: () => {
              this.onSaveComplete();
            },
            error: err => this.errMessage = err
          });
        } else {
        }
      });
    }
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

  onSaveComplete() {
    this.form.reset();
    this.getAmrScadaUser(this.amrUser.Id);
    this.router.navigate(['/admin']);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
