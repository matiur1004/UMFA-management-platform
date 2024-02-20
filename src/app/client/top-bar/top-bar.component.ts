import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService, DataService} from '@services';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {UserAccountService} from 'app/shared/services/user-account.service';
import {ClientAccountService} from 'app/client/settings/shared/services/client-account.service';
import {map} from 'rxjs/operators';
import * as commonDataSelector from '../layout/shared/store/selectors/common-data.selector';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.less'],
  animations: [
    trigger('layoutToggle', [
      state('true', style({
        width: '79px'
      })),
      state('false', style({
        width: '202px'
      })),
      transition('true => false', animate('100ms ease-in-out')),
      transition('false => true', animate('100ms ease-in-out'))
    ])
  ],
  providers: [UserAccountService, ClientAccountService]
})
export class TopBarComponent implements OnInit, OnDestroy {

  @Input() isCollapsed: boolean = false;

  largeLogoRoute = '/assets/images/logos/branch-logo.png';
  smallLogoRoute = '/assets/images/logos/branch-logo-sm.png';
  fullName: string = '';
  logoUrl: string = '';
  clientId$: Subscription;
  private userDataSubscriber: Subscription;

  constructor(private authService: AuthService, private userAccountService: UserAccountService,
              private clientAccountService: ClientAccountService, private dataService: DataService,
              private router: Router, private store: Store<any>) {
    this.clientId$ = store.pipe(select(commonDataSelector.getClientId)).subscribe(clientId => {
      this.clientAccountService.getDetails(clientId).pipe(map((data) => {
        this.logoUrl = data.logoUrl;
      }));
    });
  }

  ngOnInit() {

    this.fullName = this.authService.getFullName();

    this.userDataSubscriber = this.dataService.getUserObservable().subscribe(r => {
      this.fullName = this.authService.getFullName();
    });
  }

  ngOnDestroy() {
    this.userDataSubscriber.unsubscribe();
    this.clientId$.unsubscribe();
  }

  onLogout() {
    this.authService.reset();
    this.router.navigate(['/login']);
  }

  onSettings() {
    this.router.navigate(['/client/settings']);
  }

}
