import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Observable, of } from 'rxjs';
import { DashboardService } from './dasboard.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _dashboardService: DashboardService, private _authService: AuthService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        if (route.params['id']) {
            this._dashboardService.alarmTriggeredId = route.params['id'];
        }
        return this._dashboardService.getStats(this._authService.userValue.Id);
    }
}
