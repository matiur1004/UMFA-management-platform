import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.less']
})
export class PagerComponent implements OnInit {

  pages: number[];

  @Input() total = 0;
  @Input() pageSize: number;
  @Input() page = 1;
  @Output() onPageChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  setPage(page: number) {
    this.page = page;
    this.onPageChange.emit(this.page);
  }

}
