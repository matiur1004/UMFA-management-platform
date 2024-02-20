import {Component, Input, OnInit} from '@angular/core';
import {TenantShopHistoryViewModel} from '@models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'popup-shop-history',
  templateUrl: './popup-shop-history.component.html',
  styleUrls: ['./popup-shop-history.component.less']
})
export class PopupShopHistoryComponent implements OnInit {

  @Input() history: TenantShopHistoryViewModel[];
  @Input() shopName: string;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onClose() {
    this.activeModal.close();
  }
}
