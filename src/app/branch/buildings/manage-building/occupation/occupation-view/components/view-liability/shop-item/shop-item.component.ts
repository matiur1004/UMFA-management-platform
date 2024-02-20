import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonAreaShopRelationsViewModel} from '../../../../shared/models';
import {CommonAreaViewModel, Dictionary, ShopViewModel, TenantViewModel} from '@models';
import {RentDetailsComponent} from '../../../../occupation-create/dialogs/rent-details/rent-details.component';

@Component({
  selector: 'shop-item',
  templateUrl: './shop-item.component.html',
  styleUrls: ['./shop-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopItemComponent implements OnInit {

  @Input() allShops: ShopViewModel[];
  @Input() model: ShopViewModel;
  @Input() activeCommonAreas: CommonAreaViewModel[];
  @Input() commonAreasShopsData: Dictionary<Dictionary<CommonAreaShopRelationsViewModel>>;
  @Input() tenants: TenantViewModel[];
  @Input() buildingId: string;

  @Output() selectShopForAllCommonAreas = new EventEmitter();
  @Output() unselectShopForAllCommonAreas = new EventEmitter();
  @Output() updateShopRentDetails = new EventEmitter();

  checkedAll = false;
  checkedAllPartly = false;


  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.updateState();
  }

  updateState() {
    const checkedTotal = this.activeCommonAreas.reduce((prev, area) => {
      if (this.commonAreasShopsData[area.id][this.model.id].isSelected) {
        prev++;
      }

      return prev;
    }, 0);

    this.checkedAll = checkedTotal && this.activeCommonAreas.length == checkedTotal;
    this.checkedAllPartly = !this.checkedAll && checkedTotal > 0;
  }

  onSelected() {
    if (this.checkedAll) {
      this.unselectShopForAllCommonAreas.emit(this.model.id);
    } else {
      this.selectShopForAllCommonAreas.emit(this.model.id);
    }
  }

  ngOnChanges() {
    this.updateState();
  }

  onChangeRentDetails() {
    const modalRef = this.modalService.open(RentDetailsComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = this.model;
    modalRef.componentInstance.tenants = this.tenants;
    modalRef.componentInstance.buildingId = this.buildingId;
    modalRef.componentInstance.allShops = this.allShops;

    modalRef.result.then((result) => {
      this.updateShopRentDetails.emit(result);
    }, (reason) => {
    });
  }
}
