import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { BuildingService, UserService } from '@shared/services';
import { UserNotificationScheduleService } from '@shared/services/user-notification-schedule.service';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementResolver implements Resolve<any> {
  constructor(
    private _userService: UserService,
    private _buildingService: BuildingService,
    private _userNotificationScheduleService: UserNotificationScheduleService
  ){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return forkJoin([
      this._buildingService.getBuildingsForUser(this._userService.userValue.UmfaId),
      this._userService.getRoles(),
      this._userService.getAllUsers(),
      this._userService.getNotificationTypes(),
      this._userNotificationScheduleService.getAllNotificationSendTypes(),
      this._userNotificationScheduleService.getAllNotificationSummaryTypes(),
    ]);
  }
}
