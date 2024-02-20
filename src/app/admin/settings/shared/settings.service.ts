import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {ManagementCompanyViewModel} from './models/management-company.model';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public phoneContactLabels = ['Mobile Number', 'Office Number', 'Fax'];
  public externalLinkLabels = ['Dropbox', 'Facebook', 'Google Drive', 'Hangouts', 'Linkedin', 'Skype', 'Twitter', 'Website', 'Whatsapp', 'Zoom', 'Other'];

  private readonly COMPANY_URL: string = '/api/v1/managment-companies';
  private readonly LOGO_URL: string = '/api/v1/managment-companies/logo';
  private readonly COMPANY_CATEGORIES_URL: string = '/api/v1/managment-companies/category';
  private readonly COMPANY_DEPARTMENT_URL: string = '/api/v1/managment-companies/departments';

  private readonly BRANCH_CONTACT_INFORMATIONS_URL: string = '/api/v1/managment-companies/contact-infomations';
  private readonly BRANCH_CONTACT_INFORMATION_CHANGE_URL: string = '/api/v1/managment-companies/contact-infomations/{1}';

  constructor(private httpService: HttpHelperService) {
  }

  public getSettings() {
    return this.httpService.authJsonGet<ManagementCompanyViewModel>(this.COMPANY_URL).pipe(map(model => {
      model.logoUrl = this.getLogoUrl();

      return model;
    }));
  }

  update(model: ManagementCompanyViewModel): any {
    return this.httpService.authJsonPost<ManagementCompanyViewModel>(this.COMPANY_URL, model, null, false).pipe(map(model => {
      model.logoUrl = this.getLogoUrl();
      return model;
    }));
  }

  deleteDepartment(id: string, isClient: boolean): Observable<any> {
    return this.httpService.authJsonDelete(this.COMPANY_DEPARTMENT_URL + '/' + id + '/' + isClient);
  }

  deleteCategory(id: string): Observable<any> {
    return this.httpService.authJsonDelete(this.COMPANY_CATEGORIES_URL + '/' + id);
  }

  public getLogoUrl(): any {
    return this.LOGO_URL;
  }

  public updateLogo(file: File) {
    return this.httpService.authMultipartFormDataPost(this.LOGO_URL, {logo: file});
  }
}
