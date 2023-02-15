import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { IUmfaBuilding } from 'app/core/models';
import { EHomeTabType, IHomeTab, CHomeTabTypeText } from 'app/core/models';
import { UserService } from 'app/core/user/user.service';
import { BuildingService } from 'app/shared/services/building.service';
import { ApexOptions } from 'ng-apexcharts';
import { catchError, EMPTY, map, of, Subject, takeUntil, tap } from 'rxjs';
import { DashboardService } from './dasboard.service';

@Component({
    selector       : 'dashboard',
    templateUrl    : './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy
{
    stats$ = this._dbService.stats$.pipe(
        tap(() => {
        //  this.loadingTimer.subscribe();
        //  this.subTimer = this.incrementTimer.subscribe();
        }),
        map(s => {
          console.log("stats: " + JSON.stringify(s))
          return s;
        }),
        catchError(err => {
          this.errorMessageSubject.next(err);
          return EMPTY;
        }));
    
    buildings$;

    private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();

    chartVisitors: ApexOptions;
    data: any;
    tabsList: IHomeTab[] = [];
    tabType = EHomeTabType;
    selectedTab: number = 0;
    loading: boolean = true;
    errMessage: string;

    buildings: IUmfaBuilding[];
    dataSource: any = {};
    readonly allowedPageSizes = [10, 15, 20, 'All'];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    

    constructor(
        private _dbService: DashboardService,
        private _bldService: BuildingService,
        private _usrService: AuthService,
        private _cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
    }

    onDetail(type: EHomeTabType) {
        if(!this.tabsList.find(tab => tab.title == CHomeTabTypeText[type])) {
            let newTab: IHomeTab = {
                id: type,
                title: CHomeTabTypeText[type],
            };
            if(type == EHomeTabType.Buildings) {
                this._bldService.getBuildingsForUser(this._usrService.userValue.Id).subscribe(res => {
                    newTab.dataSource = [...res];
                    this.tabsList.push({...newTab});
                    this.selectedTab = this.tabsList.length;
                    this._cdr.markForCheck();
                });
            } else {
                this.tabsList.push({...newTab});
                this.selectedTab = this.tabsList.length;
            }
        }
        
    }

    removeTab(index: number) {
        this.tabsList.splice(index, 1);
        this.selectedTab = 0;
    }

    ngAfterViewInit() {
        if (!this._dbService.StatsValue) this._dbService.getStats();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
