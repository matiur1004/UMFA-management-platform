import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { UserService } from '@shared/services';
import { RoleType } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _userService: UserService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): FuseNavigationItem[]{
        // return this._httpClient.get<Navigation>('api/common/navigation').pipe(
        //     tap((navigation) => {
        //         this._navigation.next(navigation);
        //     })
        // );
        return this.generateNavigation();
    }

    generateNavigation(): FuseNavigationItem[]{
        let roleId = this._userService.userValue.RoleId;
        //roleId = 2;
        let _this = this;
        const navigation: FuseNavigationItem[] = [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                link: '/project',
                icon    : 'heroicons_solid:dashboard'
            },
            {
                id: 'admin',
                title: 'Admin',
                type: 'basic',
                link: '/admin',
                icon    : 'feather:gear',
                hidden: function(){    
                    if(roleId == RoleType.UMFAAdministrator) return false;
                    return true;
                }
            },
            {
                id: 'smart-meters',
                title: 'Smart Meters',
                type: 'basic',
                link: '/smart-meters',
                icon    : 'feather:smart-meters',
                hidden: function(){    
                    if(roleId == RoleType.UMFAAdministrator || roleId == RoleType.UMFAOperator) return false;
                    return true;
                }
            },
            {
                id: 'amr_graph',
                title: 'Amr graph',
                type: 'basic',
                link: '/reports/amrgraphs',
                icon    : 'feather:pie-chart',
            },
            {
                id: 'report_viewer',
                title: 'Report Viewer',
                type: 'basic',
                link: '/reports/dxreports',
                icon    : 'heroicons_solid:marketing', 
                hidden: function(){
                    if(_this._userService.userValue.IsTenant) return true;
                    
                    return false;
                }
            },
        ]
        return navigation;
    }
}
