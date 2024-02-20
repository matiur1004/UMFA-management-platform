import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'page-limit',
  templateUrl: './page-limit.component.html',
  styleUrls: ['./page-limit.component.less']
})
export class PageLimitComponent implements OnInit {

  @Input() itemName: string = 'item';
  @Input() itemsName: string;
  @Input() showCreate: boolean = false;
  @Input() page: number;
  @Input() itemsTotal: number;
  @Input() itemsPerPage: number | null;
  @Input() itemsPerPageList: number[];
  @Output() limitChaged = new EventEmitter<number>();
  @Output() create = new EventEmitter<Event>();

  constructor() {
  }

  ngOnInit() {
    this.itemsName = this.itemName + 's';
  }

  setItemsPerPage(value: number | null) {
    this.itemsPerPage = value;
    this.limitChaged.emit(value)
  }

  getItemsDetails() {
    let text = '';

    if (this.itemsPerPage) {
      let start = this.page * this.itemsPerPage - this.itemsPerPage + 1;
      let end = this.page * this.itemsPerPage;

      if (start > this.itemsTotal) {
        start = this.itemsTotal;
      }
      if (end > this.itemsTotal) {
        end = this.itemsTotal;
      }

      text = 'Showing {start}-{end} of {total} {items}';
      text = text.replace('{start}', start.toString());
      text = text.replace('{end}', end.toString());
      text = text.replace('{total}', this.itemsTotal.toString());
      text = text.replace('{items}', this.itemsName);
    } else {
      text = 'Showing all {total} {items}';
      text = text.replace('{total}', this.itemsTotal.toString());
      text = text.replace('{items}', this.itemsName);
    }

    return text;
  }

  onCreate(event) {
    this.create.emit(event);
  }
}
