import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewChildren} from '@angular/core';
import {Store} from '@ngrx/store';

import {CommonAreaViewModel, Dictionary, ShopViewModel} from '@models';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {CommonAreaShopRelationsViewModel} from '../../../shared/models/common-areas-shops-relation.model';

import * as fromOccupation from '../../../shared/store/reducers';


@Component({
  selector: 'manage-common-area-shop',
  templateUrl: './manage-common-area-shop.component.html',
  styleUrls: ['./manage-common-area-shop.component.less']
})
export class ManageCommonAreaShopComponent implements OnInit, IWizardComponent {

  @Input() shops: ShopViewModel[];
  @Input() commonAreas: CommonAreaViewModel[];
  @Input() commonAreasShopsData: Dictionary<Dictionary<CommonAreaShopRelationsViewModel>>;

  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter<number>();
  @Output() addCommonAreaShop = new EventEmitter();
  @Output() deleteCommonAreaShop = new EventEmitter();
  @Output() updateShopSearchTerm = new EventEmitter();
  @Output() updateCommonAreaSearchTerm = new EventEmitter();
  @Output() updateShopConnectFilter = new EventEmitter<number>();
  @Output() checkAllCommonAreaShops = new EventEmitter<string>();
  @Output() uncheckAllCommonAreaShops = new EventEmitter<string>();
  @Output() checkAllShopCommonAreas = new EventEmitter<string>();
  @Output() uncheckAllShopCommonAreas = new EventEmitter<string>();
  @Output() save = new EventEmitter();

  @ViewChild('tableColsHeader', {read: ElementRef}) tableColsHeader: ElementRef;
  @ViewChild('tableFirstColHeader', {read: ElementRef}) tableFirstColHeader: ElementRef;
  @ViewChildren('tableRowsHeader') tableRowsHeader;

  filterByIdx: number = 0;
  filterByLbl: string = "All shops";
  filterByItems = [
    {label: "All shops", value: 0},
    {label: "Connected shops", value: 1},
    {label: "Not connected shops", value: 2}];

  constructor(private store: Store<fromOccupation.State>) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes) {

  }

  canNavigate(): boolean {
    return true;
  }

  onFilterBy(event) {
    this.filterByIdx = event.value;
    this.filterByLbl = event.label;
    this.updateShopConnectFilter.emit(event.value);
  }

  onSelected(state: CommonAreaShopRelationsViewModel) {
    if (state.isSelected) {
      this.deleteCommonAreaShop.emit({commonAreaId: state.commmonAreaId, shopId: state.shopId});
    } else {
      this.addCommonAreaShop.emit({commonAreaId: state.commmonAreaId, shopId: state.shopId});
    }
  }

  onCheckAllCommonAreaShops(commonArea: CommonAreaViewModel, event) {
    if (event.srcElement.checked) {
      commonArea.isSelected = true;
      this.checkAllCommonAreaShops.emit(commonArea.id);
    } else {
      commonArea.isSelected = false;
      this.uncheckAllCommonAreaShops.emit(commonArea.id);
    }
  }

  onCheckAllShopCommonAreas(shop: ShopViewModel, event) {
    if (event.srcElement.checked) {
      shop.isSelected = true;
      this.checkAllShopCommonAreas.emit(shop.id);
    } else {
      shop.isSelected = false;
      this.uncheckAllShopCommonAreas.emit(shop.id);
    }
  }

  trackShopBy(index: number) {
    return index;
  }

  trackCommonAraeBy(index: number) {
    return index;
  }

  onScroll(event) {

    this.tableColsHeader.nativeElement.style.left = -event.srcElement.scrollLeft + 'px';

    this.tableFirstColHeader.nativeElement.style.left = event.srcElement.scrollLeft + 'px';

    for (let item of this.tableRowsHeader.toArray()) {
      item.nativeElement.style.left = event.srcElement.scrollLeft + 'px';
    }

  }

  onNext() {
    this.save.emit();
    this.next.emit();
  }

}
