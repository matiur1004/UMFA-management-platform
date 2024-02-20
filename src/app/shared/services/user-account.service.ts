import {Injectable} from '@angular/core';
import {HttpHelperService} from './http-helper.service';
import {UserAccountViewModel} from '../models/user-account.model';
import {DepartmentViewModel} from '@models';
import {UserAccountNotificationViewModel} from '../models/user-account-notification.model';
import {UserAccountChangePasswordViewModel} from '../models/user-account-change-password.model';

@Injectable()
export class UserAccountService {

  private readonly USER_ACCOUNT_URL: string = '/api/v1/account';
  private readonly USER_ACCOUNT_NOTIFICATION_URL: string = '/api/v1/account/notifications';
  private readonly USER_ACCOUNT_CHANGE_PASSWORD_URL: string = '/api/v1/account/update-password';
  private readonly BRANCH_DEPARTMENTS_URL: string = '/api/v1/managment-companies/departments';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public get() {
    return this.httpHelperService.authJsonGet<UserAccountViewModel>(this.USER_ACCOUNT_URL);
  }

  public update(model: UserAccountViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.USER_ACCOUNT_URL, model);
  }

  public getDepartments() {
    return this.httpHelperService.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENTS_URL, null, false);
  }

  public getNotifications() {
    return this.httpHelperService.authJsonGet<UserAccountNotificationViewModel>(this.USER_ACCOUNT_NOTIFICATION_URL);
  }

  public updateNotifications(model: UserAccountNotificationViewModel) {
    return this.httpHelperService.authJsonPost(this.USER_ACCOUNT_NOTIFICATION_URL, model, null, false);
  }

  public changePassword(model: UserAccountChangePasswordViewModel) {
    return this.httpHelperService.authJsonPost(this.USER_ACCOUNT_CHANGE_PASSWORD_URL, model, null, false);
  }
}


