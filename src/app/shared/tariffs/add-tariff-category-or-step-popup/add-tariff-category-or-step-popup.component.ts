import {StringExtension} from './../../helper/string-extension';
import {Component, Input} from '@angular/core';
import {SupplyType, TariffCategoryViewModel, TariffStepModel} from "@app/shared/models";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AddTariffCategoryOrStepPopupMode} from "../models/add-tariff-category-or-step-popup-mode.enum";

@Component({
  selector: 'add-tariff-category-or-step-popup',
  templateUrl: './add-tariff-category-or-step-popup.component.html',
  styleUrls: ['./add-tariff-category-or-step-popup.component.less']
})
export class AddTariffCategoryOrStepPopupComponent {
  @Input()
  mode: AddTariffCategoryOrStepPopupMode;
  @Input()
  supplyType: SupplyType;
  addNew = false;
  selectedItems: (TariffCategoryViewModel | TariffStepModel)[] = [];

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  private _items: (TariffCategoryViewModel | TariffStepModel)[] = [];

  public get items(): (TariffCategoryViewModel | TariffStepModel)[] {
    return this._items;
  }

  @Input()
  public set items(items: (TariffCategoryViewModel | TariffStepModel)[]) {
    this._items = this.getItemsWithUpdatedIds(items || []);
  }

  get modeFeatureName(): string {
    return this.mode === AddTariffCategoryOrStepPopupMode.Category
      ? "category"
      : "step"
  }

  add(): void {
    let selectedItems: (TariffCategoryViewModel | TariffStepModel)[] = this.selectedItems;

    if (this.addNew) {
      const item = this.mode === AddTariffCategoryOrStepPopupMode.Category
        ? new TariffCategoryViewModel(this.supplyType)
        : new TariffStepModel

      selectedItems = [item];
    }

    this.activeModal.close({mode: this.mode, items: selectedItems});
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  getItemsWithUpdatedIds(items: (TariffCategoryViewModel | TariffStepModel)[]): (TariffCategoryViewModel | TariffStepModel)[] {
    const updatedItems = [];

    for (const item of items) {
      const updatedItem = {
        ...item,
        id: StringExtension.NewGuid()
      }

      updatedItems.push(updatedItem);
    }

    return updatedItems;
  }
}
