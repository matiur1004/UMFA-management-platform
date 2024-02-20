import {Injectable} from '@angular/core';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import {AuthResponseModel} from '@models';
import {HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {

  private readonly BRANCH_ID: string = 'branchId';
  private readonly BEARER_TOKEN: string = 'bearer_token';
  private readonly FULL_NAME: string = 'full_name';
  private readonly IS_MC_ADMIN: string = 'is_mc_admin';
  private readonly IS_BRANCH_USER: string = 'is_branch_user';
  private readonly IS_TENANT_USER: string = 'is_tenant_user';
  private readonly IS_CLIENT_USER: string = 'is_client_user';
  private readonly USER_ROLE_NAME: string = 'user_role_name';
  private readonly ACCOUNT_LOGO_URL: string = 'account_logo_url';
  private readonly USER_ID: string = 'userId';
  private blog_endpoint = environment.blob_endpoint;

  constructor(private localStorage: LocalStorageService) {
  }

  insert(response: any) {
    const loginResponse = new AuthResponseModel(response.fullName, response.role, response.token,
      response.isMCAdmin, response.isBranchUser, response.isTenantUser, response.isClientUser, response.logoUrl, response.userId
    );
    this.localStorage.set(this.BEARER_TOKEN, loginResponse.token);
    this.localStorage.set(this.FULL_NAME, loginResponse.fullName);
    this.localStorage.set(this.IS_MC_ADMIN, loginResponse.isMCAdmin);
    this.localStorage.set(this.IS_BRANCH_USER, loginResponse.isBranchUser);
    this.localStorage.set(this.IS_TENANT_USER, loginResponse.isTenantUser);
    this.localStorage.set(this.IS_CLIENT_USER, loginResponse.isClientUser);
    this.localStorage.set(this.USER_ROLE_NAME, loginResponse.role);
    this.localStorage.set(this.ACCOUNT_LOGO_URL, loginResponse.logoUrl);
    this.localStorage.set(this.USER_ID, loginResponse.userId);
  }

  reset() {
    this.localStorage.clearAll();
  }

  getLogoUrl() {
    return this.blog_endpoint + this.localStorage.get(this.ACCOUNT_LOGO_URL);
  }

  getFullName() {
    return this.localStorage.get(this.FULL_NAME);
  }

  getUserRoleName() {
    return this.localStorage.get(this.USER_ROLE_NAME);
  }

  setFullName(fullName: string) {
    return this.localStorage.set(this.FULL_NAME, fullName);
  }

  isAuth() {
    return !!this.localStorage.get(this.BEARER_TOKEN);
  }

  isSuperAdmin(): boolean {
    return this.localStorage.get(this.IS_MC_ADMIN) == 'true';
  }

  isBranchUser(): boolean {
    return this.localStorage.get(this.IS_BRANCH_USER) == 'true';
  }

  isTenantUser(): boolean {
    return this.localStorage.get(this.IS_TENANT_USER) == 'true';
  }

  isClientUser(): boolean {
    return this.localStorage.get(this.IS_CLIENT_USER) == 'true';
  }

  isAuthorized(): boolean {
    return this.localStorage.get(this.BEARER_TOKEN) != null;
  }

  authJsonHeaders() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.localStorage.get(this.BEARER_TOKEN));
    return this.tryAddBranchId(header);
  }

  authMultipartFormData() {
    let header = new HttpHeaders();
    header = header.append('Authorization', 'Bearer ' + this.localStorage.get(this.BEARER_TOKEN));
    return this.tryAddBranchId(header);
  }

  authBlobType() {
    let header = new HttpHeaders();
    header = header.append('Authorization', 'Bearer ' + this.localStorage.get(this.BEARER_TOKEN));
    return this.tryAddBranchId(header);
  }

  authFormHeaders() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/x-www-form-urlencoded');
    header = header.append('Accept', 'application/json');
    header = header.append('Authorization', 'Bearer ' + this.localStorage.get(this.BEARER_TOKEN));
    return this.tryAddBranchId(header);
  }

  jsonHeaders() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Accept', 'application/json');
    return this.tryAddBranchId(header);
  }

  contentHeaders() {
    let header = new HttpHeaders();
    header = header.append('Content-Type', 'application/x-www-form-urlencoded');
    header = header.append('Accept', 'application/json');
    return this.tryAddBranchId(header);
  }

  private tryAddBranchId(header: HttpHeaders): HttpHeaders {
    const branchId = this.localStorage.get(this.BRANCH_ID);

    if (branchId) {
      header = header.append('X-Dunamis-Branch-Id', branchId);
    }

    return header;
  }
}
