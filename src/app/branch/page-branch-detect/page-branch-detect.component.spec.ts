import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {Component, Input} from '@angular/core';

import {PopupBranchListModule} from 'app/popups/popup.branch/shared/popup-branch.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupSearchComponent} from 'app/popups/popup.search/popup.search.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';

import {BranchManagerService} from '@services';
import {PageBranchDetectComponent} from './page-branch-detect.component';

describe('PageBranchDetectComponent', () => {
  let component: PageBranchDetectComponent;
  let fixture: ComponentFixture<PageBranchDetectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([{
          path: 'branch/:branchid', component: BranchPageComponent
        }]),
        PopupBranchListModule,
        PipesModule
      ],
      declarations: [
        BranchPageComponent, BranchNavMenuComponent, TopBarComponent, PopupSearchComponent, PageBranchDetectComponent
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: BranchManagerService, useValue: {getBranchId: () => '1'}}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBranchDetectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


@Component({
  selector: 'top-bar',
  template: '<div>top-bar</div>',
})
class TopBarComponent {
  @Input() isCollapsed: boolean = false;
}

@Component({
  selector: 'branch-nav-menu',
  template: '<div>branch-nav-menu</div>'
})
class BranchNavMenuComponent {
}

@Component({
  selector: 'branch-page',
  template: '<div>branch-page</div>'
})
class BranchPageComponent {
}
