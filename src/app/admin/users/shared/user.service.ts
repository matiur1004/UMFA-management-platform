import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {DepartmentViewModel, PagingViewModel} from '@models';
import {HttpHelperService} from '@services';
import {BranchViewModel} from './model/branch.model';
import {PermissionViewModel} from './model/permission.model';
import {RoleDetailViewModel, RoleViewModel} from './model/role.model';
import {UserDetailViewModel, UserViewModel, UserWriteViewModel} from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly USERS_URL: string = '/api/v1/users/admin';
  private readonly USER_LOGO_URL: string = '/api/v1/users/{0}/logo';
  private readonly USER_URL: string = '/api/v1/users/{0}';
  private readonly CREATE_USER_URL: string = '/api/v1/users';
  private readonly BRANCH_DEPARTMENTS_URL: string = '/api/v1/managment-companies/departments';
  private readonly BRANCHES_URL: string = '/api/v1/branches';

  private readonly PERMISSION_LIST_URL: string = '/api/v1/roles/permissions/admin';
  private readonly ROLE_URL: string = '/api/v1/roles/admin';
  private readonly DEFAULT_ROLES_URL: string = '/api/v1/roles/default';
  private readonly ROLE_BY_ID_URL: string = '/api/v1/roles/{0}/admin';

  private readonly RESET_PASSWORD_URL: string = '/api/v1/users/{0}/reset-password';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getUsers(searchTerm: string, orderIndex: number, offset: number, limit: number) {
    let params: HttpParams = new HttpParams();

    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('searchKey', searchTerm);
    if (orderIndex) params = params.append('order', orderIndex.toString());

    return this.httpHelperService.authJsonGet<PagingViewModel<UserViewModel>>(this.USERS_URL, params)
  }

  public getUserLogo(id: string) {
    return this.USER_LOGO_URL.replace('{0}', id) + '?' + new Date().getTime();
  }

  public getUser(userId: string) {
    return this.httpHelperService.authJsonGet<UserDetailViewModel>(this.USER_URL.replace('{0}', userId));
  }

  public getDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENTS_URL, null, false);
  }

  public getBranches() {
    return this.httpHelperService.authJsonGet<BranchViewModel[]>(this.BRANCHES_URL, null, false);
  }

  public updateUser(userId: string, user: UserWriteViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.USER_URL.replace('{0}', userId), user);
  }

  public createUser(user: UserWriteViewModel) {
    return this.httpHelperService.authMultipartFormDataPut(this.CREATE_USER_URL, user);
  }

  public getRoles(searchTerm: string, offset: number, limit: number) {
    let params: HttpParams = new HttpParams();

    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<PagingViewModel<RoleViewModel>>(this.ROLE_URL, params)
  }

  public getDefaultRoles() {
    return this.httpHelperService.authJsonGet<PagingViewModel<RoleViewModel>>(this.DEFAULT_ROLES_URL);
  }

  public getRoleById(roleId: string) {
    return this.httpHelperService.authJsonGet<RoleDetailViewModel>(this.ROLE_BY_ID_URL.replace('{0}', roleId));
  }

  public getPermissions() {
    return this.httpHelperService.authJsonGet<PermissionViewModel[]>(this.PERMISSION_LIST_URL);
  }

  public updateRole(roleId: string, role: RoleDetailViewModel) {
    return this.httpHelperService.authJsonPost(this.ROLE_BY_ID_URL.replace('{0}', roleId), role, null, false);
  }

  public createRole(role: RoleDetailViewModel) {
    return this.httpHelperService.authJsonPut<RoleDetailViewModel>(this.ROLE_URL, role);
  }

  public deleteRole(roleId: string) {
    return this.httpHelperService.authJsonDelete<string>(this.ROLE_BY_ID_URL.replace('{0}', roleId));
  }

  public resetPassword(userId: string, model: any) {
    return this.httpHelperService.authJsonPost(this.RESET_PASSWORD_URL.replace('{0}', userId), model);
  }

  public updateUserStatus(userId: string, isActive: boolean) {
    return this.httpHelperService.authJsonPost(this.USER_URL.replace('{0}', userId) + '/status/' + isActive.toString(), null);
  }

  public deleteUser(userId: string) {
    return this.httpHelperService.authJsonDelete<string>(this.USER_URL.replace('{0}', userId));
  }
}
