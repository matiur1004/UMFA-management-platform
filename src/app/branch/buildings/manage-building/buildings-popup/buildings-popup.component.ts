import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BuildingModel} from '@models';

@Component({
  selector: 'buildings-list-popup',
  templateUrl: './buildings-popup.component.html',
  styleUrls: ['./buildings-popup.component.less']
})
export class BuildingsPopupComponent implements OnInit {

  @Input() model: BuildingModel[];
  public query = '';

  @Output() branchSelected = new EventEmitter<BuildingModel>();

  constructor() {
  }

  ngOnInit() {
  }

  onSearch(query) {
    this.query = query;
  }

  onSelect(item: BuildingModel) {
    this.resetSelectedItems();
    item.isSelected = true;

    this.branchSelected.emit(item);
  }

  resetSelectedItems() {
    this.model.forEach(b => {
      b.isSelected = false;
    });
  }
}
