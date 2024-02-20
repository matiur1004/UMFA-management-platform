import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SetFormComponent} from './set-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

describe('SetFormComponent', () => {
  let component: SetFormComponent;
  let fixture: ComponentFixture<SetFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        RouterModule.forRoot([])
      ],
      declarations: [SetFormComponent],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetFormComponent);
    component = fixture.componentInstance;
    component.initForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
