import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import {SetOfNodesListComponent} from './set-of-nodes-list.component';
import {SupplyTypeIconComponent} from '../../../../../../widgets/supply-type-icon/supply-type-icon.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';

describe('SetOfNodesListComponent', () => {
  let component: SetOfNodesListComponent;
  let fixture: ComponentFixture<SetOfNodesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        NgbDropdownModule
      ],
      declarations: [SetOfNodesListComponent, SupplyTypeIconComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetOfNodesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
