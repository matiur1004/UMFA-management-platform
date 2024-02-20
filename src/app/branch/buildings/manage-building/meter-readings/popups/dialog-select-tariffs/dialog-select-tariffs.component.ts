import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {TariffViewModel, VersionViewModel} from '@models';
import {DialogSelectTariffsInputDataModel} from '../../../building-equipment/set-of-nodes/models/dialog-select-tariffs-input-data.model';

@Component({
  selector: 'dialog-select-tariffs',
  templateUrl: './dialog-select-tariffs.component.html',
  styleUrls: ['./dialog-select-tariffs.component.less']
})
export class DialogSelectTariffsComponent implements OnInit {
  @Input() data: DialogSelectTariffsInputDataModel;

  public tariffs: VersionViewModel<TariffViewModel>[];
  public tariff: VersionViewModel<TariffViewModel>;
  public supplierList: any[];
  public selectedSupplier: string;
  public showRecommended = 1;

  public filterList = [
    {id: 1, name: "Recommended"},
    {id: 0, name: "All"},
  ]

  constructor(
    public activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
    this.tariffs = this.data.tariffs;
    this.supplierList = this.filterUniqSuppliers(this.tariffs);
    this.selectedSupplier = this.supplierList.length ? this.supplierList[0].id : null;
  }

  filterUniqSuppliers(tariffs: any[]) {
    let res = [];
    let ids = [];
    let suppliers = tariffs.map(el => el.entity.supplier);

    if (suppliers.includes(null)) {
      res.push({
        id: '',
        name: "Building tariffs"
      })
    }

    suppliers.forEach(el => {
      if (el && ids.indexOf(el.id) === -1) {
        ids.push(el.id);
        res.push({
          id: el.id,
          name: el.name
        });
      }
    });

    return res;
  }

  onFilterChanged() {
    this.tariffs.forEach(el => {
      el['selected'] = false;
    });
    this.tariff = null;
  }


  onSelectChanged(tariff) {
    this.onFilterChanged();
    tariff.selected = true;
    this.tariff = tariff;
  }

  close() {
    if (this.tariff) {
      this.activeModal.close(this.tariff);
    }
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
