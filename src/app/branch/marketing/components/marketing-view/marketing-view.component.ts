import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

import {BuildingViewModel, PagingViewModel} from '@models';

@Component({
  selector: 'marketing-view',
  templateUrl: './marketing-view.component.html',
  styleUrls: ['./marketing-view.component.less']
})
export class MarketingViewComponent implements OnInit {
  @Input() accessPermission;
  @Input() page = 1;
  @Input() model: PagingViewModel<BuildingViewModel>;
  @Input() branchId: string;
  @Output() navigateToMap = new EventEmitter();
  @Output() delete = new EventEmitter<string>();

  orderIndex: number = 1;
  public itemsPerPageList = [30, 50, 100];
  public itemsPerPage = 50;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  getItemsDetails() {
    let text = '';

    if (this.itemsPerPage) {
      let start = this.page * this.itemsPerPage - this.itemsPerPage + 1;
      let end = this.page * this.itemsPerPage;

      if (start > this.model.total) {
        start = this.model.total;
      }
      if (end > this.model.total) {
        end = this.model.total;
      }

      text = 'Showing {0}-{1} of {2} buildings';
      text = text.replace('{0}', start.toString());
      text = text.replace('{1}', end.toString());
      text = text.replace('{2}', this.model.total.toString());
    } else {
      text = 'Showing all {0} buildings'.replace('{0}', this.model.total.toString());
    }

    return text;
  }

  onShowOnMap(building: BuildingViewModel) {
    this.navigateToMap.emit(building);
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;
  }

  onBuildingPress(model) {
    console.log(model);
    this.router.navigate(['/branch', this.branchId, 'marketing', model.id]);
  }

  onDelete(buildingId: string) {
    this.delete.emit(buildingId)
  }

  setItemsPerPage(value: number) {
    this.itemsPerPage = value;
  }

  onPageChange($event: number) {

  }
}
