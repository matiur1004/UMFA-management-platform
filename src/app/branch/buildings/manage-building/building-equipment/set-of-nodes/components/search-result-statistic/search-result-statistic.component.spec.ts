import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

import {SearchResultStatisticComponent} from './search-result-statistic.component';


@Directive({
  selector: '[select-nodes-bind-dialog]'
})
export class SelectNodesBindDialogDirective {
  @Output() onConfirmerAction: EventEmitter<any[]> = new EventEmitter<any[]>();

  @Input('select-nodes-bind-dialog') excludeNodes: string[];
  @Input() supplyType: number;
  @Input() buildingId: string;
  @Input() versionId: string;

  constructor() {
  }

  @HostListener('click', ['$event']) onClick() {

  }
}


describe('SearchResultStatisticComponent', () => {
  let component: SearchResultStatisticComponent;
  let fixture: ComponentFixture<SearchResultStatisticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectNodesBindDialogDirective, SearchResultStatisticComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
