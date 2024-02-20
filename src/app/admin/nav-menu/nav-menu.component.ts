import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {AuthService, DataService, PermissionService} from '@services';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MCAccessPermission} from '@models';
import {UserAccountService} from 'app/shared/services/user-account.service';
import {Store} from '@ngrx/store';
import {logoutAction} from '@app/app.reducer';

@Component({
  selector: 'nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
  animations: [
    trigger('navCollapse', [
      state('true', style({
        width: '80px',
        opacity: 1
      })),
      state('false', style({
        width: '203px',
        opacity: 1
      })),

      transition('true => false', [
        animate(200, keyframes([
          style({width: '80px', opacity: 0}),
          style({width: '201px', opacity: 0.65}),
          style({width: '203px', opacity: 1})
        ]))
      ]),
      transition('false => true', [
        animate(200, keyframes([
          style({width: '203px', opacity: 0}),
          style({width: '82px', opacity: 0.65}),
          style({width: '80px', opacity: 1})
        ]))
      ])
    ])
  ],
  providers: [UserAccountService]
})
export class NavMenuComponent implements OnInit, OnDestroy {

  isExpanded = false;
  isNavbarCollapsed = false;

  permissionChangedSubject: Subscription;
  accessPermission: MCAccessPermission;
  fullName = '';
  logoUrl = '';
  roleName = '';
  @Output() onStartToggleBar = new EventEmitter<Event>();
  private userDataSubscriber: Subscription;

  constructor(private authService: AuthService,
              private store: Store,
              private router: Router, private permissionService: PermissionService,
              private userAccountService: UserAccountService, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.fullName = this.authService.getFullName();
    this.roleName = this.authService.getUserRoleName();
    this.logoUrl = this.authService.getLogoUrl();

    this.userDataSubscriber = this.dataService.getUserObservable().subscribe(r => {
      this.fullName = this.authService.getFullName();
      this.roleName = this.authService.getUserRoleName();
      this.logoUrl = this.authService.getLogoUrl();
    });

    this.accessPermission = this.permissionService.mcAccessPermission;
    this.permissionChangedSubject = this.permissionService.getMCPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.permissionService.refreshMCPermissions();
  }

  ngOnDestroy(): void {
    this.permissionChangedSubject.unsubscribe();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  navbarCollapseToggle(event: Event) {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
    this.onStartToggleBar.emit(event);
  }

  onLogout() {
    this.authService.reset();
    this.store.dispatch(logoutAction());
    this.router.navigate(['/login']);
  }
}
