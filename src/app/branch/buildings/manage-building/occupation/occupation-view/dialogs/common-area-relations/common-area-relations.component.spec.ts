import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonAreaRelationsComponent} from './common-area-relations.component';

describe('CommonAreaRelationsComponent', () => {
  let component: CommonAreaRelationsComponent;
  let fixture: ComponentFixture<CommonAreaRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonAreaRelationsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonAreaRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
