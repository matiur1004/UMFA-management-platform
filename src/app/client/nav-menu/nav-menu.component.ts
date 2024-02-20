import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {animate, group, keyframes, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'nav-menu',
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
export class NavMenuComponent implements OnInit {

  isNavbarCollapsed = false;
  isExpanded = false;

  @Output() onStartToggleBar = new EventEmitter<Event>();

  constructor() {
  }

  ngOnInit() {
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
