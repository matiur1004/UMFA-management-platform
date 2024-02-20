import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AuthService, DataService, UserAccountService} from '@services';
import {Subscription} from 'rxjs';

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
  ]
})
export class TopBarComponent implements OnInit, OnDestroy {

  @Input() isCollapsed: boolean = false;
  fullName: string = '';
  logoUrl: string = '';
  private userDataSubscriber: Subscription;

  constructor(
    private authService: AuthService,
    private userAccountService: UserAccountService,
    private dataService: DataService
  ) {
  }

  ngOnInit() {

    this.fullName = this.authService.getFullName();
    this.logoUrl = this.authService.getLogoUrl();

    this.userDataSubscriber = this.dataService.getUserObservable().subscribe(r => {
      this.fullName = this.authService.getFullName();
      this.logoUrl = this.authService.getLogoUrl();
    });
  }

  ngOnDestroy() {
    this.userDataSubscriber.unsubscribe();
  }

}
