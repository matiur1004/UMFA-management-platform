import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BranchModel} from 'app/shared/models/branch.model';

@Component({
  selector: 'branch-list-popup',
  templateUrl: './popup.branch.component.html',
  styleUrls: ['./popup.branch.component.less']
})
export class PopupBranchComponent implements OnInit {

  @Input() model: BranchModel[];
  public query = '';

  @Output() branchSelected = new EventEmitter<BranchModel>();

  constructor() {
  }

  ngOnInit() {
  }

  onSearch(query) {
    this.query = query;
  }

  onSelect(item: BranchModel) {
    this.resetSelectedItems();
    item.isSelected = true;

    this.branchSelected.emit(item);
  }

  onAllSelect() {
    this.resetSelectedItems();
  }

  resetSelectedItems() {
    this.model.forEach(b => {
      b.isSelected = false;
    });
  }
}
