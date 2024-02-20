import {
  BasedOnAttributesLineItemViewModel,
  BasedOnCalculationsLineItemViewModel,
  BasedOnReadingsAndSettingsLineItemViewModel,
  BasedOnReadingsLineItemViewModel,
  CategoryViewModel,
  CostProviderNodeModel,
  FixedPriceLineItemViewModel,
  SupplyType,
  SupplyTypeText,
  TariffCategoryViewModel,
  TariffLineItemChargingType,
  TariffStepModel,
  TariffVersionInfoViewModel
} from '@models';
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Action as StoreAction} from '@ngrx/store';
import {FormGroupState, unbox} from 'ngrx-forms';

import {NgbDateFRParserFormatter, ngbDateNgrxValueConverter, sortRule} from '@shared-helpers';
import * as formActions from '../../store/actions/tariff-form.actions';
import {AddLineItemComponent} from '../add-line-item/add-line-item.component';
import {FormValue} from '../../store/reducers/tariff-form.store';

@Component({
  selector: 'edit-tariff',
  templateUrl: './edit-tariff.component.html',
  styleUrls: ['./edit-tariff.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class EditTariffComponent {
  @Input() supplyTypes: SupplyType[];
  @Input() buildingCategories: TariffCategoryViewModel[];
  @Input() tariffVersionCategories: TariffCategoryViewModel[];
  @Input() tariffVersionSteps: TariffStepModel[];
  @Input() attributes: any[];
  @Input() units: any[];
  @Input() chargingTypes: any[];
  @Input() lineItems: any[];
  @Input() costProviderNodes: CostProviderNodeModel[] = [];
  @Input() dispatch: (a: StoreAction) => void;
  @Input() showCostTariffProperty = false;
  @Output() goToVersion = new EventEmitter();
  versions: TariffVersionInfoViewModel[] = [];
  subVersions: TariffVersionInfoViewModel[] = [];
  supplyTypeText = SupplyTypeText;
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  supplyType = SupplyType;
  lineItemChargingTypes = TariffLineItemChargingType;
  lineItemControls: {
    lineItem: FormGroupState<BasedOnReadingsLineItemViewModel
      | BasedOnReadingsAndSettingsLineItemViewModel
      | BasedOnAttributesLineItemViewModel
      | BasedOnCalculationsLineItemViewModel
      | FixedPriceLineItemViewModel>;
    type: TariffLineItemChargingType;
  }[] = [];

  constructor(
    private modalService: NgbModal
  ) {
  }

  private _form: FormGroupState<FormValue>;

  get form(): FormGroupState<FormValue> {
    return this._form;
  }

  @Input() set form(value: FormGroupState<FormValue>) {
    this._form = value;
    this.updateSubVersions();
    this.updateLineItemControls();
  }

  private _tariffVersions: TariffVersionInfoViewModel[] = [];

  get tariffVersions(): TariffVersionInfoViewModel[] {
    return this._tariffVersions;
  }

  @Input()
  set tariffVersions(value: TariffVersionInfoViewModel[]) {
    this._tariffVersions = value;
    this.updateSubVersions();
  }

  onDisableForNewCustomersChanged() {
    let today = null;

    if (!this.form.controls.disableForNewCustomers.value) {
      today = new Date().toISOString();
    }

    this.dispatchWithFormId(new formActions.UpdateDisableAfter(today));
  }

  onSupplyTypeChanged(controlId, supplyType) {
    this.dispatchWithFormId(new formActions.UpdateSupplyTypeForEdit(supplyType));
  }

  onUpdateChargingType(event) {
    this.dispatchWithFormId(new formActions.UpdateLineItemChargingType(event));
  }

  onUpdateAttribute(controlId, attrId) {
    this.dispatchWithFormId(new formActions.UpdateAttribute({lineItemControlId: controlId, attributeId: attrId}));
  }

  onUpdateUnitOfMeasurement(controlId, unitOfMeasurement) {
    this.dispatchWithFormId(new formActions.UpdateUnitOfMeasurement({
      lineItemControlId: controlId, unitOfMeasurement: unitOfMeasurement
    }));
  }

  onDeleteLineItem(event) {
    this.dispatchWithFormId(new formActions.DeleteLineItem(event));
  }

  onChangeDependentLineItems(controlId, dependentLineItemIds) {
    this.dispatchWithFormId(new formActions.UpdateDependentLineItems({
      lineItemControlId: controlId,
      dependentLineItemIds
    }));
  }

  onResetCostProviderId(event, controlId) {
    this.dispatchWithFormId(new formActions.ResetCostProvideId({lineItemControlId: controlId, value: event}));
  }

  onAddLineItem() {
    const modalRef = this.modalService.open(AddLineItemComponent, {backdrop: 'static'});
    modalRef.componentInstance.chargingTypes = this.chargingTypes;
    modalRef.result.then((data) => this.dispatchWithFormId(
        new formActions.CreateLineItem(data)),
      (e) => {/* closed - do nothing */
      });
  }

  onBuildingCategoryToggled(category: CategoryViewModel) {
    this.dispatchWithFormId(new formActions.ToggleBuildingCategory({categoryId: category.id}));
  }

  isBuildingCategoryChecked(category: CategoryViewModel, control) {
    const categories = control && control.value && unbox(control.value);
    return categories && !!categories.find(id => id === category.id);
  }

  getLineItemSectionNumber(index: number): number {
    return ++index;
  }

  trackByControlId = (index, item) => item.lineItem.id;

  updateSubVersions(): void {
    const majorVersion = this.form?.value?.majorVersion;

    const version = this.tariffVersions.find(item => item.majorVersion === majorVersion);

    this.subVersions = version ? version.subVersions : [];
  }

  navigateToVersion(version: TariffVersionInfoViewModel): void {
    this.goToVersion.emit(version.versionId)
  }

  private dispatchWithFormId(a) {
    a['formId'] = this.form.id;
    this.dispatchAction(a);
  }

  private dispatchAction(a) {
    if (this.dispatch) {
      this.dispatch(a);
    } else {
      throw new Error('dispatch not provided');
    }
  }

  private updateLineItemControls() {
    let liControls: any[] = this.mapLineItemControlsToViewCollection(
      this.form.controls.basedOnAttributesLineItems,
      TariffLineItemChargingType.BasedOnAttributes
    );
    liControls = liControls.concat(this.mapLineItemControlsToViewCollection(
      this.form.controls.basedOnReadingsLineItems,
      TariffLineItemChargingType.BasedOnReadings
    ));
    liControls = liControls.concat(this.mapLineItemControlsToViewCollection(
      this.form.controls.basedOnReadingsAndSettingsLineItems,
      TariffLineItemChargingType.BasedOnReadingsAndSettings
    ));
    liControls = liControls.concat(this.mapLineItemControlsToViewCollection(
      this.form.controls.fixedPriceLineItems,
      TariffLineItemChargingType.FixedPrice
    ));
    liControls = liControls.concat(this.mapLineItemControlsToViewCollection(
      this.form.controls.basedOnCalculationsLineItems,
      TariffLineItemChargingType.BasedOnCalculations
    ));
    this.lineItemControls = liControls.sort((a, b) => sortRule(a.lineItem.value.controlPosition, b.lineItem.value.controlPosition));
  }

  private mapLineItemControlsToViewCollection = (lineItemsState: any, type: TariffLineItemChargingType) =>
    lineItemsState.controls.map(c => ({
      lineItem: c,
      type: type
    }))
}
