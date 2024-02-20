import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit {

  isLayoutCollapsed = false;

  constructor() {
  }

  ngOnInit() {
  }

  startToggleBar() {
    this.isLayoutCollapsed = !this.isLayoutCollapsed;
  }

}
