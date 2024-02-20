import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF, DatePipe} from '@angular/common';

import {PipesModule} from 'app/shared/pipes/pipes.module';
import {TableNodeItemViewComponent} from './table-nodes-view.component';
import {LineItemCategoryDetailsPipe} from '../../pipes/line-item-category-details.pipe';
import {Pipe, PipeTransform} from '@angular/core';
import {FilterNodesPipe} from '../../pipes/filter-nodes.pipe';

@Pipe({name: 'registerUnit'})
class MockRegisterUnitPipe implements PipeTransform {
  transform(value: string, tou: number = null) {
    return value;
  }
}

describe('TableNodeItemViewComponent', () => {
  let component: TableNodeItemViewComponent;
  let fixture: ComponentFixture<TableNodeItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        PipesModule,
        RouterModule.forRoot([])
      ],
      declarations: [
        TableNodeItemViewComponent,
        FilterNodesPipe,
        LineItemCategoryDetailsPipe,
        MockRegisterUnitPipe
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        DatePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableNodeItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
