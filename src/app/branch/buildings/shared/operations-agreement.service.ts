import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {HttpHelperService} from '@services';
import {OperationsAgreementViewModel} from '../models/operations-agreement.model';
import {UserContactViewModel} from '../models/user-contact.model';
import {
  ContactViewModel,
  DepartmentViewModel,
  NewFileViewModel,
  PagingViewModel,
  VersionResultViewModel,
  VersionViewModel
} from '@models';

@Injectable()
export class OperationsAgreementService {

  private readonly OPERATIONS_AGREEMENT_URL: string = '/api/v1/buildings/{0}/operations-agreement';
  private readonly OPERATIONS_AGREEMENT_WITH_VERSION_URL: string = '/api/v1/buildings/{0}/operations-agreement/{1}';
  private readonly BRANCH_DEPARTMENTS_URL: string = '/api/v1/branches/departments';
  private readonly CLIENT_DEPARTMENTS_URL: string = '/api/v1/clients/departments';
  private readonly DEPARTMENT_CONTACT_URL: string = '/api/v1/branches/department-contacts/{0}';
  private readonly BRANCH_CONTACTS_URL: string = '/api/v1/branches/users-and-contacts';
  private readonly CLIENT_CONTACTS_URL: string = '/api/v1/clients/{0}/contacts?searchKey=""';
  private readonly UPLOAD_FILE_URL: string = '/api/v1/buildings/{0}/operations-agreement/files';
  private readonly DELETE_FILE_URL: string = '/api/v1/buildings/{0}/operations-agreement/files/{1}';


  private readonly OPERATIONS_AGREEMENT_DOCUMENTS_URL: string = '';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public get(buildingId: string, versionId: string = null) {
    return this.httpHelperService.authJsonGet<VersionResultViewModel>(
      this.OPERATIONS_AGREEMENT_WITH_VERSION_URL.replace('{0}', buildingId).replace('{1}', versionId || '')
    );
  }

  public create(model: VersionViewModel<OperationsAgreementViewModel>) {
    return this.httpHelperService.authJsonPut(this.OPERATIONS_AGREEMENT_URL, model);
  }

  public update(buildingId: string, model: VersionViewModel<OperationsAgreementViewModel>) {
    return this.httpHelperService.authJsonPost(this.OPERATIONS_AGREEMENT_URL.replace('{0}', buildingId), model);
  }

  public getBranchDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENTS_URL, null, false);
  }

  public getClientDepartments(clientId: string) {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.CLIENT_DEPARTMENTS_URL, null, false);
  }

  public getDepartmentContacts(departmentId: string) {
    return this.httpHelperService.authJsonGet<UserContactViewModel[]>(
      this.DEPARTMENT_CONTACT_URL.replace('{0}', departmentId), null, false);
  }

  public getBranchContacts() {
    return this.httpHelperService.authJsonGet<UserContactViewModel[]>(this.BRANCH_CONTACTS_URL, null, false);
  }

  public getClientContacts(clientId: string) {
    return this.httpHelperService.authJsonGet<PagingViewModel<ContactViewModel>>(this.CLIENT_CONTACTS_URL.replace('{0}', clientId), null, false).pipe(
      map((data: PagingViewModel<ContactViewModel>) => {
        let contacts: UserContactViewModel[] = [];

        for (let item of data.items) {
          const contact: UserContactViewModel = {
            contactId: item.id,
            email: item.email,
            fullName: item.fullName,
            phone: item.phone,
            departments: item.departments.map(d => d.id)
          };

          contacts.push(contact);
        }

        return contacts;
      })
    );
  }

  public getDocuments(itemId: string) {
    return this.httpHelperService.authJsonGet<File[]>(this.OPERATIONS_AGREEMENT_DOCUMENTS_URL.replace('{0}', itemId), null, false);
  }

  public addDocument(itemId: string, file: File) {
    return this.httpHelperService.authMultipartFormDataPost(
      this.OPERATIONS_AGREEMENT_DOCUMENTS_URL.replace('{0}', itemId), {document: file});
  }

  public deleteDocument(itemId: string, documentId: string) {
    return this.httpHelperService.authJsonGet<File[]>(
      this.OPERATIONS_AGREEMENT_DOCUMENTS_URL.replace('{0}', itemId).replace('{1}', documentId));
  }

  public uploadOAFile(buildingId: string, field: number, model: NewFileViewModel) {
    let params: HttpParams = new HttpParams();
    if (field) params = params.append('field', field.toString());
    return this.httpHelperService.authUploadFileAsync(this.UPLOAD_FILE_URL.replace('{0}', buildingId), model, params);
  }

  public deleteOAFile(buildingId: string, fileId: number) {
    return this.httpHelperService.authJsonDelete(this.DELETE_FILE_URL.replace('{0}', buildingId).replace('{1}', fileId.toString()), null, false);
  }

}


