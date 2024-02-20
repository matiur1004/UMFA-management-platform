import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import {LogoComponent} from 'app/widgets/logo/logo.component';
import {PagerComponent} from 'app/widgets/pager/pager.component';

import {MarketingViewComponent} from './marketing-view.component';

describe('MarketingViewComponent', () => {
  let component: MarketingViewComponent;
  let fixture: ComponentFixture<MarketingViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        RouterModule.forRoot([])
      ],
      declarations: [PagerComponent, LogoComponent, MarketingViewComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingViewComponent);
    component = fixture.componentInstance;
    component.model = {items: [], total: 0};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
