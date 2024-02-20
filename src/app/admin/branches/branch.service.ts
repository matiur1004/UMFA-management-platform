import {Injectable} from '@angular/core';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

import {HttpHelperService} from '@services';

import {BranchUserViewModel, BranchViewModel} from './models/branch.model';
import {BankAccountViewModel, ContactInformationViewModel, PagingViewModel, UserViewModel} from '@models';

@Injectable()
export class BranchService {

  public phoneContactLabels = ['Mobile Number', 'Office Number', 'Fax'];
  public externalLinkLabels = ['Dropbox', 'Facebook', 'Google Drive', 'Hangouts', 'Linkedin', 'Skype', 'Twitter', 'Website', 'Whatsapp', 'Zoom', 'Other'];
  private readonly BRANCHES_FOR_ADMIN_URL: string = '/api/v1/branches/admin';
  private readonly BRANCHES_URL: string = '/api/v1/branches';
  private readonly BRANCH_URL: string = 'api/v1/branches/{0}';
  private readonly BRANCH_LOGO_URL: string = 'api/v1/branches/{0}/logo';
  private readonly BRANCH_ADMINS_URL: string = 'api/v1/branches/{0}/admins';
  private readonly BRANCH_ADMIN_LOGO_URL: string = 'api/v1/users/{0}/logo';
  private readonly BRANCH_USERS_URL: string = 'api/v1/branches/{0}/users';
  private readonly BRANCH_BANK_ACCOUNTS_URL: string = 'api/v1/branches/{0}/bank-accounts';
  private readonly BRANCH_BANK_ACCOUNT_CHANGE_URL: string = 'api/v1/branches/{0}/bank-accounts/{1}'
  private readonly BRANCH_CONTACT_INFORMATIONS_URL: string = 'api/v1/branches/{0}/contact-infomations';
  private readonly BRANCH_CONTACT_INFORMATION_CHANGE_URL: string = 'api/v1/branches/{0}/contact-infomations/{1}';
  private readonly USERS_SEARCH_URL: string = '/api/v1/users?searchKey={0}';
  private readonly USER_FIND_URL: string = '/api/v1/users/find-user/{0}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAll() {
    return this.httpHelperService.authJsonGet<BranchViewModel[]>(this.BRANCHES_FOR_ADMIN_URL).pipe(map(branches => {
      return branches;
    }));
  }

  public get(branchId: string) {

    return forkJoin([
      this.httpHelperService.authJsonGet<BranchViewModel>(this.BRANCH_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<BranchUserViewModel>(this.BRANCH_ADMINS_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<BankAccountViewModel>(this.BRANCH_BANK_ACCOUNTS_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<ContactInformationViewModel>(this.BRANCH_CONTACT_INFORMATIONS_URL.replace('{0}', branchId))
    ]).pipe(map((data: any[]) => {

      var branch: BranchViewModel = data[0];
      branch.admins = data[1];
      branch.bankAccounts = data[2];
      branch.contactInformations = data[3];
      branch.phoneContacts = branch.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      branch.externalLinks = branch.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));

      return branch;
    }));
  }

  public create(model: BranchViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<BranchViewModel>(this.BRANCHES_URL, model);
  }

  public update(model: BranchViewModel) {
    let updateModel = Object.assign({}, model);
    updateModel.contactInformations = [];
    updateModel.admins = [];
    updateModel.bankAccounts = [];

    return this.httpHelperService.authMultipartFormDataPost<BranchViewModel>(this.BRANCHES_URL, updateModel, null, false);
  }

  public addContactInformation(model: ContactInformationViewModel, branchId: string) {
    let url = this.BRANCH_CONTACT_INFORMATIONS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonPut<ContactInformationViewModel>(url, model, null, false);
  }

  public updateContactInformation(model: ContactInformationViewModel, branchId: string, contactInfoId: string) {
    let url = this.BRANCH_CONTACT_INFORMATION_CHANGE_URL.replace('{0}', branchId).replace('{1}', contactInfoId);
    return this.httpHelperService.authJsonPost<ContactInformationViewModel>(url, model, null, false);
  }

  public deleteContactInformation(branchId: string, contactInfoId: string) {
    let url = this.BRANCH_CONTACT_INFORMATION_CHANGE_URL.replace('{0}', branchId).replace('{1}', contactInfoId);
    return this.httpHelperService.authJsonDelete<ContactInformationViewModel>(url, null, false);
  }

  public addBankAccount(model: BankAccountViewModel, branchId: string) {
    let url = this.BRANCH_BANK_ACCOUNTS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonPut<BankAccountViewModel>(url, model, null, false);
  }

  public updateBankAccount(model: BankAccountViewModel, branchId: string, bankAccountId: string) {
    let url = this.BRANCH_BANK_ACCOUNT_CHANGE_URL.replace('{0}', branchId).replace('{1}', bankAccountId);
    return this.httpHelperService.authJsonPost<BankAccountViewModel>(url, model, null, false);
  }

  public deleteBankAccount(branchId: string, bankAccountId: string) {
    let url = this.BRANCH_BANK_ACCOUNT_CHANGE_URL.replace('{0}', branchId).replace('{1}', bankAccountId);
    return this.httpHelperService.authJsonDelete<ContactInformationViewModel>(url, null, false);
  }

  public updateLogo(branchId: string, file: File) {
    return this.httpHelperService.authMultipartFormDataPost(this.BRANCH_LOGO_URL.replace('{0}', branchId), {logo: file});
  }

  public updateAdminLogo(adminId: string, file: File) {
    return this.httpHelperService.authMultipartFormDataPost(this.BRANCH_ADMIN_LOGO_URL.replace('{0}', adminId), {logo: file});
  }

  public createAdmin(model: BranchUserViewModel, branchId: string) {
    return this.httpHelperService.authMultipartFormDataPut<BranchUserViewModel>(this.BRANCH_ADMINS_URL.replace('{0}', branchId), model, null, false);
  }

  public addAdmin(model: BranchUserViewModel, branchId: string) {
    return this.httpHelperService.authJsonPost<BranchUserViewModel>(this.BRANCH_ADMINS_URL.replace('{0}', branchId), model, null, false);
  }

  removeAdmin(branchId: string, adminId: string) {
    return this.httpHelperService.authJsonDelete(this.BRANCH_USERS_URL.replace('{0}', branchId) + '/' + adminId);
  }

  public getUsers(search: string) {
    return this.httpHelperService.authJsonGet<PagingViewModel<UserViewModel>>(this.USERS_SEARCH_URL.replace('{0}', search), null, false).pipe(map(paging => {
      return paging.items;
    }));
  }

  public findUser(email: string) {
    return this.httpHelperService.authJsonGet(this.USER_FIND_URL.replace('{0}', email), null, false);
  }

  public getAdminLogoUrl(adminId: string) {
    return this.BRANCH_ADMIN_LOGO_URL.replace('{0}', adminId) + '?' + new Date().getTime();
  }
}


