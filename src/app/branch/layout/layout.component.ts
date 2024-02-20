import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {BranchManagerService} from '@services';

@Component({
  selector: 'branch-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  animations: [
    trigger('layoutToggle', [
      state('true', style({
        'margin-left': '79px'
      })),
      state('false', style({
        'margin-left': '202px'
      })),
      transition('true => false', animate('100ms ease-in-out')),
      transition('false => true', animate('100ms ease-in-out'))
    ])
  ]
})
export class BranchLayoutComponent implements OnInit {

  isLayoutCollapsed = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private branchManager: BranchManagerService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const branchId = params['branchid'];
      this.branchManager.branchChanged(branchId);
    });

  }

  startToggleBar() {
    this.isLayoutCollapsed = !this.isLayoutCollapsed;
  }
}
