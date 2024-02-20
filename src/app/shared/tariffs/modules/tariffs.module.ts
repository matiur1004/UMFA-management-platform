import {PipesModule} from 'app/shared/pipes/pipes.module';
import {AddTariffCategoryOrStepPopupComponent} from './../add-tariff-category-or-step-popup/add-tariff-category-or-step-popup.component';
import {RouterModule} from '@angular/router';
import {TariffsItemComponent} from '../tariffs-item/tariffs-item.component';
import {CreateTariffComponent} from '../tariff-create/tariff-create.component';
import {TariffsListComponent} from '../tariffs-list/tariffs-list.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgrxFormsModule} from 'ngrx-forms';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {TextMaskModule} from 'angular2-text-mask';
import {BasedOnAttributesLineItemComponent} from '../tariff-details/tariff-line-items/based-on-attributes-line-item/attributes-line-item.component';
import {BasedOnCalculationsLineItemComponent} from '../tariff-details/tariff-line-items/based-on-calculations-line-item/calculations-line-item.component';
import {BasedOnReadingsLineItemComponent} from '../tariff-details/tariff-line-items/based-on-readings-line-item/readings-line-item.component';
import {FixedPriceLineItemComponent} from '../tariff-details/tariff-line-items/fixed-price-line-item/fixed-price-line-item.component';
import {BasedOnReadingsAndSettingsLineItemComponent} from '../tariff-details/tariff-line-items/based-on-readings-and-settings-line-item/read-and-set-line-item.component';
import {TariffVersionsListComponent} from '../tariff-details/tariff-versions-list/tariff-versions-list.component';
import {AddLineItemComponent} from '../tariff-details/add-line-item/add-line-item.component';
import {EditTariffComponent} from '../tariff-details/edit-tariff.component/edit-tariff.component';
import {TariffValuesVersionsListComponent} from '../tariff-values/tariff-values-versions-list/tariff-values-versions-list.component';
import {ConsumptionChargeComponent} from '../tariff-values/consumption-charge/consumption-charge.component';
import {ChargesTableComponent} from '../tariff-values/charges-table/charges-table.component';
import {PublicHolidaysComponent} from '../tariff-values/public-holidays/public-holidays.component';
import {TariffValuesFormComponent} from '../tariff-values/tariff-values-form/tariff-values-form.component';
import {AddVersionValueComponent} from '../tariff-values/add-version-value/add-version-value.component';
import {ChangeSupplyTypeComponent} from '../tariff-details/change-supply-type/change-supply-type.component';
import {NewTariffVersionComponent} from '../tariff-details/new-tariff-version/new-tariff-version.component';
import {TariffVersionSettingsService} from "../services/tariff-version-settings.service";
import { NgxMaskModule } from 'ngx-mask';

const components = [
  TariffsItemComponent,
  CreateTariffComponent,
  TariffsListComponent,
  BasedOnAttributesLineItemComponent,
  BasedOnCalculationsLineItemComponent,
  BasedOnReadingsAndSettingsLineItemComponent,
  BasedOnReadingsLineItemComponent,
  FixedPriceLineItemComponent,
  TariffVersionsListComponent,
  AddLineItemComponent,
  EditTariffComponent,
  TariffValuesVersionsListComponent,
  ConsumptionChargeComponent,
  ChargesTableComponent,
  PublicHolidaysComponent,
  TariffValuesFormComponent,
  AddVersionValueComponent,
  ChangeSupplyTypeComponent,
  NewTariffVersionComponent,
  AddTariffCategoryOrStepPopupComponent
];

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgrxFormsModule,
    WidgetsModule,
    DunamisInputsModule,
    //TextMaskModule,
    NgxMaskModule,
    RouterModule,
    PipesModule,
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
  // entryComponents: [
  //   AddLineItemComponent,
  //   CreateTariffComponent,
  //   AddVersionValueComponent,
  //   ChangeSupplyTypeComponent,
  //   NewTariffVersionComponent
  // ],
  providers: [
    TariffVersionSettingsService
  ]
})
export class TariffsModule {
}
