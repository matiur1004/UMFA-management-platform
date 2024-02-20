import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.less'],
  animations: [
    trigger('layoutToggle', [
      state('true', style({
        'margin-left': '80px'
      })),
      state('false', style({
        'margin-left': '203px'
      })),
      transition('true => false', animate('250ms ease-in-out')),
      transition('false => true', animate('250ms ease-in-out'))
    ])
  ]
})
export class AdminLayoutComponent implements OnInit {

  isLayoutCollapsed = false;

  constructor() {
  }

  ngOnInit() {
  }

  startToggleBar() {
    this.isLayoutCollapsed = !this.isLayoutCollapsed;
  }
}
