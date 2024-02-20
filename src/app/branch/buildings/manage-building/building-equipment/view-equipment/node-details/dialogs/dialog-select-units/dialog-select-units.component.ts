import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonAreaViewModel, ShopOrder, ShopViewModel} from '@models';

import {unitsFiltersList} from '../../../../shared/models';

@Component({
  selector: 'dialog-select-units',
  templateUrl: './dialog-select-units.component.html',
  styleUrls: ['./dialog-select-units.component.less']
})
export class DialogSelectUnitsComponent implements OnInit {

  @Input() units: (ShopViewModel | CommonAreaViewModel)[];

  public searchText = '';
  public selectedUnitFilterText: number = 0;

  public orderIndex: number = 1;
  public orderType = ShopOrder;
  public unitsFiltersList = unitsFiltersList;
  public floors: any[] = [];
  public selectedFloor = '';
  public isAllSelected = false;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    const units: any[] = this.units;
    let floors = units.map(el => el.floor).sort().filter(el => el !== null);
    floors = Array.from(new Set(floors));
    this.floors = [{label: 'All floors', value: ''}].concat(floors.map(el => {
      return {label: el, value: el};
    }));
  }

  onChangeOrderIndex(idx: number) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;
  }

  search(ev: string) {
    this.searchText = ev;
  }

  onAdd() {
    const selevtedUnits = (this.units as any).filter(el => el.isSelected);
    this.activeModal.close(selevtedUnits);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  onSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.units.forEach(el => {
      el.isSelected = this.isAllSelected;
    });
  }

}
