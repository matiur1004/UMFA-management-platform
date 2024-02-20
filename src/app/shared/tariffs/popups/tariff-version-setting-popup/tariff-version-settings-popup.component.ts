import {Component, Input, OnInit} from '@angular/core';
import {TariffCategoryAllocatedUnitViewModel} from '@app/shared/tariffs/models/tariff-category-allocated-unit.model';
import {UnitType} from '@app/shared/models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '',
  templateUrl: './tariff-version-settings-popup.component.html',
  styleUrls: ['./tariff-version-settings-popup.component.less']
})

export class TariffVersionSettingsPopupComponent implements OnInit {
  @Input()
  allocatedUnits: TariffCategoryAllocatedUnitViewModel[] = [];

  shopNames: string[] = [];
  commonAreaNames: string[] = [];

  constructor(private activeModal: NgbActiveModal) {

  }

  ngOnInit(): void {
    this.shopNames = this.allocatedUnits
      .filter(u => u.unitType === UnitType.Shop)
      .map(u => u.name);

    this.commonAreaNames = this.allocatedUnits
      .filter(u => u.unitType === UnitType.CommonArea)
      .map(u => u.name);
  }

  public removeAll(): void {
    this.activeModal.close();
  }

  public close(): void {
    this.activeModal.dismiss();
  }
}
