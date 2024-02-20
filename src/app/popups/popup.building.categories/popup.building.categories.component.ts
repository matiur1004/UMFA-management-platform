import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'popup-building-categories',
  templateUrl: './popup.building.categories.component.html',
  styleUrls: ['./popup.building.categories.component.less']
})
export class PopupBuildingCategoriesComponent implements OnInit {

  @ViewChild("myDrop") myDrop: NgbDropdown

  @Output() selectedIcon: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onClose() {
    //this.myDrop.close();
  }

  onSelected(categoryIcaon) {
    this.selectedIcon.emit(categoryIcaon);
  }
}
