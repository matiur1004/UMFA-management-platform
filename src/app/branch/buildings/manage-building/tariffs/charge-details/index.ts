import {ChargeDetailsComponent} from './charge-details.component';
import {EditChargeVersionComponent} from './edit-charge-version/edit-charge-version.component';
import {EditChargeValueComponent} from './edit-charge-value/edit-charge-value.component';
import {BasedOnReadingsChargeLineItemComponent} from './charge-line-items/based-on-readings-charge-line-item/readings-charge-line-item.component';
import {FixedPriceChargeLineItemComponent} from './charge-line-items/fixed-price-charge-line-item/fixed-price-charge-line-item.component';
import {ChargeValuesVersionsListComponent} from './charge-values-versions-list/charge-values-versions-list.component';

export const chargeDetails: any[] = [
  ChargeDetailsComponent,
  EditChargeVersionComponent,
  EditChargeValueComponent,
  BasedOnReadingsChargeLineItemComponent,
  FixedPriceChargeLineItemComponent,
  ChargeValuesVersionsListComponent,
];

export * from './charge-details.component';
export * from './edit-charge-version/edit-charge-version.component';
export * from './edit-charge-value/edit-charge-value.component';
export * from './charge-line-items/based-on-readings-charge-line-item/readings-charge-line-item.component';
export * from './charge-line-items/fixed-price-charge-line-item/fixed-price-charge-line-item.component';
export * from './charge-values-versions-list/charge-values-versions-list.component';
