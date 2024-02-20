import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

import {HttpHelperService} from './http-helper.service';
import {
  ClientViewModel,
  ContactViewModel,
  DepartmentViewModel,
  PagingViewModel,
  PermissionViewModel,
  RoleDetailViewModel,
  RoleViewModel,
  UserProfileUserViewModel,
  UserProfileViewModel
} from '@models';


@Injectable()
export class UserProfileService {

  public selectedUserId: string;
  private readonly PERMISSION_LIST_URL: string = "/api/v1/roles/permissions";
  private readonly ROLE_URL: string = "/api/v1/roles";
  private readonly ROLE_BY_ID_URL: string = "/api/v1/roles/{0}";
  private readonly CONTACT_LIST_URL: string = "/api/v1/user-profiles/contacts";
  private readonly CONTACT_BY_ID_URL: string = "/api/v1/user-profiles/contacts/{0}";
  private readonly CONTACT_LOGO_URL: string = "/api/v1/user-profiles/contacts/{0}/logo";
  private readonly ALL_DEPARTMENTS_URL: string = "/api/v1/managment-companies/departments";
  private readonly BRANCH_DEPARTMENTS_URL: string = "/api/v1/managment-companies/branch-departments";
  private readonly USERS_LIST_URL: string = "/api/v1/user-profiles/users";
  private readonly ALL_USERS_LIST_URL: string = "/api/v1/user-profiles/users/all";
  private readonly USERS_BY_ID_URL: string = "/api/v1/user-profiles/users/{0}";
  private readonly USER_LOGO_URL: string = "/api/v1/users/{0}/logo";
  private readonly USER_BY_ID_URL: string = "/api/v1/user-profiles/users/{0}";
  private readonly USER_PROFILE_LIST_URL: string = "/api/v1/user-profiles";
  private readonly USER_PROFILE_BY_ID_URL: string = "/api/v1/user-profiles/{0}";
  private readonly USER_PROFILE_CLIENT_LIST_URL: string = "/api/v1/user-profiles/clients";
  private readonly CREATE_USER_FROM_CONTACT_BY_ID_URL: string = "/api/v1/user-profiles/contacts/{0}/create-user";
  private readonly USER_SEND_FOR_APPROVE_URL: string = "/api/v1/user-profiles/users/{0}/send-on-approval";
  private readonly USER_DISABLE_URL: string = "/api/v1/user-profiles/users/{0}/disable";

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getPermissions(): Observable<PermissionViewModel[]> {
    return this.httpHelperService.authJsonGet<PermissionViewModel[]>(this.PERMISSION_LIST_URL);
  }

  public getRoles(searchTerm: string, offset: number, limit: number): Observable<PagingViewModel<RoleViewModel>> {

    let params: HttpParams = new HttpParams();
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<PagingViewModel<RoleViewModel>>(this.ROLE_URL, params);
  }

  public create(role: RoleDetailViewModel): Observable<RoleDetailViewModel> {
    return this.httpHelperService.authJsonPut<RoleDetailViewModel>(this.ROLE_URL, role);
  }

  public getById(roleId: string): Observable<RoleDetailViewModel> {
    return this.httpHelperService.authJsonGet<RoleDetailViewModel>(this.ROLE_BY_ID_URL.replace('{0}', roleId));
  }

  public update(roleId: string, role: RoleDetailViewModel): Observable<{}> {
    return this.httpHelperService.authJsonPost(this.ROLE_BY_ID_URL.replace('{0}', roleId), role, null, false);
  }

  public getContactsForClient(searchTerm: string, order: number, offset: number, limit: number) {
    let params: HttpParams = new HttpParams();
    if (order) params = params.append('order', order.toString());
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<PagingViewModel<ContactViewModel>>(this.CONTACT_LIST_URL, params);
  }

  public createContact(contact: ContactViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<ContactViewModel>(this.CONTACT_LIST_URL, contact);
  }

  public updateContact(contactId: string, contact: ContactViewModel) {
    return this.httpHelperService.authMultipartFormDataPost<ContactViewModel>(this.CONTACT_BY_ID_URL.replace('{0}', contactId), contact);
  }


  public deleteContact(contactId: string) {
    return this.httpHelperService.authJsonDelete(this.CONTACT_BY_ID_URL.replace('{0}', contactId));
  }

  public getDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.ALL_DEPARTMENTS_URL, null, false);
  }

  public getBranchDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENTS_URL, null, false);
  }

  public getContactLogoUrl(contactId: string): string {
    return this.CONTACT_LOGO_URL.replace('{0}', contactId) + '?' + new Date().getTime();
  }

  public getUsers(searchTerm: string, userProfileId: string, order: number, offset: number, limit: number) {

    let params: HttpParams = new HttpParams();
    if (order) params = params.append('order', order.toString());
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('search', searchTerm);
    if (userProfileId) params = params.append('userProfileId', userProfileId);

    return this.httpHelperService.authJsonGet<PagingViewModel<UserProfileUserViewModel>>(this.USERS_LIST_URL, params).pipe(map((data: PagingViewModel<UserProfileUserViewModel>) => {
      data.items.forEach(user => {
        if (user.logoUrl) {
          user.logoUrl = user.logoUrl;
        }
      });

      return data;
    }));
  }

  public getAllUsers(searchTerm: string, userProfileId: string, order: number, offset: number, limit: number) {

    let params: HttpParams = new HttpParams();
    if (order) params = params.append('order', order.toString());
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('search', searchTerm);
    if (userProfileId) params = params.append('userProfileId', userProfileId);

    return this.httpHelperService.authJsonGet<PagingViewModel<UserProfileUserViewModel>>(this.ALL_USERS_LIST_URL, params).pipe(map((data: PagingViewModel<UserProfileUserViewModel>) => {
      data.items.forEach(user => {
        if (user.logoUrl) {
          user.logoUrl = user.logoUrl;
        }
      });
      return data;
    }));
  }

  public getUser(userId: string) {
    return this.httpHelperService.authJsonGet<UserProfileUserViewModel>(this.USERS_BY_ID_URL.replace('{0}', userId));
  }

  public getUserLogoUrl(userId: string): string {
    return this.USER_LOGO_URL.replace('{0}', userId) + '?' + new Date().getTime();
  }

  public createUser(user: ContactViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<ContactViewModel>(this.USERS_LIST_URL, user);
  }

  public updateUser(userId: string, user: ContactViewModel) {
    return this.httpHelperService.authMultipartFormDataPost<ContactViewModel>(this.USER_BY_ID_URL.replace('{0}', userId), user);
  }

  public getUserProfiles(searchTerms: string = null, offset: number = 0, limit: number = 0) {

    let params: HttpParams = new HttpParams();
    if (searchTerms) params = params.append('searchKey', searchTerms);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());

    return forkJoin([
      this.httpHelperService.authJsonGet<PagingViewModel<UserProfileViewModel>>(this.USER_PROFILE_LIST_URL, params),
      this.httpHelperService.authJsonGet<PagingViewModel<RoleViewModel>>(this.ROLE_URL)
    ]).pipe(map((data: any[]) => {
      data[0].items.forEach(profile => {
        profile.users = profile.users.map(u => {

          if (u.logoUrl) {
            u.logoUrl = u.logoUrl;
          }

          u.roles = u.roles.map(r => {
            let role = data[1].items.find(i => i.id == r);
            return role;
          });

          u.rolesDescription = u.roles.map(i => i.name).join(', ');

          return u;
        });
      });

      return data[0];
    }));
  }

  public getUserProfileById(profileId: string): Observable<UserProfileViewModel> {
    return this.httpHelperService.authJsonGet<UserProfileViewModel>(this.USER_PROFILE_BY_ID_URL.replace('{0}', profileId));
  }

  public getClients(): Observable<ClientViewModel[]> {
    return this.httpHelperService.authJsonGet<ClientViewModel[]>(this.USER_PROFILE_CLIENT_LIST_URL)
      .pipe(map((clients: ClientViewModel[]) => {
        clients.forEach(client => {
          let buildingsLength = 0;

          client.portfoliosLength = client.portfolios ? client.portfolios.length : 0;

          client.portfolios.forEach(portfolio => {
            portfolio.buildingsLength = portfolio.buildings ? portfolio.buildings.length : 0;
            buildingsLength += portfolio.buildingsLength;
          });

          client.buildingsLength = buildingsLength;
        });

        return clients;
      }));
  }

  public createUserProfile(userProfile: UserProfileViewModel): Observable<UserProfileViewModel> {
    return this.httpHelperService.authJsonPut<UserProfileViewModel>(this.USER_PROFILE_LIST_URL, userProfile);
  }

  public updateUserProfile(userProfileId: string, userProfile: UserProfileViewModel): Observable<UserProfileViewModel> {
    return this.httpHelperService.authJsonPost(this.USER_PROFILE_BY_ID_URL.replace("{0}", userProfileId), userProfile);
  }

  public createUserFromContact(contactId: string): Observable<UserProfileViewModel> {
    return this.httpHelperService.authJsonPost(this.CREATE_USER_FROM_CONTACT_BY_ID_URL.replace("{0}", contactId), null);
  }

  public deleteUser(userId: string) {
    return this.httpHelperService.authJsonDelete(this.USER_BY_ID_URL.replace("{0}", userId));
  }

  public sendOnApprove(userId: string) {
    return this.httpHelperService.authJsonPost(this.USER_SEND_FOR_APPROVE_URL.replace('{0}', userId), null);
  }

  public disableUser(userId: string) {
    return this.httpHelperService.authJsonPost(this.USER_DISABLE_URL.replace('{0}', userId), null);
  }
}
