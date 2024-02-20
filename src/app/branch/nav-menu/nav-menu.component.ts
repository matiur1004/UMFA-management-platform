import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BranchAccessPermission} from '@models';
import {AuthService, BranchManagerService, PermissionService} from '@services';
import {animate, group, keyframes, state, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';

@Component({
  selector: 'branch-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.less'],
  animations: [
    trigger('navCollapse', [
      state('true', style({
        width: '79px',
        opacity: 1
      })),
      state('false', style({
        width: '202px',
        opacity: 1
      })),

      transition('true => false', [
        group([
          animate('500ms', keyframes([
            style({width: '79px', opacity: 0}),
            style({width: '200px', opacity: 0.8})
          ])),
          animate('200ms', keyframes([
            style({width: '200px', opacity: 0.8}),
            style({width: '202px', opacity: 1})
          ]))
        ])
      ]),
      transition('false => true', [
        group([
          animate('500ms', keyframes([
            style({width: '202px', opacity: 0}),
            style({width: '81px', opacity: 0.8})
          ])),
          animate('200ms', keyframes([
            style({width: '81px', opacity: 0.8}),
            style({width: '79px', opacity: 1})
          ]))
        ])
      ])
    ])
  ]
})
export class BranchNavMenuComponent implements OnInit {

  isNavbarCollapsed = false;
  isExpanded = false;

  public currentBranchId: string = '';

  isSuperAdmin: boolean = false;
  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;
  @Output() onStartToggleBar = new EventEmitter<Event>();
  private permissionChanged: Subscription;
  private branchSubscruber$: Subscription;

  constructor(
    private permissionService: PermissionService,
    private authService: AuthService,
    private branchManager: BranchManagerService
  ) {
  }

  ngOnInit() {
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.currentBranchId = this.branchManager.getBranchId();
    this.branchSubscruber$ = this.branchManager.getBranchObservable().subscribe((branch) => {
      this.currentBranchId = branch.id;
    });

    this.permissionService.refreshBranchPermissions();
  }

  ngOnDestroy() {
    this.permissionChangedSubject && this.permissionChangedSubject.unsubscribe();
    this.branchSubscruber$ && this.branchSubscruber$.unsubscribe();
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
}
