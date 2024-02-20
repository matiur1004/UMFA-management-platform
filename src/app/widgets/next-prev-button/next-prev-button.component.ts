import { Component, EventEmitter, OnInit, Output, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'next-prev-button',
  templateUrl: './next-prev-button.component.html',
  styleUrls: ['./next-prev-button.component.less']
})
export class NextPrevButtonComponent implements OnInit {

  @Output() onPrev = new EventEmitter();
  @Output() onNext = new EventEmitter();
  
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  first: boolean = true;
  last: boolean = true;;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.isFirst) this.first = changes.isFirst.currentValue;
    if(changes.isLast) this.last = changes.isLast.currentValue;
  }

  prev() {
    this.onPrev.emit();
  }

  next() {
    this.onNext.emit();
  }
}
