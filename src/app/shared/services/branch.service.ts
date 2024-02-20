import {Injectable} from '@angular/core';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

import {HttpHelperService} from './http-helper.service';
import {
  AutomaticMeterReadingAccountViewModel,
  BankAccountViewModel,
  BranchViewModel,
  BuildingViewModel,
  ContactInformationViewModel,
  DepartmentViewModel
} from '@models';

@Injectable({
  providedIn: 'root'
})
export class BranchSettingsService {

  public phoneContactLabels = ['Mobile Number', 'Office Number', 'Fax'];
  public externalLinkLabels = ['Dropbox', 'Facebook', 'Google Drive', 'Hangouts', 'Linkedin', 'Skype', 'Twitter', 'Website', 'Whatsapp', 'Zoom', 'Other'];
  private readonly BRANCHES_URL: string = '/api/v1/branches';
  private readonly BRANCH_URL: string = 'api/v1/branches/{0}';
  private readonly BRANCH_LOGO_URL: string = 'api/v1/branches/{0}/logo';
  private readonly BRANCH_ADMIN_LOGO_URL: string = 'api/v1/users/{0}/logo';
  private readonly BRANCH_BANK_ACCOUNTS_URL: string = 'api/v1/branches/{0}/bank-accounts';
  private readonly BRANCH_BANK_ACCOUNT_CHANGE_URL: string = 'api/v1/branches/{0}/bank-accounts/{1}';
  private readonly BRANCH_CONTACT_INFORMATIONS_URL: string = 'api/v1/branches/{0}/contact-infomations';
  private readonly BRANCH_CONTACT_INFORMATION_CHANGE_URL: string = 'api/v1/branches/{0}/contact-infomations/{1}';
  private readonly COMPANY_DEPARTMENT_LIST_URL: string = 'api/v1/managment-companies/departments';
  private readonly BRANCH_DEPARTMENT_LIST_URL: string = 'api/v1/branches/departments';
  private readonly BRANCH_DEPARTMENT_URL: string = 'api/v1/branches/departments/{0}';
  private readonly AMR_ACCOUNTS_URL: string = 'api/v1/branches/{0}/automatic-meter-reading-accounts';
  private readonly AMR_ACCOUNTS_CHANGE_URL: string = 'api/v1/branches/{0}/automatic-meter-reading-accounts/{1}';
  private readonly BUILDING_URL: string = 'api/v1/branches/{0}/buildings';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public updateBankAccount(model: BankAccountViewModel, branchId: string, bankAccountId: string) {
    const url = this.BRANCH_BANK_ACCOUNT_CHANGE_URL.replace('{0}', branchId).replace('{1}', bankAccountId);
    return this.httpHelperService.authJsonPost<BankAccountViewModel>(url, model, null, false);
  }

  public deleteContactInformation(branchId: string, contactInfoId: string) {
    const url = this.BRANCH_CONTACT_INFORMATION_CHANGE_URL.replace('{0}', branchId).replace('{1}', contactInfoId);
    return this.httpHelperService.authJsonDelete<ContactInformationViewModel>(url, null, false);
  }

  public addContactInformation(model: ContactInformationViewModel, branchId: string) {
    const url = this.BRANCH_CONTACT_INFORMATIONS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonPut<ContactInformationViewModel>(url, model, null, false);
  }

  public updateContactInformation(model: ContactInformationViewModel, branchId: string, contactInfoId: string) {
    const url = this.BRANCH_CONTACT_INFORMATION_CHANGE_URL.replace('{0}', branchId).replace('{1}', contactInfoId);
    return this.httpHelperService.authJsonPost<ContactInformationViewModel>(url, model, null, false);
  }

  public updateLogo(branchId: string, file: File) {
    return this.httpHelperService.authMultipartFormDataPost(this.BRANCH_LOGO_URL.replace('{0}', branchId), {logo: file});
  }

  public update(model: BranchViewModel) {
    const updateModel = Object.assign({}, model);
    updateModel.contactInformations = [];
    updateModel.admins = [];
    updateModel.bankAccounts = [];

    return this.httpHelperService.authMultipartFormDataPost<BranchViewModel>(this.BRANCHES_URL, updateModel, null, false);
  }

  public get(branchId: string) {
    return forkJoin([
      this.httpHelperService.authJsonGet<BranchViewModel>(this.BRANCH_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<BankAccountViewModel>(this.BRANCH_BANK_ACCOUNTS_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<ContactInformationViewModel>(this.BRANCH_CONTACT_INFORMATIONS_URL.replace('{0}', branchId)),
      this.httpHelperService.authJsonGet<AutomaticMeterReadingAccountViewModel[]>(this.AMR_ACCOUNTS_URL.replace('{0}', branchId))
    ]).pipe(map((data: any[]) => {

      const branch: BranchViewModel = data[0];
      branch.bankAccounts = data[1];
      branch.contactInformations = data[2];
      branch.amrAccounts = data[3];
      branch.phoneContacts = branch.contactInformations.filter(c => this.phoneContactLabels.includes(c.label));
      branch.externalLinks = branch.contactInformations.filter(c => this.externalLinkLabels.includes(c.label));

      branch.admins.forEach(admin => {
        admin.logoUrl = this.BRANCH_ADMIN_LOGO_URL.replace('{0}', admin.id);
      });

      return branch;
    }));
  }

  public addBankAccount(model: BankAccountViewModel, branchId: string) {
    const url = this.BRANCH_BANK_ACCOUNTS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonPut<BankAccountViewModel>(url, model, null, false);
  }

  public deleteBankAccount(branchId: string, bankAccountId: string) {
    const url = this.BRANCH_BANK_ACCOUNT_CHANGE_URL.replace('{0}', branchId).replace('{1}', bankAccountId);
    return this.httpHelperService.authJsonDelete<ContactInformationViewModel>(url, null, false);
  }

  public getCompanyDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.COMPANY_DEPARTMENT_LIST_URL);
  }

  public getBranchDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENT_LIST_URL);
  }

  public addDepartment(departmentId: string) {
    return this.httpHelperService.authJsonPost(this.BRANCH_DEPARTMENT_URL.replace('{0}', departmentId), null);
  }

  public removeDepartment(departmentId: string) {
    return this.httpHelperService.authJsonDelete(this.BRANCH_DEPARTMENT_URL.replace('{0}', departmentId));
  }

  public getAutomaticMeterReadingAccount(branchId: string) {
    const url = this.AMR_ACCOUNTS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonGet<AutomaticMeterReadingAccountViewModel[]>(url);
  }

  public addAutomaticMeterReadingAccount(model: AutomaticMeterReadingAccountViewModel, branchId: string) {
    const url = this.AMR_ACCOUNTS_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonPut<AutomaticMeterReadingAccountViewModel>(url, model, null, false);
  }

  public updateAutomaticMeterReadingAccount(model: AutomaticMeterReadingAccountViewModel, branchId: string, amrAccountId: string) {
    const url = this.AMR_ACCOUNTS_CHANGE_URL.replace('{0}', branchId).replace('{1}', amrAccountId);
    return this.httpHelperService.authJsonPost(url, model, null, false);
  }

  public deleteAutomaticMeterReadingAccount(branchId: string, amrAccountId: string) {
    const url = this.AMR_ACCOUNTS_CHANGE_URL.replace('{0}', branchId).replace('{1}', amrAccountId);
    return this.httpHelperService.authJsonDelete(url, null, false);
  }

  public getBuildings(branchId: string) {
    const url = this.BUILDING_URL.replace('{0}', branchId);
    return this.httpHelperService.authJsonGet<BuildingViewModel[]>(url, null, false);
  }

}
