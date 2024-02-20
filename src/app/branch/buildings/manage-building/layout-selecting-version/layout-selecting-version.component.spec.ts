import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {Store, StoreModule} from '@ngrx/store';

import {LayoutSelectingVersionComponent} from './layout-selecting-version.component';
import {of} from 'rxjs';

class StoreMock {
  pipe = () => {
    return of([]);
  };
}

describe('LayoutSelectingVersionComponent', () => {
  let component: LayoutSelectingVersionComponent;
  let fixture: ComponentFixture<LayoutSelectingVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgSelectModule,
        FormsModule,
        RouterModule.forRoot([]),
        StoreModule
      ],
      declarations: [LayoutSelectingVersionComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Store, useClass: StoreMock}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSelectingVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
