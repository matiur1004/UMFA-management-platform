import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'simple-search-form',
  templateUrl: './simple-search-form.component.html',
  styleUrls: ['./simple-search-form.component.less']
})
export class SimpleSearchFormComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput', {static: true}) inputField: ElementRef;
  @Input() class: string;
  @Input() value = '';
  @Input() placeholder = 'Search';
  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();

  private eventSubscription: Subscription;

  constructor() {
  }

  ngOnInit() {
    this.eventSubscription = fromEvent(this.inputField.nativeElement, 'input').pipe(
      debounceTime(500),
    ).subscribe(() => {
      this.onSearch.emit(this.value);
    });
  }

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
}
